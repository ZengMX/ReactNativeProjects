
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
    TextInputC
} from 'future/src/widgets';
export default class InputAlert extends Component {
    static propTypes = {
        //React.PropTypes.oneOf(['text', 'number']),
        inputType: React.PropTypes.string,
        title: React.PropTypes.string.isRequired,
        titleStyle: React.PropTypes.object,
        subTitle: React.PropTypes.string,
        subTitleStyle: React.PropTypes.object,

        cancelStyle: React.PropTypes.object,
        confirmStyle: React.PropTypes.object,
        placeholder: React.PropTypes.string,
        maxLength: React.PropTypes.number,
        inputStyle: React.PropTypes.object,

        onCancelPress: React.PropTypes.func,
        onConfirmPress: React.PropTypes.func,
        onChangeText: React.PropTypes.func,
    };

    static defaultProps = {
        onCancelPress: () => { },
        onConfirmPress: () => { },
        onChangeText: () => { },
        inputType: 'text',
    }

    constructor(props) {
        super(props);
        this.state = {
            text: undefined
        };
        this._onhidePress = this._onhidePress.bind(this);
        this._onCancelPress = this._onCancelPress.bind(this);
        this._onConfirmPress = this._onConfirmPress.bind(this);
        this._onChangeText = this._onChangeText.bind(this);
    }
    componentDidMount() {
       if(this.props.visible && this.props.visible == true){
           this.show();
       }
    }
    _onhidePress() {
        this.refs.inputalet.hide();
    }
    _onCancelPress() {
        if (this.props.onCancelPress) {
            this.refs.inputalet.hide();
            this.props.onCancelPress();
        }
    }
    _onConfirmPress() {
        if (this.props.onConfirmPress) {
            this.refs.inputalet.hide();
            this.props.onConfirmPress(this.state.text);
        }
    }
    _onChangeText(text) {
        this.setState({
            text: text,
        });
        if (this.props.onChangeText) {
            this.props.onChangeText(text);
        }
    }
    show() {
        this.refs.inputalet.show();
    }
    hide() {
        this.refs.inputalet.hide();
    }
    _renderAlertAndroid() {
        let ph = '1~10个字符';
        if (this.props.placeholder) {
            ph = this.props.placeholder;
        }
        let ml = 10;
        if (this.props.maxLength) {
            ml = this.props.maxLength;
        }
        if (this.props.inputType && this.props.inputType == 'number') {
            return (
                <PopModal
                    ref="inputalet"
                    containerStyle={this.props.containerStyle}
                    contentView={
                        <View style={styles.pop}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this._onhidePress} />
                            <View style={[styles.AndroidpopContentVeiw, { top: 86, height: 198 }]}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.AndroidpopTitleText, this.props.titleStyle]}>
                                        {this.props.title}
                                    </Text>
                                    <View style={styles.AndroidInputContent}>
                                        <Text
                                            numberOfLines={1}
                                            style={[{
                                                fontSize: 13,
                                                color: '#333',
                                                marginLeft: 20,
                                                marginTop: 5,
                                                marginRight: 20
                                            },
                                            this.props.subTitleStyle]}>
                                            {this.props.subTitle}
                                        </Text>
                                        <TextInputC
                                            keyboardType={'numeric'}
                                            style={[styles.AndroidpopInput, this.props.inputStyle]}
                                            placeholder={ph}
                                            placeholderTextColor='#c3cbcf'
                                            clearButtonMode={'while-editing'}
                                            onChangeText={(text) => this._onChangeText(text)}
                                            value={this.state.text}
                                            maxLength={ml}
                                        />
                                    </View>
                                </View>
                                <View style={styles.AndroidpopConfir}>
                                    <TouchableOpacity
                                        onPress={this._onCancelPress}
                                    >
                                        <Text style={[styles.AndroidcancelText, this.props.cancelStyle]}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this._onConfirmPress}
                                    >
                                        <Text style={[styles.AndroidconfirmText, this.props.confirmStyle]}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                />
            );
        } else {
            return (
                <PopModal
                    ref="inputalet"
                    containerStyle={this.props.containerStyle}
                    contentView={
                        <View style={styles.pop}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this._onhidePress} />
                            <View style={styles.AndroidpopContentVeiw}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.AndroidpopTitleText, this.props.titleStyle]}>
                                        {this.props.title}
                                    </Text>
                                    <View style={styles.AndroidInputContent}>
                                        <TextInputC
                                            style={[styles.AndroidpopInput, this.props.inputStyle]}
                                            placeholder={ph}
                                            placeholderTextColor='#c3cbcf'
                                            clearButtonMode={'while-editing'}
                                            onChangeText={(text) => this._onChangeText(text)}
                                            value={this.state.text}
                                            maxLength={ml}
                                        />
                                    </View>
                                </View>
                                <View style={styles.AndroidpopConfir}>
                                    <TouchableOpacity
                                        onPress={this._onCancelPress}
                                    >
                                        <Text style={[styles.AndroidcancelText, this.props.cancelStyle]}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={this._onConfirmPress}
                                    >
                                        <Text style={[styles.AndroidconfirmText, this.props.confirmStyle]}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                />
            );
        }
    }
    _renderAlertIOS() {
        let ph = '请输入支付密码';
        if (this.props.placeholder) {
            ph = this.props.placeholder;
        }
        let ml = 10;
        if (this.props.maxLength) {
            ml = this.props.maxLength;
        }
        if (this.props.inputType && this.props.inputType == 'number') {
            return (
                <PopModal
                    ref="inputalet"
                    containerStyle={this.props.containerStyle}
                    contentView={
                        <View style={styles.pop}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this._onhidePress} />
                            <View style={[styles.popContentVeiw, { top: 129, height: 173.5 }]}>
                                <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>

                                    <Text
                                        numberOfLines={1}
                                        style={[{ fontSize: 17, color: '#333', marginTop: 15 ,paddingLeft:20, paddingRight:20}, this.props.titleStyle]}>
                                        {this.props.title}
                                    </Text>

                                    <Text
                                        numberOfLines={1}
                                        style={[{ fontSize: 13, color: '#333', marginTop: 7 ,paddingLeft:20, paddingRight:20}, this.props.subTitleStyle]}>
                                        {this.props.subTitle}
                                    </Text>
 
                                    <TextInputC
                                        keyboardType={'numeric'}
                                        style={[styles.popInput, {marginTop:16},this.props.inputStyle]}
                                        placeholder={ph}
                                        placeholderTextColor='#c3cbcf'
                                        clearButtonMode={'while-editing'}
                                        onChangeText={(text) => this._onChangeText(text)}
                                        value={this.state.text}
                                        maxLength={ml}
                                    />
                                </View>
                                <View style={styles.popConfir}>
                                    <TouchableOpacity
                                        style={styles.popHalfL}
                                        onPress={this._onCancelPress}
                                    >
                                        <Text style={[styles.popText, this.props.confirmStyle]}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.popHalfR}
                                        onPress={this._onConfirmPress}
                                    >
                                        <Text style={[styles.popText, this.props.confirmStyle]}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                />
            );
        } else {
            return (
                <PopModal
                    ref="inputalet"
                    containerStyle={this.props.containerStyle}
                    contentView={
                        <View style={styles.pop}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this._onhidePress} />
                            <View style={styles.popContentVeiw}>
                                <View style={{ flex: 1, flexDirection: 'column' }}>
                                    <View style={styles.popTitle}>
                                        <Text
                                            numberOfLines={1}
                                            style={[styles.popTitleText, this.props.titleStyle]}>
                                            {this.props.title}
                                        </Text>
                                    </View>

                                    <TextInputC
                                        style={[styles.popInput, this.props.inputStyle]}
                                        placeholder={ph}
                                        placeholderTextColor='#c3cbcf'
                                        clearButtonMode={'while-editing'}
                                        onChangeText={(text) => this._onChangeText(text)}
                                        value={this.state.text}
                                        maxLength={ml}
                                    />
                                </View>
                                <View style={styles.popConfir}>
                                    <TouchableOpacity
                                        style={styles.popHalfL}
                                        onPress={this._onCancelPress}
                                    >
                                        <Text style={[styles.popText, this.props.confirmStyle]}>取消</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.popHalfR}
                                        onPress={this._onConfirmPress}
                                    >
                                        <Text style={[styles.popText, this.props.confirmStyle]}>确定</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    }
                />
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
    pop: {
        width: width,
        height: height
    },
    popContentVeiw: {
        width: width - 50,
        height: 150,
        backgroundColor: '#EAEAEA',
        position: 'absolute',
        top: 125.5,
        left: 25,
        flexDirection: 'column',
        borderRadius: 12,
    },
    popTitle: {
        width: width - 50,
        height: 54,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    popInput: {
        width: width - 75,
        height: 33,
        marginLeft: 12.5,
        marginRight: 12.5,
        backgroundColor: '#fff',
        borderRadius: 2,
        borderWidth: 1 / PixelRatio.get(),
        borderColor: '#bbb',
        paddingLeft: 5
    },
    popTitleText: {
        fontSize: 17,
        color: '#333'
    },
    popConfir: {
        width: width - 50,
        height: 45.5,
        flexDirection: 'row',
        borderBottomLeftRadius: 12,
        borderBottomRightRadius: 12,
    },
    popHalfL: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1 / PixelRatio.get(),
        borderRightWidth: 1 / PixelRatio.get(),
        borderColor: '#d7d7d7'
    },
    popHalfR: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 1 / PixelRatio.get(),
        borderColor: '#d7d7d7'
    },
    popText: {
        fontSize: 16,
        color: '#007AFF'
    },

    AndroidpopContentVeiw: {
        width: width - 50,
        height: 175,
        backgroundColor: '#fff',
        position: 'absolute',
        top: 109,
        left: 25,
        flexDirection: 'column',
        borderRadius: 4,
    },
    AndroidpopTitleText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 21,
    },
    AndroidInputContent: {
        flex: 1,
        flexDirection: 'column',
    },
    AndroidpopInput: {
        width: width - 92,
        height: 33,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#2CBA75',
        marginRight: 20,
        marginLeft: 20,
        marginTop: 23
    },
    AndroidpopConfir: {
        width: width - 50,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
    },
    AndroidcancelText: {
        fontSize: 14,
        color: '#95DCBA',
        marginRight: 25
    },
    AndroidconfirmText: {
        fontSize: 14,
        color: '#95DCBA',
        marginRight: 26
    },
});


