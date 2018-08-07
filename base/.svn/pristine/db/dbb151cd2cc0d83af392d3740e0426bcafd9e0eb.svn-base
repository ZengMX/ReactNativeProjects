
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
import { PopModal } from 'future/src/widgets';
export default class AlertImall extends Component {
     static propTypes = {
        renderBottom: React.PropTypes.element,

        title: React.PropTypes.string.isRequired,
        titleStyle: React.PropTypes.object,

        message: React.PropTypes.string.isRequired,
        messageStyle: React.PropTypes.object,

        buttomContent: React.PropTypes.object,

        cancelTitle: React.PropTypes.string,
        cancelStyle: React.PropTypes.object,

        confirmTitle: React.PropTypes.string,
        confirmStyle: React.PropTypes.object,

        noticeTitle: React.PropTypes.string,
        noticeStyle: React.PropTypes.object,

        onCancelPress: React.PropTypes.func,
        onConfirmPress: React.PropTypes.func,
        onNoticePress: React.PropTypes.func
    };

    static defaultProps = {
        onCancelPress: () => { },
        onConfirmPress: () => { },
        onNoticePress: () => { },
    }

    constructor(props) {
        super(props);
        this._onhidePress = this._onhidePress.bind(this);
        this._onCancelPress = this._onCancelPress.bind(this);
        this._onConfirmPress = this._onConfirmPress.bind(this);
        this._onNoticePress = this._onNoticePress.bind(this);
    }

    componentDidMount() {
       if(this.props.visible && this.props.visible == true){
           this.show();
       }
    }
    componentWillReceiveProps(nextProps){
         if(nextProps.visible == false){
             this.hide();
         }
    }
    _onhidePress() {
        this.refs.popModal.hide();
    }
    _onCancelPress() {
        if (this.props.onCancelPress) {
            this.refs.popModal.hide();
            this.props.onCancelPress();
        }
    }
    _onConfirmPress() {
        if (this.props.onConfirmPress) {
            this.refs.popModal.hide();
            this.props.onConfirmPress();
        }
    }
    _onNoticePress() {
        if (this.props.onNoticePress && this.props.noticeTitle) {
            this.refs.popModal.hide();
            this.props.onNoticePress();
        }
    }
    show() {
        this.refs.popModal.show();
    }
    hide() {
        this.refs.popModal.hide();
    }

    _renderAlertAndroid() {
        return (
            <PopModal
                ref="popModal"
                containerStyle={this.props.containerStyle}
                closeCallBack={()=>{
                    if(this.props.closeCallBack){
                        this.props.closeCallBack();
                    }
                }}
                animationType={'fade'}
                contentView={
                    <View style={{ width: width, height: height }}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={this._onhidePress} />
                        <View style={styles.alertAndroidView}>
                            <Text
                                numberOfLines={1}
                                style={[styles.title, this.props.titleStyle]}>
                                {this.props.title}
                            </Text>
                            <View style={styles.messageView}>
                                <Text
                                    numberOfLines={4}
                                    style={[styles.message, this.props.messageStyle]}>
                                    {this.props.message}
                                </Text>
                            </View>
                            {this._renderAndroidBottom()}
                        </View>
                    </View>
                }
            />
        );
    }

