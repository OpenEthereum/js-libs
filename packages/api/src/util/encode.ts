// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import Abi, {
  AbiItem,
  AbiObject,
  TokenTypeEnum,
  TokenValue
} from '@parity/abi';
import Func from '@parity/abi/lib/spec/function';

import { abiDecode } from './decode';
import { cleanupValue } from './format';
import { sha3 } from './sha3';

/**
 * Encode a method call.
 *
 * @param methodAbi - The method's ABI.
 * @param values - The values that are passed to this method.
 */
export const encodeMethodCallAbi = (
  methodAbi: AbiItem = {},
  values: TokenValue[] = []
) => {
  const func = new Func(methodAbi);
  const tokens = Abi.encodeTokens(func.inputParamTypes(), values);
  const call = func.encodeCall(tokens);

  return `0x${call}`;
};

/**
 * Formats correctly a method call to be passed to {@link encodeMethodCallAbi}.
 *
 * @param methodName - The method name to encode.
 * @param inputTypes - The method's inputs types.
 * @param data - The data that is passed to this method.
 */
export const abiEncode = (
  methodName: string,
  inputTypes: TokenTypeEnum[],
  data: TokenValue[]
) => {
  const result = encodeMethodCallAbi(
    {
      name: methodName || '',
      type: 'function',
      inputs: inputTypes.map(type => {
        return { type };
      })
    },
    data
  );

  return result;
};

/**
 * Unencode a method.
 *
 * @param abi - The ABI to unencode.
 * @param data - The data passed to this method.
 */
export const abiUnencode = (abi: AbiObject, data: string) => {
  const callsig = data.substr(2, 8);
  const op = abi.find(field => {
    return (
      field.type === 'function' &&
      abiSignature(field.name, field.inputs.map(input => input.type)).substr(
        2,
        8
      ) === callsig
    );
  });

  if (!op) {
    console.warn(`Unknown function ID: ${callsig}`);
    return null;
  }

  const argsByIndex = abiDecode(
    op.inputs.map(field => field.type),
    '0x' + data.substr(10)
  ).map((value, index) => cleanupValue(value as string, op.inputs[index].type));
  const argsByName = op.inputs.reduce(
    (result, field, index) => {
      result[field.name] = argsByIndex[index];

      return result;
    },
    {} as { [index: string]: TokenValue }
  );

  return [op.name, argsByName, argsByIndex];
};

/**
 * Get the signature of an ABI method.
 *
 * @param name - The name of the method.
 * @param inputs - The inputs' types of this method.
 */
export const abiSignature = (name: string, inputs: string[]) => {
  return sha3(`${name}(${inputs.join()})`);
};
