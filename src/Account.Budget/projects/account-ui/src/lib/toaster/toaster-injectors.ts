/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import { Overlay, ScrollStrategy } from '@angular/cdk/overlay';
import { InjectionToken } from '@angular/core';
import { ToasterConfig } from './toaster-config';

/** Injection token for the Toaster's ScrollStrategy. */
export const DIALOG_SCROLL_STRATEGY = new InjectionToken<() => ScrollStrategy>('ToasterScrollStrategy');

/** Injection token for the Toaster's Data. */
export const DIALOG_DATA = new InjectionToken<any>('ToasterData');

/** Injection token that can be used to provide default options for the toaster module. */
export const DEFAULT_DIALOG_CONFIG = new InjectionToken<ToasterConfig>('DefaultToasterConfig');

/** @docs-private */
export function DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY(overlay: Overlay): () => ScrollStrategy {
  return () => overlay.scrollStrategies.block();
}

/** @docs-private */
export const DIALOG_SCROLL_STRATEGY_PROVIDER = {
  provide: DIALOG_SCROLL_STRATEGY,
  deps: [Overlay],
  useFactory: DIALOG_SCROLL_STRATEGY_PROVIDER_FACTORY,
};
