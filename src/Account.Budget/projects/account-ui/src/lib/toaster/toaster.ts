import { Directionality } from '@angular/cdk/bidi';
import {
  ComponentType,
  Overlay,
  OverlayConfig,
  OverlayContainer,
  OverlayRef,
  ScrollStrategy,
} from '@angular/cdk/overlay';
import { BasePortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import {
  Inject,
  Injectable,
  InjectFlags,
  Injector,
  OnDestroy,
  Optional,
  SkipSelf,
  StaticProvider,
  TemplateRef,
  Type,
} from '@angular/core';
import { defer, Observable, of as observableOf, startWith, Subject } from 'rxjs';

import { ToasterConfig } from './toaster-config';
import { ToasterContainer } from './toaster-container';
import { DEFAULT_DIALOG_CONFIG, DIALOG_DATA, DIALOG_SCROLL_STRATEGY } from './toaster-injectors';
import { ToasterRef } from './toaster-ref';

/** Unique id for the created toaster. */
let uniqueId = 0;

@Injectable()
export class Toaster implements OnDestroy {
  private _openToastersAtThisLevel: ToasterRef<any, any>[] = [];
  private readonly _afterAllClosedAtThisLevel = new Subject<void>();
  private readonly _afterOpenedAtThisLevel = new Subject<ToasterRef>();
  private _ariaHiddenElements = new Map<Element, string | null>();
  private _scrollStrategy: () => ScrollStrategy;

  /** Keeps track of the currently-open toasters. */
  get openToasters(): readonly ToasterRef<any, any>[] {
    return this._parentToaster ? this._parentToaster.openToasters : this._openToastersAtThisLevel;
  }

  /** Stream that emits when a toaster has been opened. */
  get afterOpened(): Subject<ToasterRef<any, any>> {
    return this._parentToaster ? this._parentToaster.afterOpened : this._afterOpenedAtThisLevel;
  }

  /**
   * Stream that emits when all open toaster have finished closing.
   * Will emit on subscribe if there are no open toasters to begin with.
   */
  readonly afterAllClosed: Observable<void> = defer(() =>
    this.openToasters.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(startWith(undefined)),
  );

  constructor(
    private _overlay: Overlay,
    private _injector: Injector,
    @Optional() @Inject(DEFAULT_DIALOG_CONFIG) private _defaultOptions: ToasterConfig,
    @Optional() @SkipSelf() private _parentToaster: Toaster,
    private _overlayContainer: OverlayContainer,
    @Inject(DIALOG_SCROLL_STRATEGY) scrollStrategy: any,
  ) {
    this._scrollStrategy = scrollStrategy;
  }

  /**
   * Opens a modal toaster containing the given component.
   * @param component Type of the component to load into the toaster.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened toaster.
   */
  open<R = unknown, D = unknown, C = unknown>(
    component: ComponentType<C>,
    config?: ToasterConfig<D, ToasterRef<R, C>>,
  ): ToasterRef<R, C>;

  /**
   * Opens a modal toaster containing the given template.
   * @param template TemplateRef to instantiate as the toaster content.
   * @param config Extra configuration options.
   * @returns Reference to the newly-opened toaster.
   */
  open<R = unknown, D = unknown, C = unknown>(
    template: TemplateRef<C>,
    config?: ToasterConfig<D, ToasterRef<R, C>>,
  ): ToasterRef<R, C>;

  open<R = unknown, D = unknown, C = unknown>(
    componentOrTemplateRef: ComponentType<C> | TemplateRef<C>,
    config?: ToasterConfig<D, ToasterRef<R, C>>,
  ): ToasterRef<R, C>;

  open<R = unknown, D = unknown, C = unknown>(
    componentOrTemplateRef: ComponentType<C> | TemplateRef<C>,
    config?: ToasterConfig<D, ToasterRef<R, C>>,
  ): ToasterRef<R, C> {
    const defaults = (this._defaultOptions || new ToasterConfig()) as ToasterConfig<D, ToasterRef<R, C>>;
    config = { ...defaults, ...config };
    config.id = config.id || `cdk-toaster-${uniqueId++}`;

    if (config.id && this.getToasterById(config.id) && (typeof ngDevMode === 'undefined' || ngDevMode)) {
      throw Error(`Toaster with id "${config.id}" exists already. The toaster id must be unique.`);
    }

    const overlayConfig = this._getOverlayConfig(config);
    const overlayRef = this._overlay.create(overlayConfig);
    const toasterRef = new ToasterRef(overlayRef, config);
    const toasterContainer = this._attachContainer(overlayRef, toasterRef, config);

    (toasterRef as { containerInstance: BasePortalOutlet }).containerInstance = toasterContainer;
    this._attachToasterContent(componentOrTemplateRef, toasterRef, toasterContainer, config);

    // If this is the first toaster that we're opening, hide all the non-overlay content.
    if (!this.openToasters.length) {
      this._hideNonToasterContentFromAssistiveTechnology();
    }

    (this.openToasters as ToasterRef<R, C>[]).push(toasterRef);
    toasterRef.closed.subscribe(() => this._removeOpenToaster(toasterRef, true));
    this.afterOpened.next(toasterRef);

    return toasterRef;
  }

  /**
   * Closes all of the currently-open toasters.
   */
  closeAll(): void {
    reverseForEach(this.openToasters, toaster => toaster.close());
  }

  /**
   * Finds an open toaster by its id.
   * @param id ID to use when looking up the toaster.
   */
  getToasterById<R, C>(id: string): ToasterRef<R, C> | undefined {
    return this.openToasters.find(toaster => toaster.id === id);
  }

  ngOnDestroy() {
    // Make one pass over all the toasters that need to be untracked, but should not be closed. We
    // want to stop tracking the open toaster even if it hasn't been closed, because the tracking
    // determines when `aria-hidden` is removed from elements outside the toaster.
    reverseForEach(this._openToastersAtThisLevel, toaster => {
      // Check for `false` specifically since we want `undefined` to be interpreted as `true`.
      if (toaster.config.closeOnDestroy === false) {
        this._removeOpenToaster(toaster, false);
      }
    });

    // Make a second pass and close the remaining toasters. We do this second pass in order to
    // correctly dispatch the `afterAllClosed` event in case we have a mixed array of toasters
    // that should be closed and toasters that should not.
    reverseForEach(this._openToastersAtThisLevel, toaster => toaster.close());

    this._afterAllClosedAtThisLevel.complete();
    this._afterOpenedAtThisLevel.complete();
    this._openToastersAtThisLevel = [];
  }

  /**
   * Creates an overlay config from a toaster config.
   * @param config The toaster configuration.
   * @returns The overlay configuration.
   */
  private _getOverlayConfig<D, R>(config: ToasterConfig<D, R>): OverlayConfig {
    const state = new OverlayConfig({
      positionStrategy:
        config.positionStrategy || this._overlay.position().global().centerHorizontally().centerVertically(),
      scrollStrategy: config.scrollStrategy || this._scrollStrategy(),
      panelClass: config.panelClass,
      hasBackdrop: config.hasBackdrop,
      direction: config.direction,
      minWidth: config.minWidth,
      minHeight: config.minHeight,
      maxWidth: config.maxWidth,
      maxHeight: config.maxHeight,
      width: config.width,
      height: config.height,
      disposeOnNavigation: config.closeOnNavigation,
    });

    if (config.backdropClass) {
      state.backdropClass = config.backdropClass;
    }

    return state;
  }

  /**
   * Attaches a toaster container to a toaster's already-created overlay.
   * @param overlay Reference to the toaster's underlying overlay.
   * @param config The toaster configuration.
   * @returns A promise resolving to a ComponentRef for the attached container.
   */
  private _attachContainer<R, D, C>(
    overlay: OverlayRef,
    toasterRef: ToasterRef<R, C>,
    config: ToasterConfig<D, ToasterRef<R, C>>,
  ): BasePortalOutlet {
    const userInjector = config.injector || config.viewContainerRef?.injector;
    const providers: StaticProvider[] = [
      { provide: ToasterConfig, useValue: config },
      { provide: ToasterRef, useValue: toasterRef },
      { provide: OverlayRef, useValue: overlay },
    ];
    let containerType: Type<BasePortalOutlet>;

    if (config.container) {
      if (typeof config.container === 'function') {
        containerType = config.container;
      } else {
        containerType = config.container.type;
        providers.push(...config.container.providers(config));
      }
    } else {
      containerType = ToasterContainer;
    }

    const containerPortal = new ComponentPortal(
      containerType,
      config.viewContainerRef,
      Injector.create({ parent: userInjector || this._injector, providers }),
      config.componentFactoryResolver,
    );
    const containerRef = overlay.attach(containerPortal);

    return containerRef.instance;
  }

  /**
   * Attaches the user-provided component to the already-created toaster container.
   * @param componentOrTemplateRef The type of component being loaded into the toaster,
   *     or a TemplateRef to instantiate as the content.
   * @param toasterRef Reference to the toaster being opened.
   * @param toasterContainer Component that is going to wrap the toaster content.
   * @param config Configuration used to open the toaster.
   */
  private _attachToasterContent<R, D, C>(
    componentOrTemplateRef: ComponentType<C> | TemplateRef<C>,
    toasterRef: ToasterRef<R, C>,
    toasterContainer: BasePortalOutlet,
    config: ToasterConfig<D, ToasterRef<R, C>>,
  ) {
    if (componentOrTemplateRef instanceof TemplateRef) {
      const injector = this._createInjector(config, toasterRef, toasterContainer, undefined);
      let context: any = { $implicit: config.data, toasterRef };

      if (config.templateContext) {
        context = {
          ...context,
          ...(typeof config.templateContext === 'function' ? config.templateContext() : config.templateContext),
        };
      }

      toasterContainer.attachTemplatePortal(new TemplatePortal<C>(componentOrTemplateRef, null!, context, injector));
    } else {
      const injector = this._createInjector(config, toasterRef, toasterContainer, this._injector);
      const contentRef = toasterContainer.attachComponentPortal<C>(
        new ComponentPortal(componentOrTemplateRef, config.viewContainerRef, injector, config.componentFactoryResolver),
      );
      (toasterRef as { componentInstance: C }).componentInstance = contentRef.instance;
    }
  }

  /**
   * Creates a custom injector to be used inside the toaster. This allows a component loaded inside
   * of a toaster to close itself and, optionally, to return a value.
   * @param config Config object that is used to construct the toaster.
   * @param toasterRef Reference to the toaster being opened.
   * @param toasterContainer Component that is going to wrap the toaster content.
   * @param fallbackInjector Injector to use as a fallback when a lookup fails in the custom
   * toaster injector, if the user didn't provide a custom one.
   * @returns The custom injector that can be used inside the toaster.
   */
  private _createInjector<R, D, C>(
    config: ToasterConfig<D, ToasterRef<R, C>>,
    toasterRef: ToasterRef<R, C>,
    toasterContainer: BasePortalOutlet,
    fallbackInjector: Injector | undefined,
  ): Injector {
    const userInjector = config.injector || config.viewContainerRef?.injector;
    const providers: StaticProvider[] = [
      { provide: DIALOG_DATA, useValue: config.data },
      { provide: ToasterRef, useValue: toasterRef },
    ];

    if (config.providers) {
      if (typeof config.providers === 'function') {
        providers.push(...config.providers(toasterRef, config, toasterContainer));
      } else {
        providers.push(...config.providers);
      }
    }

    if (
      config.direction &&
      (!userInjector || !userInjector.get<Directionality | null>(Directionality, null, InjectFlags.Optional))
    ) {
      providers.push({
        provide: Directionality,
        useValue: { value: config.direction, change: observableOf() },
      });
    }

    return Injector.create({ parent: userInjector || fallbackInjector, providers });
  }

  /**
   * Removes a toaster from the array of open toasters.
   * @param toasterRef Toaster to be removed.
   * @param emitEvent Whether to emit an event if this is the last toaster.
   */
  private _removeOpenToaster<R, C>(toasterRef: ToasterRef<R, C>, emitEvent: boolean) {
    const index = this.openToasters.indexOf(toasterRef);

    if (index > -1) {
      (this.openToasters as ToasterRef<R, C>[]).splice(index, 1);

      // If all the toasters were closed, remove/restore the `aria-hidden`
      // to a the siblings and emit to the `afterAllClosed` stream.
      if (!this.openToasters.length) {
        this._ariaHiddenElements.forEach((previousValue, element) => {
          if (previousValue) {
            element.setAttribute('aria-hidden', previousValue);
          } else {
            element.removeAttribute('aria-hidden');
          }
        });

        this._ariaHiddenElements.clear();

        if (emitEvent) {
          this._getAfterAllClosed().next();
        }
      }
    }
  }

  /** Hides all of the content that isn't an overlay from assistive technology. */
  private _hideNonToasterContentFromAssistiveTechnology() {
    const overlayContainer = this._overlayContainer.getContainerElement();

    // Ensure that the overlay container is attached to the DOM.
    if (overlayContainer.parentElement) {
      const siblings = overlayContainer.parentElement.children;

      for (let i = siblings.length - 1; i > -1; i--) {
        const sibling = siblings[i];

        if (
          sibling !== overlayContainer &&
          sibling.nodeName !== 'SCRIPT' &&
          sibling.nodeName !== 'STYLE' &&
          !sibling.hasAttribute('aria-live')
        ) {
          this._ariaHiddenElements.set(sibling, sibling.getAttribute('aria-hidden'));
          sibling.setAttribute('aria-hidden', 'true');
        }
      }
    }
  }

  private _getAfterAllClosed(): Subject<void> {
    const parent = this._parentToaster;
    return parent ? parent._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
  }
}

/**
 * Executes a callback against all elements in an array while iterating in reverse.
 * Useful if the array is being modified as it is being iterated.
 */
function reverseForEach<T>(items: T[] | readonly T[], callback: (current: T) => void) {
  let i = items.length;

  while (i--) {
    callback(items[i]);
  }
}
