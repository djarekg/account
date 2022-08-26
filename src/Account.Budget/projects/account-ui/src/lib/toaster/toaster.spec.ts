import { Directionality } from '@angular/cdk/bidi';
import { A, ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayContainer } from '@angular/cdk/overlay';
import { _supportsShadowDom } from '@angular/cdk/platform';
import { createKeyboardEvent, dispatchEvent, dispatchKeyboardEvent } from '@angular/cdk/testing/private';
import { Location } from '@angular/common';
import { SpyLocation } from '@angular/common/testing';
import {
  ChangeDetectionStrategy,
  Component,
  Directive,
  inject,
  Inject,
  InjectionToken,
  Injector,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ViewEncapsulation,
} from '@angular/core';
import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DIALOG_DATA, Toaster, ToasterModule, ToasterRef } from './index';

describe('Toaster', () => {
  let toaster: Toaster;
  let overlayContainerElement: HTMLElement;

  let testViewContainerRef: ViewContainerRef;
  let viewContainerFixture: ComponentFixture<ComponentWithChildViewContainer>;
  let mockLocation: SpyLocation;
  let overlay: Overlay;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [ToasterModule],
      declarations: [
        ComponentWithChildViewContainer,
        ComponentWithTemplateRef,
        PizzaMsg,
        ContentElementToaster,
        ToasterWithInjectedData,
        ToasterWithoutFocusableElements,
        DirectiveWithViewContainer,
        TemplateInjectorParentComponent,
        TemplateInjectorInnerDirective,
      ],
      providers: [
        { provide: Location, useClass: SpyLocation },
        { provide: TEMPLATE_INJECTOR_TEST_TOKEN, useValue: 'hello from test module' },
      ],
    });

    TestBed.compileComponents();

    toaster = TestBed.inject(Toaster);
    mockLocation = TestBed.inject(Location) as SpyLocation;
    overlay = TestBed.inject(Overlay);
    overlayContainerElement = TestBed.inject(OverlayContainer).getContainerElement();

    viewContainerFixture = TestBed.createComponent(ComponentWithChildViewContainer);
    viewContainerFixture.detectChanges();
    testViewContainerRef = viewContainerFixture.componentInstance.childViewContainer;
  }));

  it('should open a toaster with a component', () => {
    let toasterRef = toaster.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(toasterRef.componentInstance instanceof PizzaMsg).toBe(true);
    expect(toasterRef.componentInstance!.toasterRef).toBe(toasterRef);

    viewContainerFixture.detectChanges();
    viewContainerFixture.detectChanges();
    let toasterContainerElement = overlayContainerElement.querySelector('cdk-toaster-container')!;
    expect(toasterContainerElement.getAttribute('role')).toBe('toaster');
    expect(toasterContainerElement.getAttribute('aria-modal')).toBe('true');
  });

  it('should open a toaster with a template', () => {
    const templateRefFixture = TestBed.createComponent(ComponentWithTemplateRef);
    templateRefFixture.componentInstance.localValue = 'Bees';
    templateRefFixture.detectChanges();

    const data = { value: 'Knees' };

    let toasterRef = toaster.open(templateRefFixture.componentInstance.templateRef, {
      data,
    });

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Cheese Bees Knees');
    expect(templateRefFixture.componentInstance.toasterRef).toBe(toasterRef);

    viewContainerFixture.detectChanges();

    let toasterContainerElement = overlayContainerElement.querySelector('cdk-toaster-container')!;
    expect(toasterContainerElement.getAttribute('role')).toBe('toaster');
    expect(toasterContainerElement.getAttribute('aria-modal')).toBe('true');

    toasterRef.close();
  });

  it('should use injector from viewContainerRef for ToasterInjector', () => {
    let toasterRef = toaster.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
    });

    viewContainerFixture.detectChanges();

    let toasterInjector = toasterRef.componentInstance!.toasterInjector as Injector;

    expect(toasterRef.componentInstance!.toasterRef).toBe(toasterRef);
    expect(toasterInjector.get<DirectiveWithViewContainer>(DirectiveWithViewContainer)).toBeTruthy(
      'Expected the toaster component to be created with the injector from the viewContainerRef.',
    );
  });

  it('should use custom injector', () => {
    const token = new InjectionToken<string>('message');
    const injector = Injector.create({ providers: [{ provide: token, useValue: 'hello' }] });
    const toasterRef = toaster.open(PizzaMsg, { injector });
    viewContainerFixture.detectChanges();

    expect(toasterRef.componentInstance?.toasterInjector.get(token)).toBe('hello');
  });

  it('should open a toaster with a component and no ViewContainerRef', () => {
    let toasterRef = toaster.open(PizzaMsg);

    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.textContent).toContain('Pizza');
    expect(toasterRef.componentInstance instanceof PizzaMsg).toBe(true);
    expect(toasterRef.componentInstance!.toasterRef).toBe(toasterRef);

    viewContainerFixture.detectChanges();
    let toasterContainerElement = overlayContainerElement.querySelector('cdk-toaster-container')!;
    expect(toasterContainerElement.getAttribute('role')).toBe('toaster');
  });

  it('should apply the configured role to the toaster element', () => {
    toaster.open(PizzaMsg, { role: 'alerttoaster' });

    viewContainerFixture.detectChanges();

    let toasterContainerElement = overlayContainerElement.querySelector('cdk-toaster-container')!;
    expect(toasterContainerElement.getAttribute('role')).toBe('alerttoaster');
  });

  it('should apply the specified `aria-describedby`', () => {
    toaster.open(PizzaMsg, { ariaDescribedBy: 'description-element' });

    viewContainerFixture.detectChanges();

    let toasterContainerElement = overlayContainerElement.querySelector('cdk-toaster-container')!;
    expect(toasterContainerElement.getAttribute('aria-describedby')).toBe('description-element');
  });

  it('should close a toaster and get back a result', fakeAsync(() => {
    let toasterRef = toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    let afterCloseCallback = jasmine.createSpy('afterClose callback');

    viewContainerFixture.detectChanges();
    toasterRef.closed.subscribe(afterCloseCallback);
    toasterRef.close('Charmander');
    viewContainerFixture.detectChanges();
    flush();

    expect(afterCloseCallback).toHaveBeenCalledWith('Charmander');
    expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeNull();
  }));

  it('should only emit the afterCloseEvent once when closed', fakeAsync(() => {
    let toasterRef = toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    let afterCloseCallback = jasmine.createSpy('afterClose callback');

    viewContainerFixture.detectChanges();
    toasterRef.closed.subscribe(afterCloseCallback);
    toasterRef.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(afterCloseCallback).toHaveBeenCalledTimes(1);
  }));

  it('should close a toaster via the escape key', fakeAsync(() => {
    toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    viewContainerFixture.detectChanges();
    const event = dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeNull();
    expect(event.defaultPrevented).toBe(true);
  }));

  it('should not close a toaster via the escape key if a modifier is pressed', fakeAsync(() => {
    toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    viewContainerFixture.detectChanges();
    const event = createKeyboardEvent('keydown', ESCAPE, undefined, { alt: true });
    dispatchEvent(document.body, event);
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeTruthy();
    expect(event.defaultPrevented).toBe(false);
  }));

  it('should close from a ViewContainerRef with OnPush change detection', fakeAsync(() => {
    const onPushFixture = TestBed.createComponent(ComponentWithOnPushViewContainer);

    onPushFixture.detectChanges();

    const toasterRef = toaster.open(PizzaMsg, {
      viewContainerRef: onPushFixture.componentInstance.viewContainerRef,
    });

    flushMicrotasks();
    onPushFixture.detectChanges();
    flushMicrotasks();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length)
      .withContext('Expected one open toaster.')
      .toBe(1);

    toasterRef.close();
    flushMicrotasks();
    onPushFixture.detectChanges();
    tick(500);

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length)
      .withContext('Expected no open toasters.')
      .toBe(0);
  }));

  it('should close when clicking on the overlay backdrop', fakeAsync(() => {
    toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    backdrop.click();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeFalsy();
  }));

  it('should emit the backdropClick stream when clicking on the overlay backdrop', fakeAsync(() => {
    const toasterRef = toaster.open(PizzaMsg, {
      viewContainerRef: testViewContainerRef,
      // Disable closing so the backdrop doesn't go away immediately.
      disableClose: true,
    });
    const spy = jasmine.createSpy('backdropClick spy');
    toasterRef.backdropClick.subscribe(spy);
    viewContainerFixture.detectChanges();

    const backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;

    backdrop.click();
    viewContainerFixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);

    // Additional clicks after the toaster has closed should not be emitted
    toasterRef.disableClose = false;
    backdrop.click();
    viewContainerFixture.detectChanges();
    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should emit the keyboardEvent stream when key events target the overlay', fakeAsync(() => {
    const toasterRef = toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    const spy = jasmine.createSpy('keyboardEvent spy');
    toasterRef.keydownEvents.subscribe(spy);

    viewContainerFixture.detectChanges();

    let backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
    let container = overlayContainerElement.querySelector('cdk-toaster-container') as HTMLElement;

    dispatchKeyboardEvent(document.body, 'keydown', A);
    dispatchKeyboardEvent(backdrop, 'keydown', A);
    dispatchKeyboardEvent(container, 'keydown', A);

    expect(spy).toHaveBeenCalledTimes(3);
  }));

  it('should notify the observers if a toaster has been opened', () => {
    toaster.afterOpened.subscribe(ref => {
      expect(
        toaster.open(PizzaMsg, {
          viewContainerRef: testViewContainerRef,
        }),
      ).toBe(ref);
    });
  });

  it('should notify the observers if all open toasters have finished closing', fakeAsync(() => {
    const ref1 = toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    const ref2 = toaster.open(ContentElementToaster, {
      viewContainerRef: testViewContainerRef,
    });
    const spy = jasmine.createSpy('afterAllClosed spy');

    viewContainerFixture.detectChanges();
    toaster.afterAllClosed.subscribe(spy);

    ref1.close();
    viewContainerFixture.detectChanges();
    flush();

    expect(spy).not.toHaveBeenCalled();

    ref2.close();
    viewContainerFixture.detectChanges();
    flush();
    viewContainerFixture.detectChanges();
    expect(spy).toHaveBeenCalled();
  }));

  it('should emit the afterAllClosed stream on subscribe if there are no open toasters', () => {
    const spy = jasmine.createSpy('afterAllClosed spy');

    toaster.afterAllClosed.subscribe(spy);

    expect(spy).toHaveBeenCalled();
  });

  it('should override the width of the overlay pane', () => {
    toaster.open(PizzaMsg, {
      width: '500px',
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.width).toBe('500px');
  });

  it('should override the height of the overlay pane', () => {
    toaster.open(PizzaMsg, {
      height: '100px',
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.height).toBe('100px');
  });

  it('should override the min-width of the overlay pane', () => {
    toaster.open(PizzaMsg, {
      minWidth: '500px',
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.minWidth).toBe('500px');
  });

  it('should override the max-width of the overlay pane', fakeAsync(() => {
    let toasterRef = toaster.open(PizzaMsg);

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.maxWidth).toBeFalsy();

    toasterRef.close();

    tick(500);
    viewContainerFixture.detectChanges();
    flushMicrotasks();

    toasterRef = toaster.open(PizzaMsg, {
      maxWidth: '100px',
    });

    tick(500);
    viewContainerFixture.detectChanges();
    flushMicrotasks();

    overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;
    expect(overlayPane.style.maxWidth).toBe('100px');
  }));

  it('should override the min-height of the overlay pane', () => {
    toaster.open(PizzaMsg, {
      minHeight: '300px',
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.minHeight).toBe('300px');
  });

  it('should override the max-height of the overlay pane', () => {
    toaster.open(PizzaMsg, {
      maxHeight: '100px',
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.maxHeight).toBe('100px');
  });

  it('should be able to customize the position strategy', () => {
    toaster.open(PizzaMsg, {
      positionStrategy: overlay.position().global().top('100px'),
    });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.marginTop).toBe('100px');
  });

  it('should allow for the dimensions to be updated', () => {
    let toasterRef = toaster.open(PizzaMsg, { width: '100px' });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-overlay-pane') as HTMLElement;

    expect(overlayPane.style.width).toBe('100px');

    toasterRef.updateSize('200px');

    expect(overlayPane.style.width).toBe('200px');
  });

  it('should allow setting the layout direction', () => {
    toaster.open(PizzaMsg, { direction: 'rtl' });

    viewContainerFixture.detectChanges();

    let overlayPane = overlayContainerElement.querySelector('.cdk-global-overlay-wrapper')!;

    expect(overlayPane.getAttribute('dir')).toBe('rtl');
  });

  it('should inject the correct layout direction in the component instance', () => {
    const toasterRef = toaster.open(PizzaMsg, { direction: 'rtl' });

    viewContainerFixture.detectChanges();

    expect(toasterRef.componentInstance!.directionality.value).toBe('rtl');
  });

  it('should fall back to injecting the global direction if none is passed by the config', () => {
    const toasterRef = toaster.open(PizzaMsg, {});

    viewContainerFixture.detectChanges();

    expect(toasterRef.componentInstance!.directionality.value).toBe('ltr');
  });

  it('should close all of the toasters', fakeAsync(() => {
    toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();
    toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();
    toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(3);

    toaster.closeAll();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(0);
  }));

  it('should close all toasters when the user goes forwards/backwards in history', fakeAsync(() => {
    toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();
    toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(2);

    mockLocation.simulateUrlPop('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(0);
  }));

  it('should close all open toasters when the location hash changes', fakeAsync(() => {
    toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();
    toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(2);

    mockLocation.simulateHashChange('');
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(0);
  }));

  it('should have the componentInstance available in the afterClosed callback', fakeAsync(() => {
    let toasterRef = toaster.open(PizzaMsg);
    let spy = jasmine.createSpy('afterClosed spy');

    flushMicrotasks();
    viewContainerFixture.detectChanges();
    flushMicrotasks();

    toasterRef.closed.subscribe(() => {
      spy();
    });

    toasterRef.close();

    flushMicrotasks();
    viewContainerFixture.detectChanges();
    tick(500);

    // Ensure that the callback actually fires.
    expect(spy).toHaveBeenCalled();
  }));

  it('should close all open toasters on destroy', fakeAsync(() => {
    toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

    viewContainerFixture.detectChanges();
    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(2);

    toaster.ngOnDestroy();
    viewContainerFixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelectorAll('cdk-toaster-container').length).toBe(0);
  }));

  it('should complete the closed stream on destroy', fakeAsync(() => {
    let toasterRef = toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });
    let closedCompleteSpy = jasmine.createSpy('closed complete spy');

    viewContainerFixture.detectChanges();
    toasterRef.closed.subscribe({ complete: closedCompleteSpy });

    toasterRef.close('Charmander');
    viewContainerFixture.detectChanges();
    flush();

    expect(closedCompleteSpy).toHaveBeenCalled();
  }));

  describe('passing in data', () => {
    it('should be able to pass in data', () => {
      let config = {
        data: {
          stringParam: 'hello',
          dateParam: new Date(),
        },
      };

      let instance = toaster.open(ToasterWithInjectedData, config).componentInstance!;

      expect(instance.data.stringParam).toBe(config.data.stringParam);
      expect(instance.data.dateParam).toBe(config.data.dateParam);
    });

    it('should default to null if no data is passed', () => {
      expect(() => {
        let toasterRef = toaster.open(ToasterWithInjectedData);
        viewContainerFixture.detectChanges();
        expect(toasterRef.componentInstance!.data).toBeNull();
      }).not.toThrow();
    });
  });

  it('should not keep a reference to the component after the toaster is closed', fakeAsync(() => {
    let toasterRef = toaster.open(PizzaMsg);
    viewContainerFixture.detectChanges();

    expect(toasterRef.componentInstance).toBeTruthy();

    toasterRef.close();
    flush();
    viewContainerFixture.detectChanges();
    flush();

    expect(toasterRef.componentInstance).withContext('Expected reference to have been cleared.').toBeFalsy();
  }));

  it('should assign a unique id to each toaster', () => {
    const one = toaster.open(PizzaMsg);
    const two = toaster.open(PizzaMsg);

    expect(one.id).toBeTruthy();
    expect(two.id).toBeTruthy();
    expect(one.id).not.toBe(two.id);
  });

  it('should allow for the id to be overwritten', () => {
    const toasterRef = toaster.open(PizzaMsg, { id: 'pizza' });
    expect(toasterRef.id).toBe('pizza');
  });

  it('should throw when trying to open a toaster with the same id as another toaster', () => {
    toaster.open(PizzaMsg, { id: 'pizza' });
    expect(() => toaster.open(PizzaMsg, { id: 'pizza' })).toThrowError(/must be unique/g);
  });

  it('should be able to find a toaster by id', () => {
    const toasterRef = toaster.open(PizzaMsg, { id: 'pizza' });
    expect(toaster.getToasterById('pizza')).toBe(toasterRef);
  });

  describe('disableClose option', () => {
    it('should prevent closing via clicks on the backdrop', fakeAsync(() => {
      toaster.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      let backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.click();
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeTruthy();
    }));

    it('should prevent closing via the escape key', fakeAsync(() => {
      toaster.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeTruthy();
    }));

    it('should allow for the disableClose option to be updated while open', fakeAsync(() => {
      let toasterRef = toaster.open(PizzaMsg, {
        disableClose: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      let backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.click();

      expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeTruthy();

      toasterRef.disableClose = false;
      backdrop.click();
      viewContainerFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeFalsy();
    }));

    it('should work when opening from a template', fakeAsync(() => {
      const templateRefFixture = TestBed.createComponent(ComponentWithTemplateRef);
      templateRefFixture.detectChanges();

      toaster.open(templateRefFixture.componentInstance.templateRef, {
        disableClose: true,
      });

      templateRefFixture.detectChanges();

      let backdrop = overlayContainerElement.querySelector('.cdk-overlay-backdrop') as HTMLElement;
      backdrop.click();
      templateRefFixture.detectChanges();
      flush();

      expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeTruthy();
    }));

    it(
      'should fall back to node injector in template toaster if token does not exist in ' + 'template injector',
      fakeAsync(() => {
        const templateInjectFixture = TestBed.createComponent(TemplateInjectorParentComponent);
        templateInjectFixture.detectChanges();

        toaster.open(templateInjectFixture.componentInstance.templateRef);
        templateInjectFixture.detectChanges();

        expect(templateInjectFixture.componentInstance.innerComponentValue).toBe('hello from parent component');
      }),
    );
  });

  describe('hasBackdrop option', () => {
    it('should have a backdrop', () => {
      toaster.open(PizzaMsg, {
        hasBackdrop: true,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeTruthy();
    });

    it('should not have a backdrop', () => {
      toaster.open(PizzaMsg, {
        hasBackdrop: false,
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      expect(overlayContainerElement.querySelector('.cdk-overlay-backdrop')).toBeFalsy();
    });
  });

  describe('panelClass option', () => {
    it('should have custom panel class', () => {
      toaster.open(PizzaMsg, {
        panelClass: 'custom-panel-class',
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      expect(overlayContainerElement.querySelector('.custom-panel-class')).toBeTruthy();
    });
  });

  describe('backdropClass option', () => {
    it('should have default backdrop class', () => {
      toaster.open(PizzaMsg, {
        backdropClass: '',
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      expect(overlayContainerElement.querySelector('.cdk-overlay-dark-backdrop')).toBeTruthy();
    });

    it('should have custom backdrop class', () => {
      toaster.open(PizzaMsg, {
        backdropClass: 'custom-backdrop-class',
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();

      expect(overlayContainerElement.querySelector('.custom-backdrop-class')).toBeTruthy();
    });
  });

  describe('focus management', () => {
    // When testing focus, all of the elements must be in the DOM.
    beforeEach(() => document.body.appendChild(overlayContainerElement));
    afterEach(() => overlayContainerElement.remove());

    it('should focus the first tabbable element of the toaster on open (the default)', fakeAsync(() => {
      toaster.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName)
        .withContext('Expected first tabbable element (input) in the toaster to be focused.')
        .toBe('INPUT');
    }));

    it('should focus the toaster element on open', fakeAsync(() => {
      toaster.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        autoFocus: 'toaster',
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      let container = overlayContainerElement.querySelector('cdk-toaster-container') as HTMLInputElement;

      expect(document.activeElement).withContext('Expected container to be focused on open').toBe(container);
    }));

    it('should focus the first header element on open', fakeAsync(() => {
      toaster.open(ContentElementToaster, {
        viewContainerRef: testViewContainerRef,
        autoFocus: 'first-heading',
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      let firstHeader = overlayContainerElement.querySelector('h1[tabindex="-1"]') as HTMLInputElement;

      expect(document.activeElement).withContext('Expected first header to be focused on open').toBe(firstHeader);
    }));

    it('should focus the first element that matches the css selector from autoFocus on open', fakeAsync(() => {
      toaster.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        autoFocus: 'p',
      });

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      let firstParagraph = overlayContainerElement.querySelector('p[tabindex="-1"]') as HTMLInputElement;

      expect(document.activeElement).withContext('Expected first paragraph to be focused on open').toBe(firstParagraph);
    }));

    it('should re-focus trigger element when toaster closes', fakeAsync(() => {
      // Create a element that has focus before the toaster is opened.
      let button = document.createElement('button');
      button.id = 'toaster-trigger';
      document.body.appendChild(button);
      button.focus();

      let toasterRef = toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe(
        'toaster-trigger',
        'Expected the focus to change when toaster was opened.',
      );

      toasterRef.close();
      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flush();

      expect(document.activeElement!.id)
        .withContext('Expected that the trigger was refocused after the toaster is closed.')
        .toBe('toaster-trigger');

      button.remove();
    }));

    it('should re-focus trigger element inside the shadow DOM when toaster closes', fakeAsync(() => {
      if (!_supportsShadowDom()) {
        return;
      }

      viewContainerFixture.destroy();
      const fixture = TestBed.createComponent(ShadowDomComponent);
      fixture.detectChanges();
      const button = fixture.debugElement.query(By.css('button'))!.nativeElement;

      button.focus();

      const toasterRef = toaster.open(PizzaMsg);
      flushMicrotasks();
      fixture.detectChanges();
      flushMicrotasks();

      const spy = spyOn(button, 'focus').and.callThrough();
      toasterRef.close();
      flushMicrotasks();
      fixture.detectChanges();
      tick(500);

      expect(spy).toHaveBeenCalled();
    }));

    it('should allow the consumer to shift focus in afterClosed', fakeAsync(() => {
      // Create a element that has focus before the toaster is opened.
      let button = document.createElement('button');
      let input = document.createElement('input');

      button.id = 'toaster-trigger';
      input.id = 'input-to-be-focused';

      document.body.appendChild(button);
      document.body.appendChild(input);
      button.focus();

      let toasterRef = toaster.open(PizzaMsg, { viewContainerRef: testViewContainerRef });

      tick(500);
      viewContainerFixture.detectChanges();

      toasterRef.closed.subscribe(() => input.focus());
      toasterRef.close();

      tick(500);
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id)
        .withContext('Expected that the trigger was refocused after the toaster is closed.')
        .toBe('input-to-be-focused');

      button.remove();
      input.remove();
      flush();
    }));

    it('should move focus to the container if there are no focusable elements in the toaster', fakeAsync(() => {
      toaster.open(ToasterWithoutFocusableElements);

      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.tagName.toLowerCase())
        .withContext('Expected toaster container to be focused.')
        .toBe('cdk-toaster-container');
    }));

    it('should allow for focus restoration to be disabled', fakeAsync(() => {
      // Create a element that has focus before the toaster is opened.
      const button = document.createElement('button');
      button.id = 'toaster-trigger';
      document.body.appendChild(button);
      button.focus();

      const toasterRef = toaster.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        restoreFocus: false,
      });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe('toaster-trigger');

      toasterRef.close();
      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flush();

      expect(document.activeElement!.id).not.toBe('toaster-trigger');
      button.remove();
    }));

    it('should allow for focus to be restored to an element matching a selector', fakeAsync(() => {
      // Create a element that has focus before the toaster is opened.
      const button = document.createElement('button');
      button.id = 'toaster-trigger';
      document.body.appendChild(button);

      const toasterRef = toaster.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        restoreFocus: `#${button.id}`,
      });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe('toaster-trigger');

      toasterRef.close();
      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flush();

      expect(document.activeElement!.id).toBe('toaster-trigger');
      button.remove();
    }));

    it('should allow for focus to be restored to a specific DOM node', fakeAsync(() => {
      // Create a element that has focus before the toaster is opened.
      const button = document.createElement('button');
      button.id = 'toaster-trigger';
      document.body.appendChild(button);

      const toasterRef = toaster.open(PizzaMsg, {
        viewContainerRef: testViewContainerRef,
        restoreFocus: button,
      });

      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flushMicrotasks();

      expect(document.activeElement!.id).not.toBe('toaster-trigger');

      toasterRef.close();
      flushMicrotasks();
      viewContainerFixture.detectChanges();
      flush();

      expect(document.activeElement!.id).toBe('toaster-trigger');
      button.remove();
    }));
  });

  describe('aria-label', () => {
    it('should be able to set a custom aria-label', () => {
      toaster.open(PizzaMsg, {
        ariaLabel: 'Hello there',
        viewContainerRef: testViewContainerRef,
      });
      viewContainerFixture.detectChanges();

      const container = overlayContainerElement.querySelector('cdk-toaster-container')!;
      expect(container.getAttribute('aria-label')).toBe('Hello there');
    });

    it('should not set the aria-labelledby automatically if it has an aria-label', fakeAsync(() => {
      toaster.open(ContentElementToaster, {
        ariaLabel: 'Hello there',
        viewContainerRef: testViewContainerRef,
      });
      viewContainerFixture.detectChanges();
      tick();
      viewContainerFixture.detectChanges();

      const container = overlayContainerElement.querySelector('cdk-toaster-container')!;
      expect(container.hasAttribute('aria-labelledby')).toBe(false);
    }));
  });
});

describe('Toaster with a parent Toaster', () => {
  let parentToaster: Toaster;
  let childToaster: Toaster;
  let overlayContainerElement: HTMLElement;
  let fixture: ComponentFixture<ComponentThatProvidesMatToaster>;

  beforeEach(fakeAsync(() => {
    TestBed.configureTestingModule({
      imports: [ToasterModule],
      declarations: [ComponentThatProvidesMatToaster],
      providers: [
        {
          provide: OverlayContainer,
          useFactory: () => {
            overlayContainerElement = document.createElement('div');
            return { getContainerElement: () => overlayContainerElement };
          },
        },
        { provide: Location, useClass: SpyLocation },
      ],
    });

    TestBed.compileComponents();
    parentToaster = TestBed.inject(Toaster);
    fixture = TestBed.createComponent(ComponentThatProvidesMatToaster);
    childToaster = fixture.componentInstance.toaster;
    fixture.detectChanges();
  }));

  afterEach(() => {
    overlayContainerElement.innerHTML = '';
  });

  it('should close toasters opened by a parent when calling closeAll on a child Toaster', fakeAsync(() => {
    parentToaster.open(PizzaMsg);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).withContext('Expected a toaster to be opened').toContain('Pizza');

    childToaster.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim())
      .withContext('Expected closeAll on child Toaster to close toaster opened by parent')
      .toBe('');
  }));

  it('should close toasters opened by a child when calling closeAll on a parent Toaster', fakeAsync(() => {
    childToaster.open(PizzaMsg);
    fixture.detectChanges();

    expect(overlayContainerElement.textContent).withContext('Expected a toaster to be opened').toContain('Pizza');

    parentToaster.closeAll();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent!.trim())
      .withContext('Expected closeAll on parent Toaster to close toaster opened by child')
      .toBe('');
  }));

  it('should not close the parent toasters, when a child is destroyed', fakeAsync(() => {
    parentToaster.open(PizzaMsg);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).withContext('Expected a toaster to be opened').toContain('Pizza');

    childToaster.ngOnDestroy();
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.textContent).withContext('Expected a toaster to remain opened').toContain('Pizza');
  }));

  it('should close the top toaster via the escape key', fakeAsync(() => {
    childToaster.open(PizzaMsg);
    fixture.detectChanges();

    dispatchKeyboardEvent(document.body, 'keydown', ESCAPE);
    fixture.detectChanges();
    flush();

    expect(overlayContainerElement.querySelector('cdk-toaster-container')).toBeNull();
  }));
});

