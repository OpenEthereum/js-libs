// Copyright 2015-2018 Parity Technologies (UK) Ltd.
// This file is part of Parity.
//
// SPDX-License-Identifier: MIT

import React, { Component } from 'react';

import light from '../lightHoc';

@light.hoc({
  blockNumber: light.blockNumber$
})
class BlockNumber extends Component {
  render() {
    const { blockNumber } = this.props;

    return (
      <div>
        <h2>blockNumber$</h2>

        <h3>Current block number</h3>
        {+blockNumber}
      </div>
    );
  }
}

export default BlockNumber;
