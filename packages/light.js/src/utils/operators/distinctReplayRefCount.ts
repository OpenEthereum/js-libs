// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { publishReplay, refCount } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { distinctValues } from './distinctValues';

/**
 * Shorthand for distinctUntilChanged(), publishReplay(1) and refCount().
 *
 * @ignore
 */
export const distinctReplayRefCount = () => <T>(
  source$: Observable<T>
): Observable<T> =>
  source$.pipe(
    distinctValues(),
    publishReplay(1),
    refCount()
  );