@Directive({ selector: 'dir-with-view-container' })
class DirectiveWithViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: 'hello',
})
class ComponentWithOnPushViewContainer {
  constructor(public viewContainerRef: ViewContainerRef) {}
}

@Component({
  selector: 'arbitrary-component',
  template: `<dir-with-view-container></dir-with-view-container>`,
})
class ComponentWithChildViewContainer {
  @ViewChild(DirectiveWithViewContainer) childWithViewContainer: DirectiveWithViewContainer;

  get childViewContainer() {
    return this.childWithViewContainer.viewContainerRef;
  }
}

@Component({
  selector: 'arbitrary-component-with-template-ref',
  template: `<ng-template let-data let-toasterRef="toasterRef">
      Cheese {{localValue}} {{data?.value}}{{setToasterRef(toasterRef)}}</ng-template>`,
})
class ComponentWithTemplateRef {
  localValue: string;
  toasterRef: ToasterRef<any>;

  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;

  setToasterRef(toasterRef: ToasterRef<any>): string {
    this.toasterRef = toasterRef;
    return '';
  }
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '<p>Pizza</p> <input> <button>Close</button>' })
class PizzaMsg {
  constructor(
    public toasterRef: ToasterRef<PizzaMsg>,
    public toasterInjector: Injector,
    public directionality: Directionality,
  ) {}
}

