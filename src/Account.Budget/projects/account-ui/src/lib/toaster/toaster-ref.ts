/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { FocusOrigin } from '@angular/cdk/a11y';
import { ESCAPE, hasModifierKey } from '@angular/cdk/keycodes';
import { OverlayRef } from '@angular/cdk/overlay';
import { BasePortalOutlet } from '@angular/cdk/portal';
import { Observable, Subject } from 'rxjs';
import { ToasterConfig } from './toaster-config';

/** Additional options that can be passed in when closing a toaster. */
export interface ToasterCloseOptions {
  /** Focus original to use when restoring focus. */
  focusOrigin?: FocusOrigin;
}

/**
 * Reference to a toaster opened via the Toaster service.
 */
export class ToasterRef<R = unknown, C = unknown> {
  /**
   * Instance of component opened into the toaster. Will be
   * null when the toaster is opened using a `TemplateRef`.
   */
  readonly componentInstance: C | null;

  /** Instance of the container that is rendering out the toaster content. */
  readonly containerInstance: BasePortalOutlet & { _closeInteractionType?: FocusOrigin };

  /** Whether the user is allowed to close the toaster. */
  disableClose: boolean | undefined;

  /** Emits when the toaster has been closed. */
  readonly closed: Observable<R | undefined> = new Subject<R | undefined>();

  /** Emits when the backdrop of the toaster is clicked. */
  readonly backdropClick: Observable<MouseEvent>;

  /** Emits when on keyboard events within the toaster. */
  readonly keydownEvents: Observable<KeyboardEvent>;

  /** Emits on pointer events that happen outside of the toaster. */
  readonly outsidePointerEvents: Observable<MouseEvent>;

  /** Unique ID for the toaster. */
  readonly id: string;

  constructor(
    readonly overlayRef: OverlayRef,
    readonly config: ToasterConfig<any, ToasterRef<R, C>, BasePortalOutlet>,
  ) {
    this.disableClose = config.disableClose;
    this.backdropClick = overlayRef.backdropClick();
    this.keydownEvents = overlayRef.keydownEvents();
    this.outsidePointerEvents = overlayRef.outsidePointerEvents();
    this.id = config.id!; // By the time the toaster is created we are guaranteed to have an ID.

    this.keydownEvents.subscribe(event => {
      if (event.keyCode === ESCAPE && !this.disableClose && !hasModifierKey(event)) {
        event.preventDefault();
        this.close(undefined, { focusOrigin: 'keyboard' });
      }
    });

    this.backdropClick.subscribe(() => {
      if (!this.disableClose) {
        this.close(undefined, { focusOrigin: 'mouse' });
      }
    });
  }

  /**
   * Close the toaster.
   * @param result Optional result to return to the toaster opener.
   * @param options Additional options to customize the closing behavior.
   */
  close(result?: R, options?: ToasterCloseOptions): void {
    if (this.containerInstance) {
      const closedSubject = this.closed as Subject<R | undefined>;
      this.containerInstance._closeInteractionType = options?.focusOrigin || 'program';
      this.overlayRef.dispose();
      closedSubject.next(result);
      closedSubject.complete();
      (this as { componentInstance: C }).componentInstance = (
        this as { containerInstance: BasePortalOutlet }
      ).containerInstance = null!;
    }
  }

  /** Updates the position of the toaster based on the current position strategy. */
  updatePosition(): this {
    this.overlayRef.updatePosition();
    return this;
  }

  /**
   * Updates the toaster's width and height.
   * @param width New width of the toaster.
   * @param height New height of the toaster.
   */
  updateSize(width: string | number = '', height: string | number = ''): this {
    this.overlayRef.updateSize({ width, height });
    return this;
  }

  /** Add a CSS class or an array of classes to the overlay pane. */
  addPanelClass(classes: string | string[]): this {
    this.overlayRef.addPanelClass(classes);
    return this;
  }

  /** Remove a CSS class or an array of classes from the overlay pane. */
  removePanelClass(classes: string | string[]): this {
    this.overlayRef.removePanelClass(classes);
    return this;
  }
}
