// 引入官方组件
import React, { Component } from 'react';
import {
  Animated,
  Easing,
  Text,
  View,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class AnimatedTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      anim: [1, 2, 3].map(
        () => new Animated.Value(0)
      ),
    };
  }

  componentDidMount() {
    var timing = Animated.timing;
    Animated.sequence([ // One after the other
      timing(this.state.anim[0], {
        toValue: 200,
        easing: Easing.linear,
      }),
      Animated.delay(400), // Use with sequence
      timing(this.state.anim[0], {
        toValue: 0,
        easing: Easing.elastic(2), // Springy
      }),
      Animated.delay(400),
      Animated.stagger(200,
        this.state.anim.map((anim) => timing(
          anim, { toValue: 200 }
        )).concat(
          this.state.anim.map((anim) => timing(
            anim, { toValue: 0 }
          ))),
      ),
      Animated.delay(400),
      Animated.parallel([
        Easing.inOut(Easing.quad), // Symmetric
        Easing.back(1.5),  // Goes backwards first
        Easing.ease        // Default bezier
      ].map((easing, ii) => (
        timing(this.state.anim[ii], {
          toValue: 320, easing, duration: 3000,
        })
      ))),
      Animated.delay(400),
      Animated.stagger(200,
        this.state.anim.map((anim) => timing(anim, {
          toValue: 0,
          easing: Easing.bounce, // Like a ball
          duration: 2000,
        })),
      ),
    ]).start();

  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Animated', tintColor: '#fff' }}
      >
        {['Composite', 'Easing', 'Animations'].map(
          (text, ii) => (
            <Animated.View
              key={text}
              style={[styles.content, {
                left: this.state.anim[ii]
              }]}>
              <Text>{text}</Text>
            </Animated.View>
          )
        )}
      </BaseView>
    );
  }
}

const styles = Styles.create({
  content: {
    backgroundColor: 'deepskyblue',
    borderWidth: 1,
    borderColor: 'dodgerblue',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
});