import React, { Component } from 'react';

import { BaseView, NumberInput } from 'future/src/widgets';

export default class TestText extends Component {
  render() {
    return (
      <BaseView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        navigator={this.props.navigator}
        title={{ title: 'NumberInput', tintColor: '#fff' }}
      >
        <NumberInput
          value={1}
          min={-9}
          debounce={2000}
          onChange={value => alert('value' + value)}
        />
        <NumberInput
          value={10}
          onChange={value => alert('value' + value)}
        />
      </BaseView>
    );
  }
}


