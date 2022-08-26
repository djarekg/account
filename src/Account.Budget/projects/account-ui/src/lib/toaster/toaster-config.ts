/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Direction } from '@angular/cdk/bidi';
import { PositionStrategy, ScrollStrategy } from '@angular/cdk/overlay';
import { BasePortalOutlet } from '@angular/cdk/portal';
import { ComponentFactoryResolver, Injector, StaticProvider, Type, ViewContainerRef } from '@angular/core';

/** Options for where to set focus to automatically on toaster open */
export type AutoFocusTarget = 'toaster' | 'first-tabbable' | 'first-heading';

/** Valid ARIA roles for a toaster. */
export type ToasterRole = 'toaster' | 'alerttoaster';

/** Configuration for opening a modal toaster. */
export class ToasterConfig<D = unknown, R = unknown, C extends BasePortalOutlet = BasePortalOutlet> {
  /**
   * Where the attached component should live in Angular's *logical* component tree.
   * This affects what is available for injection and the change detection order for the
   * component instantiated inside of the toaster. This does not affect where the toaster
   * content will be rendered.
   */
  viewContainerRef?: ViewContainerRef;

  /**
   * Injector used for the instantiation of the component to be attached. If provided,
   * takes precedence over the injector indirectly provided by `ViewContainerRef`.
   */
  injector?: Injector;

  /** ID for the toaster. If omitted, a unique one will be generated. */
  id?: string;

  /** The ARIA role of the toaster element. */
  role?: ToasterRole = 'toaster';

  /** Optional CSS class or classes applied to the overlay panel. */
  panelClass?: string | string[] = '';

  /** Whether the toaster has a backdrop. */
  hasBackdrop?: boolean = true;

  /** Optional CSS class or classes applied to the overlay backdrop. */
  backdropClass?: string | string[] = '';

  /** Whether the toaster closes with the escape key or pointer events outside the panel element. */
  disableClose?: boolean = false;

  /** Width of the toaster. */
  width?: string = '';

  /** Height of the toaster. */
  height?: string = '';

  /** Min-width of the toaster. If a number is provided, assumes pixel units. */
  minWidth?: number | string;

  /** Min-height of the toaster. If a number is provided, assumes pixel units. */
  minHeight?: number | string;

  /** Max-width of the toaster. If a number is provided, assumes pixel units. Defaults to 80vw. */
  maxWidth?: number | string;

  /** Max-height of the toaster. If a number is provided, assumes pixel units. */
  maxHeight?: number | string;

  /** Strategy to use when positioning the toaster. Defaults to centering it on the page. */
  positionStrategy?: PositionStrategy;

  /** Data being injected into the child component. */
  data?: D | null = null;

  /** Layout direction for the toaster's content. */
  direction?: Direction;

  /** ID of the element that describes the toaster. */
  ariaDescribedBy?: string | null = null;

  /** ID of the element that labels the toaster. */
  ariaLabelledBy?: string | null = null;

  /** Toaster label applied via `aria-label` */
  ariaLabel?: string | null = null;

  /** Whether this a modal toaster. Used to set the `aria-modal` attribute. */
  ariaModal?: boolean = true;

  /**
   * Where the toaster should focus on open.
   * @breaking-change 14.0.0 Remove boolean option from autoFocus. Use string or
   * AutoFocusTarget instead.
   */
  autoFocus?: AutoFocusTarget | string | boolean = 'first-tabbable';

  /**
   * Whether the toaster should restore focus to the previously-focused element upon closing.
   * Has the following behavior based on the type that is passed in:
   * - `boolean` - when true, will return focus to the element that was focused before the toaster
   *    was opened, otherwise won't restore focus at all.
   * - `string` - focus will be restored to the first element that matches the CSS selector.
   * - `HTMLElement` - focus will be restored to the specific element.
   */
  restoreFocus?: boolean | string | HTMLElement = true;

  /**
   * Scroll strategy to be used for the toaster. This determines how
   * the toaster responds to scrolling underneath the panel element.
   */
  scrollStrategy?: ScrollStrategy;

  /**
   * Whether the toaster should close when the user navigates backwards or forwards through browser
   * history. This does not apply to navigation via anchor element unless using URL-hash based
   * routing (`HashLocationStrategy` in the Angular router).
   */
  closeOnNavigation?: boolean = true;

  /**
   * Whether the toaster should close when the toaster service is destroyed. This is useful if
   * another service is wrapping the toaster and is managing the destruction instead.
   */
  closeOnDestroy?: boolean = true;

  /** Alternate `ComponentFactoryResolver` to use when resolving the associated component. */
  componentFactoryResolver?: ComponentFactoryResolver;

  /**
   * Providers that will be exposed to the contents of the toaster. Can also
   * be provided as a function in order to generate the providers lazily.
   */
  providers?: StaticProvider[] | ((toasterRef: R, config: ToasterConfig<D, R, C>, container: C) => StaticProvider[]);

  /**
   * Component into which the toaster content will be rendered. Defaults to `ToasterContainer`.
   * A configuration object can be passed in to customize the providers that will be exposed
   * to the toaster container.
   */
  container?:
    | Type<C>
    | {
        type: Type<C>;
        providers: (config: ToasterConfig<D, R, C>) => StaticProvider[];
      };

  /**
   * Context that will be passed to template-based toasters.
   * A function can be passed in to resolve the context lazily.
   */
  templateContext?: Record<string, any> | (() => Record<string, any>);
}
