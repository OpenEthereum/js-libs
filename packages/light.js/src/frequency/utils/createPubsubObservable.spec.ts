// Copyright 2015-2019 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import createPubsubObservable from './createPubsubObservable';
import isObservable from '../../utils/isObservable';
import { rejectApi, resolveApi } from '../../utils/testHelpers/mockApi';
import { setApi } from '../../api';

it('should return an Observable', () => {
  setApi(resolveApi());
  expect(
    isObservable(createPubsubObservable('eth_blockNumber', 'eth_blockNumber'))
  ).toBe(true);
});

it('should fire an event when pubsub publishes', done => {
  setApi(resolveApi());
  createPubsubObservable('eth_blockNumber', 'eth_blockNumber').subscribe(
    data => {
      expect(data).toBe('foo');
      done();
    }
  );
});

it('should fire an error when pubsub errors', done => {
  setApi(rejectApi());
  createPubsubObservable('eth_blockNumber', 'eth_blockNumber').subscribe(
    undefined,
    err => {
      expect(err).toEqual(new Error('bar'));
      done();
    }
  );
});

it('should fire an event when polling pubsub publishes', done => {
  setApi(resolveApi('foo', false));
  createPubsubObservable('eth_blockNumber', 'eth_blockNumber').subscribe(
    data => {
      expect(data).toBe('foo');
      done();
    }
  );
});

it('should fire an error when polling pubsub errors', done => {
  setApi(rejectApi(new Error('bar'), false));
  createPubsubObservable('eth_blockNumber', 'eth_blockNumber').subscribe(
    undefined,
    err => {
      expect(err).toEqual(new Error('bar'));
      done();
    }
  );
});
