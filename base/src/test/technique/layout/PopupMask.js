'use strict';
import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ListView,
} from 'react-native';

import { BaseView } from 'future/src/widgets';
import Styles from 'future/src/lib/styles/Styles';

//选择银行弹出窗口
class BankName extends Component {
  constructor(props) {
    super(props);
    this.timer = null;
    this.bank = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      bankItems: this.bank.cloneWithRows(this.props.bankList),
    };
    this.renderRowData = this._renderRowData.bind(this);
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }

  //选择银行
  _selectBank(rowData) {
    this.setState({
      bankItems: this.bank.cloneWithRows(this.props.bankList),
    });
    this.props.selectBank(rowData);
    this.props.showModalToast('您选择了' + rowData);
    this.timer = setTimeout(this.props.selectBankHide, 3000)
  }
  //显示银行选择信息
  _renderRowData(rowData) {
    let image = require('./res/000weigouxuan.png');
    if (rowData == this.props.selectedBankName) {
      image = require('./res/000yigouxuan.png');
    }
    return (
      <TouchableOpacity style={styles.bankItem} onPress={this._selectBank.bind(this, rowData)}>
        <Text numberOfLines={1} style={styles.bankItemName}>{rowData}</Text>
        <Image style={styles.bankItemCheckBox} source={image} />
      </TouchableOpacity>
    );
  }

  render() {
    return (
      <View style={styles.bank}>
        <View style={styles.bankHeader}>
          <TouchableOpacity onPress={this.props.selectBankHide} >
            <Image style={styles.bankLeftArrow} source={require('./res/000famhui.png')} />
          </TouchableOpacity>
          <Text style={styles.bankHeaderText}>选择银行</Text>
        </View>
        <View style={styles.bankLists}>
          <ListView
            dataSource={this.state.bankItems}
            renderRow={this.renderRowData}
          />
        </View>
        <View style={styles.bankSelectName}>
          <Text numberOfLines={1} style={styles.bankSelectNameText}>
            {this.props.selectedBankName != '选择银行' ? '您已选择' + this.props.selectedBankName : ''}
          </Text>
        </View>
      </View>
    );
  }
}

//主页面
export default class Test extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bankOfDeposit: '点我弹出蒙版',
    };
  }

  // 蒙版上弹出提示
  showModalToast = (message) => {
    this.base.showModalToast(message);
  }
  // 选择银行信息
  selectBank = (bankOfDeposit) => {
    this.setState({ bankOfDeposit });
  }
  // 选择银行弹窗
  renderModalScence = () => {
    return (
      <BankName
        selectBankHide={() => { this.base.hideModal() }}
        selectBank={this.selectBank}
        selectedBankName={this.state.bankOfDeposit}
        showModalToast={this.showModalToast}
        bankList={['中国银行', '中国农业银行', '中国建设银行', '广州银行']}
      />
    )
  }

  render() {
    return (
      <BaseView
        ref={base => this.base = base}
        renderModalScence={this.renderModalScence}
        title={{ title: '蒙版弹层', tintColor: '#fff' }}
        navigator={this.props.navigator}
      >
        <View style={styles.card} >
          <TouchableOpacity style={styles.cardSelect} onPress={() => { this.base.showModal() }} >
            <Text numberOfLines={1} style={styles.cardItem}>{this.state.bankOfDeposit}</Text>
            <Image style={styles.cardImg} source={require('./res/020youjiantou@2x.png')} />
          </TouchableOpacity>
        </View>
      </BaseView>
    );
  }
}


const styles = Styles.create({
  card: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#0033FF',
    borderWidth: '$BW',
  },
  cardSelect: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardItem: {
    flex: 1,
    fontSize: 15,
    color: '#585c64',
    marginRight: 2, //调整清除按钮右边距
  },
  cardImg: {
    height: 6,
    width: 11,
    marginRight: '$context.b12',
  },

  // 银行卡选择弹窗

  bank: {
    height: '$IS*350',
    width: '$IS*230',
    backgroundColor: '#fff',
  },
  bankHeader: {
    height: 45,
    backgroundColor: '$MAIN_COLOR',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankLeftArrow: {
    height: 19,
    width: 19,
    resizeMode: 'contain',
    marginLeft: 12,
  },
  bankHeaderText: {
    flex: 1,
    textAlign: 'center',
    color: '#fff',
    fontSize: 18,
    marginRight: 31,
  },
  bankLists: {
    flex: 1,
    paddingHorizontal: '$context.b12',
  },
  bankSelectName: {
    height: 45,
    backgroundColor: '$MAIN_COLOR',
    flexDirection: 'row',
    alignItems: 'center',
  },
  bankSelectNameText: {
    textAlign: 'left',
    color: '#fff',
    fontSize: 18,
    marginLeft: '$context.b12',
  },

  bankItem: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: '$BW',
    borderBottomColor: '#e5e5e5',
  },
  bankItemName: {
    flex: 1,
    color: '$MAIN_COLOR',
    fontSize: 14,
  },
  bankItemCheckBox: {
    width: 20,
    height: 20,
    resizeMode: 'center',
  },
  validate: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: '$context.b12',
    backgroundColor: '#fff',
  },
  validateInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    color: '#585c64',
    borderColor: '#eee',
    borderWidth: '$BW',
    paddingLeft: 5,
    marginRight: 10,
  },
  validateBtn: {
    height: 50,
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#eee',
    borderWidth: '$BW',
  },
  validateText: {
    fontSize: 15,
    color: "#666",
  },
});