    _renderAndroidBottom() {
        if (this.props.renderBottom) {
            return (
                <View style={styles.bottomView}>
                    {this.props.renderBottom}
                </View>
            );
        } else if (this.props.noticeTitle) {
            return (
                <View style={styles.bottomView}>
                    <TouchableOpacity
                        onPress={this._onNoticePress}>
                        <Text
                            numberOfLines={1}
                            style={[styles.androidNoticeText, this.props.noticeStyle]}>
                            {this.props.noticeTitle}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.bottomView}>
                    <TouchableOpacity
                        style={styles.androidBottomComm}
                        onPress={this._onCancelPress}>
                        <Text
                            style={[styles.bottomText, this.props.cancelStyle]}>
                            {this.props.cancelTitle}
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.androidBottomComm, { marginRight: 25 }]}
                        onPress={this._onConfirmPress}>
                        <Text
                            style={[styles.bottomText, this.props.confirmStyle]}>
                            {this.props.confirmTitle}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
    }

    _renderAlertIOS() {
        return (
            <PopModal
                ref="popModal"
                animationType={'fade'}
                containerStyle={this.props.containerStyle}
                closeCallBack={()=>{
                    if(this.props.closeCallBack){
                        this.props.closeCallBack();
                    }
                }}
                contentView={
                    <View style={{ width: width, height: height }}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={this._onhidePress} />
                        <View style={styles.alertIOSView}>
                            <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                                <Text
                                    numberOfLines={1}
                                    style={[styles.IOStitle, this.props.titleStyle]}>
                                    {this.props.title}
                                </Text>
                                <Text
                                    numberOfLines={3}
                                    style={[styles.IOSmessage, this.props.messageStyle]}>
                                    {this.props.message}
                                </Text>
                            </View>
                            <View style={styles.ISObottomView}>
                                {this._renderIOSBottom()}
                            </View>
                        </View>
                    </View>
                }
            />
        );
    }
    _renderIOSBottom() {
        if (this.props.renderBottom) {
            let bVstyle = this.props.renderBottom.props.style;
            bVstyle.borderBottomLeftRadius = 12;
            bVstyle.borderBottomRightRadius = 12;
            this.props.renderBottom.props.style = bVstyle;
            return (
                <View style={{ flex: 1, borderBottomLeftRadius: 12, borderBottomRightRadius: 12 }}>
                    {this.props.renderBottom}
                </View>
            );
        } else if (this.props.noticeTitle) {
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TouchableOpacity
                        onPress={this._onNoticePress}>
                        <Text
                            numberOfLines={1}
                            style={[styles.IOSNoticeText, this.props.noticeStyle]}>
                            {this.props.noticeTitle}
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.IOScancleView}>
                        <TouchableOpacity
                            onPress={this._onCancelPress}>
                            <Text
                                style={[styles.IOSbottomText, this.props.cancelStyle]}>
                                {this.props.cancelTitle}
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <TouchableOpacity
                            onPress={this._onConfirmPress}>
                            <Text
                                style={[styles.IOSbottomText, this.props.confirmStyle]}>
                                {this.props.confirmTitle}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }
    render() {
        if (Platform.OS === 'android') {
            return this._renderAlertAndroid();
        } else {
            return this._renderAlertIOS();
        }
    }
}
const styles = StyleSheet.create({
    alertAndroidView: {
        width: width - 50,
        height: 175,
        backgroundColor: '#fff',
        position: 'absolute',
        top: (height - 175) / 2,
        left: 25,
        flexDirection: 'column'
    },
    title: {
        marginTop: 20,
        marginLeft: 25,
        marginRight: 17,
        fontSize: 16,
        color: '#333',
    },
    messageView: {
        flex: 1,
    },
    message: {
        marginTop: 20.5,
        marginLeft: 25,
        marginRight: 14,
        fontSize: 13,
        color: '#333'
    },
    bottomView: {
        width: width - 50,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },

    androidBottomComm: {
        width: 32,
        height: 22,
        marginRight: 35,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bottomText: {
        fontSize: 14,
        color: '#808080',
    },
    androidNoticeText: {
        fontSize: 14,
        color: '#2CBA75',
        marginRight: 25
    },

    alertIOSView: {
        width: width - 50,
        height: 150,
        backgroundColor: '#fff',
        position: 'absolute',
        top: (height - 175) / 2,
        left: 25,
        flexDirection: 'column',
        borderRadius: 12
    },
    ISObottomView: {
        width: width - 50,
        height: 44.5,
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#c9caca',
    },
    IOStitle: {
        fontSize: 17,
        color: '#333',
        marginTop: 15
    },
    IOSmessage: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        paddingHorizontal: 25,
        marginTop: 7,
        lineHeight: 18.5
    },
    IOSNoticeText: {
        fontSize: 16,
        color: '#007AFF'
    },
    IOSbottomText: {
        fontSize: 16,
        color: '#007AFF'
    },
    IOScancleView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRightWidth: 1 / PixelRatio.get(),
        borderColor: '#c9caca'
    },
});