@Component({
  template: `
    <h1>This is the title</h1>
  `,
})
class ContentElementToaster {
  closeButtonAriaLabel: string;
}

@Component({
  template: '',
  providers: [Toaster],
})
class ComponentThatProvidesMatToaster {
  constructor(public toaster: Toaster) {}
}

/** Simple component for testing ComponentPortal. */
@Component({ template: '' })
class ToasterWithInjectedData {
  constructor(@Inject(DIALOG_DATA) public data: any) {}
}

@Component({ template: '<p>Pasta</p>' })
class ToasterWithoutFocusableElements {}

@Component({
  template: `<button>I'm a button</button>`,
  encapsulation: ViewEncapsulation.ShadowDom,
})
class ShadowDomComponent {}

const TEMPLATE_INJECTOR_TEST_TOKEN = new InjectionToken<string>('TEMPLATE_INJECTOR_TEST_TOKEN');

@Component({
  template: `<ng-template><template-injector-inner></template-injector-inner></ng-template>`,
  providers: [
    {
      provide: TEMPLATE_INJECTOR_TEST_TOKEN,
      useValue: 'hello from parent component',
    },
  ],
})
class TemplateInjectorParentComponent {
  @ViewChild(TemplateRef) templateRef: TemplateRef<any>;
  innerComponentValue = '';
}

@Directive({
  selector: 'template-injector-inner',
})
class TemplateInjectorInnerDirective {
  constructor(parent: TemplateInjectorParentComponent) {
    parent.innerComponentValue = inject(TEMPLATE_INJECTOR_TEST_TOKEN);
  }
}
