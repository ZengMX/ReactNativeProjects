// 引入官方组件
import React, { Component } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
// 引入自定义组件
import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

export default class ModalTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  //隐藏弹出层
  hideModal = () => {
    this.setState({
      modalVisible: false,
    })
  };
  //显示弹出层
  showModal = () => {
    this.setState({
      modalVisible: true,
    })
  };
  // 打开关闭Modal后调用
  onCloseModal = () => {
    console.log('关闭了Modal');
  }
  onShowModal = () => {
    console.log('Modal打开了');
  }
  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        navigator={this.props.navigator}
        title={{ title: 'Modal', tintColor: '#fff' }}
      >
        <Modal
          animationType={'fade'}
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={this.onCloseModal}
          onShow={this.onShowModal}
        >
          {/*这里Modal包裹的内容在visible为true时显示*/}
          <TouchableOpacity
            opacity={1}
            style={styles.modalBackground}
            onPress={this.hideModal}
          >
            <Text onPress={this.hideModal}>点我隐藏Modal</Text>
          </TouchableOpacity>
        </Modal>

        <Text onPress={this.showModal}>点我弹出Modal</Text>
      </BaseView>
    );
  }
}

const styles = Styles.create({
  modalBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});