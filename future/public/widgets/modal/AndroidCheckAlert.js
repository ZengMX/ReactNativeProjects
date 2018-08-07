
import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    Text,
    TouchableOpacity,
    Platform,
    PixelRatio,
    ScrollView
} from 'react-native'
const { height, width } = Dimensions.get('window');
import {
    PopModal,
    TextInputC
} from 'future/public/widgets';
import CheckBox from "@imall-test/react-native-checkbox";
//根据设计师的要求这个组件只在android上使用
export default class AndroidCheckAlert extends Component {
    static propTypes = {
        optionalArray: React.PropTypes.array,
        title: React.PropTypes.string.isRequired,
        titleStyle: React.PropTypes.object,
        cancelStyle: React.PropTypes.object,
        contentTextStyle: React.PropTypes.object,
        onCancelPress: React.PropTypes.func,
        onSelect: React.PropTypes.func,
    };

    static defaultProps = {
        onCancelPress: () => { },
        onSelect: () => { }
    }

    constructor(props) {
        super(props);
        this.state = {
            selectItems: undefined
        };
        this._onhidePress = this._onhidePress.bind(this);
        this._onCancelPress = this._onCancelPress.bind(this);
        this._onConfirmPress = this._onConfirmPress.bind(this);
    }
    componentDidMount() {
       if(this.props.visible && this.props.visible == true){
           this.show();
       }
    }
    _onhidePress() {
        this.refs.checkalet.hide();
    }
    _onCancelPress() {
        if (this.props.onCancelPress) {
            this.refs.checkalet.hide();
            this.props.onCancelPress();
        }
    }
    _onConfirmPress() {
        if (this.props.onConfirmPress) {
            this.refs.inputalet.hide();
            this.props.onConfirmPress(this.state.text);
        }
    }
    _onSelectPress(item, index) {
        this.setState({
            selectItems: item
        });
        this.refs.checkalet.hide();
        if (this.props.onSelect) {
            this.props.onSelect(item, index);
        }
    }
    show() {
        if (this.props.optionalArray && this.props.optionalArray.length > 0) {
            this.refs.checkalet.show();
        }
    }
    hide() {
        this.refs.checkalet.hide();
    }
    _renderSelectItems() {
        if (this.props.optionalArray) {
            return this.props.optionalArray.map((item, index) => {
                return (
                    <TouchableOpacity
                        onPress={this._onSelectPress.bind(this, item, index)}
                        key={index}
                    >
                        <View style={styles.selectItems}>
                            <CheckBox
                                selectImage={require("./res/tanchuang_s1.png")}
                                style={{ marginLeft: 20 }}
                                selectColor={"#2cba75"}
                                //noSelectColor={"rgba(0,0,0,0)"}
                                isRadius={true}
                                select={this.state.selectItems === item ? true : false}
                                animateTime={100}
                                size={18}
                                imgisWhite={false}
                            />
                            <Text
                                numberOfLines={1}
                                style={[styles.selectText, this.props.contentTextStyle]}
                            >
                                {item}
                            </Text>
                        </View>
                    </TouchableOpacity>
                );
            })
        }
    }
    _renderAlertAndroid() {
        return (
            <PopModal
                ref="checkalet"
                containerStyle={this.props.containerStyle}
                contentView={
                    <View style={styles.pop}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={this._onhidePress} />
                        <View style={styles.AndroidpopContentVeiw}>

                            <Text
                                numberOfLines={1}
                                style={[styles.AndroidpopTitleText, this.props.titleStyle]}>
                                {this.props.title}
                            </Text>
                            <ScrollView style={{ flex: 1, marginTop: 20 }}>
                                {this._renderSelectItems()}
                            </ScrollView>
                            <View style={styles.AndroidBottom}>
                                <TouchableOpacity
                                    style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}
                                    onPress={this._onCancelPress}
                                >
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.AndroidcancelText, this.props.cancelStyle]}>
                                        取消
                                </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                }
            />
        );
    }
    _renderAlertIOS() {
        return (
            <PopModal
                ref="checkalet"
                containerStyle={this.props.containerStyle}
                contentView={
                    <View style={styles.pop}>
                        <TouchableOpacity
                            style={{ flex: 1 }}
                            onPress={this._onhidePress} />
                        <View style={styles.AContentVeiw}>

                            <Text
                                numberOfLines={1}
                                style={[styles.AndroidpopTitleText, this.props.titleStyle]}>
                                {this.props.title}
                            </Text>
                            <ScrollView style={styles.IOSScrollView}>
                                <View style={styles.line}></View>
                                {this._renderSelectItems()}
                            </ScrollView>
                            <TouchableOpacity
                                onPress={this._onCancelPress}
                            >
                                <View style={styles.IOSBottom}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styles.IOScancelText, this.props.cancelStyle]}>
                                        取消
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            />
        );
    }
    //根据设计师的要求这个组件只在android上使用
    render() {
        if (Platform.OS === 'android' && this.props.optionalArray) {
            if (this.props.optionalArray.length <= 4) {
                return this._renderAlertAndroid();
            } else {
                return this._renderAlertIOS();
            }
        } else {
            return (
                <PopModal
                    ref="checkalet"
                    containerStyle={this.props.containerStyle}
                    contentView={
                        <View style={styles.pop}>
                            <TouchableOpacity
                                style={{ flex: 1 }}
                                onPress={this._onhidePress} />
                        </View>
                    }
                />
            );
        }
    }
}
const styles = StyleSheet.create({
    pop: {
        width: width,
        height: height
    },
    AndroidpopContentVeiw: {
        width: width - 50,
        height: 305,
        backgroundColor: '#fff',
        position: 'absolute',
        top: (height - 305) / 2,
        left: 25,
        flexDirection: 'column',
        borderRadius: 4,
    },
    AContentVeiw: {
        width: width - 50,
        height: 425,
        backgroundColor: '#fff',
        position: 'absolute',
        top: (height - 425) / 2,
        left: 25,
        flexDirection: 'column',
        borderRadius: 4,
    },
    AndroidBottom: {
        height: 62.5,
        width: width - 50,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    IOScancelText: {
        fontSize: 14,
        color: '#2CBA75',
    },
    AndroidpopTitleText: {
        fontSize: 16,
        color: '#333',
        marginLeft: 20,
        marginRight: 20,
        marginTop: 20,
    },
    AndroidInputContent: {
        flex: 1,
        flexDirection: 'row',
    },
    AndroidpopInput: {
        width: width - 92,
        height: 33,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderColor: '#2CBA75',
        paddingLeft: 5,
        marginRight: 20,
        marginLeft: 20,
        marginTop: 23.5
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
    selectItems: {
        width: width - 50,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
    },
    selectText: {
        fontSize: 14,
        color: '#333',
        marginLeft: 25,
        marginRight: 25
    },

    IOSScrollView: {
        flex: 1,
        marginTop: 19,
    },
    IOSBottom: {
        borderTopWidth: 1.5 / PixelRatio.get(),
        borderColor: '#d7d7d7',
        height: 49,
        width: width - 65,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 7.5,
        marginRight: 7.5
    },
    line: {
        borderTopWidth: 1.5 / PixelRatio.get(),
        borderColor: '#d7d7d7',
        height: 2,
        width: width - 65,
        marginLeft: 7.5,
        marginRight: 7.5
    },
});


