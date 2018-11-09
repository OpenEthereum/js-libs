// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import BigNumber from 'bignumber.js';

import { BlockNumber, InputDeriveHashMap, InputOptions, InputOptionsConditions, InputTrace, InputTraceHashMap } from '../types';
import { isArray, isHex, isInstanceOf, isString } from '../util/types';
import { padLeft, toHex } from '../util/format';

/**
 * Validate input address.
 *
 * @param address - Input address to validate.
 */
export const inAddress = (address: string) => {
  // TODO: address validation if we have upper-lower addresses
  return inHex(address);
};

/**
 * Validate input addresses.
 *
 * @param addresses - Input addresses to validate.
 */
export const inAddresses = (addresses: string[]) => {
  return (addresses || []).map(inAddress);
};

export const inBlockNumber = (blockNumber: BlockNumber) => {
  if (isString(blockNumber)) {
    switch (blockNumber) {
      case 'earliest':
      case 'latest':
      case 'pending':
        return blockNumber;
    }
  }

  return inNumber16(blockNumber);
};

export const inData = (data: string) => {
  if (data && data.length && !isHex(data)) {
    data = data
      .split('')
      .map(chr => `0${chr.charCodeAt(0).toString(16)}`.slice(-2))
      .join('');
  }

  return inHex(data);
};

export const inHash = (hash: string) => {
  return inHex(hash);
};

export const inTopics = (topics: Array<any>): Array<any> | string | null => {
  return (topics || []).filter(topic => topic === null || topic).map(topic => {
    if (topic === null) {
      return null;
    }

    if (Array.isArray(topic)) {
      return inTopics(topic);
    }

    return padLeft(topic, 32);
  });
};

export const inFilter = (options: InputOptions) => {
  if (options) {
    Object.keys(options).forEach(key => {
      switch (key) {
        case 'address':
          if (isArray(options[key])) {
            options[key] = (options[key] as Array<string | number>).map(inAddress);
          } else {
            options[key] = inAddress(options[key] as string);
          }
          break;

        case 'fromBlock':
        case 'toBlock':
          options[key] = inBlockNumber(options[key] as BlockNumber);
          break;

        case 'limit':
          options[key] = inNumber10(options[key] as BlockNumber);
          break;

        case 'topics':
          options[key] = inTopics(options[key] as Array<any>);
      }
    });
  }

  return options;
};

export const inHex = (str: string) => toHex(str);

export const inNumber10 = (n: BlockNumber) => {
  if (isInstanceOf(n, BigNumber)) {
    return (n as BigNumber).toNumber();
  }

  return new BigNumber(n || 0).toNumber();
};

export const inNumber16 = (n: BlockNumber) => {
  const bn = isInstanceOf(n, BigNumber)
    ? n as BigNumber
    : new BigNumber(n || 0);

  if (!bn.isInteger()) {
    throw new Error(
      `[format/input::inNumber16] the given number is not an integer: ${bn.toFormat()}`
    );
  }

  return inHex(bn.toString(16));
};

export const inOptionsCondition = (condition: {
  block?: BlockNumber;
  time?: Date;
}) => {
  if (condition) {
    return {
      block: condition.block ? inNumber10(condition.block) : null,
      time: condition.time
        ? inNumber10(Math.floor(condition.time.getTime() / 1000))
        : null
    };
  }

  return null;
};

export const inOptions = (_options: InputOptions = {}) => {
  const options = Object.assign({}, _options);

  Object.keys(options).forEach(key => {
    switch (key) {
      case 'to':
        // Don't encode the `to` option if it's empty
        // (eg. contract deployments)
        if (options[key]) {
          options.to = inAddress(options[key] as string);
        }
        break;

      case 'from':
        options[key] = inAddress(options[key] as string);
        break;

      case 'condition':
        options[key] = inOptionsCondition(options[key] as InputOptionsConditions);
        break;

      case 'gas':
      case 'gasPrice':
        options[key] = inNumber16(new BigNumber(options[key] as string).toFixed() as BlockNumber);
        break;

      case 'value':
      case 'nonce':
        options[key] = inNumber16(options[key] as BlockNumber);
        break;

      case 'data':
        options[key] = inData(options[key] as string);
        break;
    }
  });

  return options;
};

export const inTraceFilter = (filterObject: InputTraceHashMap) => {
  if (filterObject) {
    Object.keys(filterObject).forEach(key => {
      switch (key) {
        case 'fromAddress':
        case 'toAddress':
          filterObject[key] = []
            .concat(filterObject[key])
            .map(address => inAddress(address));
          break;

        case 'toBlock':
        case 'fromBlock':
          filterObject[key] = inBlockNumber(filterObject[key] as BlockNumber);
          break;
      }
    });
  }

  return filterObject;
};

export const inTraceType = (whatTrace: InputTrace): InputTrace => {
  if (isString(whatTrace)) {
    return [whatTrace];
  }

  return whatTrace;
};

export const inDeriveType = (derive: InputDeriveHashMap): string => {
  return derive && derive.type === 'hard' ? 'hard' : 'soft';
};

export const inDeriveHash = (derive: InputDeriveHashMap | string): InputDeriveHashMap => {
  const hash = derive && (derive as InputDeriveHashMap).hash
    ? ((derive as InputDeriveHashMap).hash) as string
    : derive as string;
  const type = inDeriveType(derive as InputDeriveHashMap);

  return {
    hash: inHex(hash),
    type
  };
};

export const inDeriveIndex = (derive: Array<InputDeriveHashMap | BlockNumber> | InputDeriveHashMap): Array<InputDeriveIndexHashMap | number | null> => {
  if (!derive) {
    return [];
  }

  if (!isArray(derive)) {
    derive = [derive];
  }

  return (derive as Array<InputDeriveHashMap | BlockNumber>).map(item => {
    const index = inNumber10(item && ((item as InputDeriveHashMap).index) as BlockNumber
      ? ((item as InputDeriveHashMap).index) as BlockNumber
      : (item as BlockNumber));

    return {
      index,
      type: inDeriveType(item as InputDeriveHashMap)
    };
  });
};
