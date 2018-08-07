
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    Platform,
    PixelRatio
} from 'react-native'
const { height, width } = Dimensions.get('window');
import {
    PopModal,
    AlertImall,
    InputAlert,
    AndroidCheckAlert
} from 'future/src/widgets';
import RootSiblings from 'react-native-root-siblings';
export default class Alerts extends Component {
    _loading = null;
    _custom = null;
    _inputAlert = null;
    _androidCheck = null;
    //自定义对话框
    static showCustom = (props) => {
        this._custom = new RootSiblings(
            <CustomAlert
                visible={true}
                containerStyle={props.moduleBg}
                content={props.contentView}
                closeCallBack={() => {
                    if (props.closeCallBack) {
                        props.closeCallBack();
                    }
                }}
            />
        );
        return this._custom;
    };
    static hideCustom = (props) => {
        if(this._custom != null){
           this._custom.update(<CustomAlert visible={false} {...props}/>);
          // this._custom.destroy();
        }
	};
    //自定义底部对话框
    static showCustomBottom = (props) => {
        this._loading = new RootSiblings(
            <AlertImall
                visible={true}
                containerStyle={props.moduleBg}
                title={props.title}
                titleStyle={props.titleStyle}
                message={props.message}
                noticeTitle={props.noticeTitle}
                noticeStyle={props.noticeStyle}
                renderBottom={props.bottomContent}
            />
        );
        return this._loading;
    };
    static hideCustomBottom = (props) => {
        if(this._loading != null){
           this._loading.update(<AlertImall visible={false} {...props}/>);
          // this._loading.destroy();
        }
	};
    //通知对话框
    static showPrompt = (props) => {
        this._loading = new RootSiblings(
            <AlertImall
                visible={true}
                containerStyle={props.moduleBg}
                title={props.title}
                titleStyle={props.titleStyle}
                message={props.message}
                noticeTitle={props.noticeTitle}
                noticeStyle={props.noticeStyle}
                onNoticePress={() => {
                    if (props.onNoticeCallback) {
                        props.onNoticeCallback();
                    }
                }}
                closeCallBack={() => {
                    if (props.closeCallBack) {
                        props.closeCallBack();
                    }
                }}
            />
        );
        return this._loading;
    };
    //确认对话框
    static showConfirm = (props) => {
        this._loading = new RootSiblings(
            <AlertImall
                visible={true}
                containerStyle={props.moduleBg}
                title={props.title}
                titleStyle={props.titleStyle}
                message={props.message}
                confirmTitle={props.confirmTitle}
                confirmStyle={props.confirmStyle}
                cancelTitle={props.cancelTitle}
                cancelStyle={props.cancelStyle}
                noticeStyle={props.noticeStyle}
                onCancelPress={() => {
                    if (props.onCancelPress) {
                        props.onCancelPress();
                    }
                }}
                onConfirmPress={() => {
                    if (props.onConfirmPress) {
                        props.onConfirmPress();
                    }
                }}
            />
        );
        return this._loading;
    };
    //输入对话框
    static showInputConfirm = (props) => {
        this._loading = new RootSiblings(
            <InputAlert
                visible={true}
                containerStyle={props.moduleBg}
                inputType={props.inputType}
                title={props.title}
                subTitle={props.subTitle}
                message={props.message}
                placeholder={props.placeholder}
                maxLength={props.maxLength}

                titleStyle={props.titleStyle}
                subTitleStyle={props.subTitleStyle}
                confirmStyle={props.confirmStyle}
                cancelStyle={props.cancelStyle}
                inputStyle={props.inputStyle}
               
                onChangeText={(text) => {
                    if (props.onChangeText) {
                        props.onChangeText(text);
                    }
                }}
                onCancelPress={() => {
                    if (props.onCancelPress) {
                        props.onCancelPress();
                    }
                }}
                onConfirmPress={(text) => {
					if (props.onConfirmPress) {
                        props.onConfirmPress(text);
                    }
				}}
            />
        );
        return this._loading;
    };
    //选择对话框
    static showCheckConfirm = (props) => {
        this._loading = new RootSiblings(
            <AndroidCheckAlert
                visible={true}
                containerStyle={props.moduleBg}
                optionalArray={props.optionalArray}
                title={props.title}
                titleStyle={props.titleStyle}
                cancelStyle={props.cancelStyle}
                onCancelPress={() => {
                    if (props.onCancelPress) {
                        props.onCancelPress();
                    }
                }}
                onSelect={(item, index) => {
					if (props.onSelect) {
                        props.onSelect(item, index);
                    }
				}}
            />
        );
        return this._loading;
    };
    componentWillMount() {
        this._loading = new RootSiblings(<AlertImall  {...this.props}/>);
        this._custom = new RootSiblings(<PopModal {...this.props}/>);
        this._inputAlert = new RootSiblings(<InputAlert  {...this.props}/>);
        this._androidCheck = new RootSiblings(<AndroidCheckAlert {...this.props}/>);
    }
    componentWillReceiveProps(nextProps) {
        this._loading.update(<AlertImall {...nextProps} />);
        this._custom.update(<PopModal {...nextProps} />);
        this._inputAlert.update(<InputAlert {...nextProps} />);
        this._androidCheck.update(<AndroidCheckAlert {...nextProps} />);
    }
    componentWillUnmount() {
        if(this._loading != null){
            this._loading.destroy();
        }
        if(this._custom != null){
            this._custom.destroy();
        }
        if(this._inputAlert != null){
            this._inputAlert.destroy();
        }
        if(this._androidCheck != null){
            this._androidCheck.destroy();
        }
    }
    render() {
        return null;
    }
}

class CustomAlert extends Component {
    static propTypes = {
        content : React.PropTypes.object,
    };
    componentDidMount() {
        if (this.props.visible && this.props.visible == true) {
            this.show();
        }
    }
    componentWillReceiveProps(nextProps){
         if(nextProps.visible == false){
             this.hide();
         }
    }
    show() {
        this.refs.alert.show();
    }
    hide(){
        this.refs.alert.hide();
    }

    _onhidePress() {
        this.refs.alert.hide();
    }
    render() {
        return (<PopModal
            ref="alert"
            animationType={'fade'}
            containerStyle={this.props.containerStyle}
            closeCallBack={() => {
                if (this.props.closeCallBack) {
                    this.props.closeCallBack();
                }
            }}
            contentView={
                <View style={{ width: width, height: height }}>
                    <TouchableOpacity
                        style={{ flex: 1 }}
                        onPress={this._onhidePress.bind(this)} />
                        {this.props.content}
                </View>
            }
        />
        );
    }
}



