
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
} from 'future/src/widgets';
import Pickers from '@imall-test/react-native-picker';
export default class ItemPicker extends Component {
    static propTypes = {
        cancelText : React.PropTypes.string,
        titleText : React.PropTypes.string,
        confirmText : React.PropTypes.string,
        cancelStyle: React.PropTypes.object,
        contentTextStyle: React.PropTypes.object,
        onPickerConfirm : React.PropTypes.func,
        onPickerCancel : React.PropTypes.func,
    };

    static defaultProps = {
        onPickerConfirm : () => { },
        onPickerCancel : () => { }
    }

    constructor(props) {
        super(props);
        this._heidePickers = this._heidePickers.bind(this);
        this._hideAlert = this._hideAlert.bind(this);
    }
    show() {
        this.refs.checkalet.show();
        Pickers.init({
            pickerConfirmBtnText: this.props.confirmText,
            pickerCancelBtnText:  this.props.cancelText,
            pickerTitleText:  this.props.titleText,
            pickerConfirmBtnColor: [0, 0, 0, 1],
            pickerCancelBtnColor: [0, 0, 0, 1],
            pickerTitleColor: [0, 0, 0, 1],
            pickerBg: [255, 255, 255, 1],
            pickerToolBarBg: [255, 255, 255, 1],
            pickerData: this.props.dataSource,
            pickerToolBarFontSize:15,
            pickerFontSize:15,
            selectedValue: [0],
            onPickerConfirm: data => {
                this._hideAlert();
                if(this.props.onPickerConfirm){
                    this.props.onPickerConfirm(data);
                }
            },
            onPickerCancel: data => {
                this._hideAlert();
                if(this.props.onPickerCancel){
                    this.props.onPickerCancel();
                }
            },
            onPickerSelect: data => {

            }
        });
        Pickers.show();
    }
    _hideAlert(){
        this.refs.checkalet.hide();
    }
    _heidePickers() {
        Pickers.hide();
    }
    render() {
        return (
            <PopModal
                ref="checkalet"
                closeCallBack={() => {
                    this._heidePickers();
                }}
                contentView={
                    <View style={styles.pop}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={this._hideAlert} />
                    </View>
                }
            />
        );
    }
}
const styles = StyleSheet.create({
    pop: {
        width: width,
        height: height
    },
});


