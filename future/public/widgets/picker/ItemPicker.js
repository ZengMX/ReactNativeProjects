
import React, { Component } from 'react';
import {
    StyleSheet,
    Dimensions,
    TouchableOpacity,
    View
} from 'react-native'
const { height, width } = Dimensions.get('window');
import {
    PopModal
} from 'future/public/widgets';
import Pickers from 'react-native-picker';
export default class ItemPicker extends Component {
    static propTypes = {
        cancelText: React.PropTypes.string,
        titleText: React.PropTypes.string,
        confirmText: React.PropTypes.string,
        cancelStyle: React.PropTypes.object,
        contentTextStyle: React.PropTypes.object,
        onPickerConfirm: React.PropTypes.func,
        onPickerCancel: React.PropTypes.func,
    };

    static defaultProps = {
        onPickerConfirm: () => { },
        onPickerCancel: () => { }
    }

    constructor(props) {
        super(props);
        this._heidePickers = this._heidePickers.bind(this);
        this._hideAlert = this._hideAlert.bind(this);
        this.reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;  
    }
    // _RGBToHex(rgb) {
    //     let regexp = /[0-9]{0,3}/g;
    //     let re = rgb.match(regexp);//利用正则表达式去掉多余的部分，将rgb中的数字提取
    //     let hexColor = "#";
    //     let hex = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
    //     for (let i = 0; i < re.length; i++) {
    //         let r = null, c = re[i], l = c;
    //         let hexAr = [];
    //         while (c > 16) {
    //             r = c % 16;
    //             c = (c / 16) >> 0;
    //             hexAr.push(hex[r]);
    //         } hexAr.push(hex[c]);
    //         if (l < 16 && l != "") {
    //             hexAr.push(0)
    //         }
    //         hexColor += hexAr.reverse().join('');
    //     }
    // }
    _HexToRGB(hexs) {
        if(hexs != undefined && hexs != null){
            var sColor = hexs.toLowerCase();
        }
        if (sColor && this.reg.test(sColor) && hexs != undefined && hexs != null) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值  
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            sColorChange[3] =  1 ;
            return sColorChange;
        } else {
            return null;
        }
    }
    show() {
        let pickerConfirmBtnColor =  this._HexToRGB(this.props.pickerConfirmBtnColor) == null ? [0,0,0,1] : this._HexToRGB(this.props.pickerConfirmBtnColor);
        let pickerCancelBtnColor =  this._HexToRGB(this.props.pickerCancelBtnColor) == null ? [0,0,0,1] : this._HexToRGB(this.props.pickerCancelBtnColor);
        let pickerTitleColor =  this._HexToRGB(this.props.pickerTitleColor) == null ? [0,0,0,1] : this._HexToRGB(this.props.pickerTitleColor);
        let pickerBg =  this._HexToRGB(this.props.pickerBg) == null ? [255, 255, 255, 1] : this._HexToRGB(this.props.pickerBg);
        let pickerToolBarBg =  this._HexToRGB(this.props.pickerToolBarBg) == null ? [255, 255, 255, 1] : this._HexToRGB(this.props.pickerToolBarBg);

        this.refs.checkalet.show();
        Pickers.init({
            pickerConfirmBtnText: this.props.confirmText == undefined ? '确定':this.props.confirmText,
            pickerCancelBtnText: this.props.cancelText == undefined ? '取消':this.props.cancelText,
            pickerTitleText: this.props.titleText,
            pickerConfirmBtnColor : pickerConfirmBtnColor,
            pickerCancelBtnColor : pickerCancelBtnColor,
            pickerTitleColor : pickerTitleColor,
            pickerBg : pickerBg,
            pickerToolBarBg : pickerToolBarBg,
            pickerData: this.props.dataSource,
            pickerToolBarFontSize: 15,
            pickerFontSize: 15,
            selectedValue: [0],
            onPickerConfirm: data => {
                this._hideAlert();
                if (this.props.onPickerConfirm) {
                    this.props.onPickerConfirm(data);
                }
            },
            onPickerCancel: data => {
                this._hideAlert();
                if (this.props.onPickerCancel) {
                    this.props.onPickerCancel();
                }
            },
            onPickerSelect: data => {

            }
        });
        Pickers.show();
    }
    _hideAlert() {
        this.refs.checkalet.hide();
    }
    _heidePickers() {
        Pickers.hide();
        if(this.props.closeCallBack){
            this.props.closeCallBack()
        }
    }
    render() {
        return (
            <PopModal
                ref="checkalet"
                closeCallBack={() => {
                    this._heidePickers();
                }}
                contentView={
                    <View style={{ width: width,height: height}}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={this._hideAlert} />
                    </View>
                }
            />
        );
    }
}
/*
 _onCustomerTypeIdPress() {
        this.refs.itemPicker && this.refs.itemPicker.show();
    }
    _hideCustom() {
        this.refs.popModal && this.refs.popModal.hide();
    }
    
_renderPicker() {
		return (
			<ItemPicker
				ref="itemPicker"
				cancelText={'取消'}
				pickerConfirmBtnColor={'#2CBA75'}
				pickerCancelBtnColor={'#2CBA75'}
				pickerTitleColor={'#333333'}
				titleText={'售后原因'}
				confirmText={'确定'}
				dataSource={this.canCelOpt}
				onPickerConfirm={(data) => {
					if (data && data.length > 0) {
						if (data[0] == '0' && Platform.OS == 'ios') {
							data[0] = this.canCelOpt[0];
						}
						let selIdxs, selItems;
						this.canCelOpt.map((item, index) => {
							if (data[0] == item) {
								selIdxs = index;
								selItems = item;
							}
						});
						this.setState({
							selIdx: selIdxs,
							selItem: selItems
						});
					}
				}}
				onPickerCancel={() => {
				}}
				closeCallBack={() => {
				}}
			/>
		);
	}
    */



