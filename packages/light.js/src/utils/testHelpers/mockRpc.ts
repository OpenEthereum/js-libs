// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import { timer } from 'rxjs';

import createRpc from '../../rpc/utils/createRpc';

/**
 * Create a fake RpcObservable.
 *
 * @ignore
 */
const mockRpc$ = createRpc({ frequency: [() => timer(0, 1000)] });

export default mockRpc$;
