import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  StyleSheet,
  Animated,
  TouchableHighlight,
  Modal,
  DatePickerIOS,
  Platform,
  DatePickerAndroid,
  TimePickerAndroid
} from 'react-native';

import Style from './style';
import Moment from 'moment';

const FORMATS = {
  'date': 'YYYY-MM-DD',
  'datetime': 'YYYY-MM-DD HH:mm',
  'time': 'HH:mm'
};

export default class TimeDatePicker extends Component {
    constructor(props) {
        super(props);

        this.format = this.props.format || FORMATS[this.props.mode];
        this.state = {
            modalVisible : false,
            animatedHeight : new Animated.Value(0),
            date: this.getDate(),
        }
        this.mode = props.mode || 'date';
        this.setModalVisible = this._setModalVisible.bind(this);
        this.onMoveShouldSetResponder = this._onMoveShouldSetResponder.bind(this);
        this.onStartShouldSetResponder = this._onStartShouldSetResponder.bind(this);
        this.onPressCancel = this.onPressCancel.bind(this);
        this.onPressConfirm = this.onPressConfirm.bind(this);
    }
    static propTypes = {
        modalOnResponderTerminationRequest : React.PropTypes.func,
        customStyles: React.PropTypes.object,
        height : React.PropTypes.number,
        date: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(Date)]),
        minDate: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(Date)]),
        maxDate: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.instanceOf(Date)]),
        mode: React.PropTypes.oneOf(['date', 'datetime', 'time']),
        disabled: React.PropTypes.bool,
        confirmBtnText: React.PropTypes.string,
        cancelBtnText: React.PropTypes.string,
    }

    static defaultProps = {
        modalOnResponderTerminationRequest : e => true,
        customStyles : {},
        height : 259,
        mode: 'date',
        date: '',
        disabled: false,
        confirmBtnText: '确定',
        cancelBtnText: '取消',
    }
    show(){
        this.showOrHidePicker();
    }

    showOrHidePicker(){
        this.setState({
            date: this.getDate(),
        });
        if (Platform.OS === 'ios') {
            this._setModalVisible(!this.state.modalVisible)
        } else {
            if (this.mode === 'date') {
                // 选日期
                DatePickerAndroid.open({
                    date: this.state.date,
                    minDate: this.props.minDate && this.getDate(this.props.minDate),
                    maxDate: this.props.maxDate && this.getDate(this.props.maxDate)
                }).then(this.onDatePicked.bind(this));
            } else if (this.mode === 'time') {
                // 选时间
                let timeMoment = Moment(this.state.date);

                TimePickerAndroid.open({
                    hour: timeMoment.hour(),
                    minute: timeMoment.minutes(),
                    is24Hour: !this.format.match(/h|a/)
                }).then(this.onTimePicked.bind(this));
            } else if (this.mode === 'datetime') {
                // 选日期和时间

                DatePickerAndroid.open({
                    date: this.state.date,
                    minDate: this.props.minDate && this.getDate(this.props.minDate),
                    maxDate: this.props.maxDate && this.getDate(this.props.maxDate)
                }).then(this.onDatetimePicked.bind(this));
            } else {
                throw new Error('The specified mode is not supported');
            }
        }
    }

    datePicked() {
        if (typeof this.props.onDateChange === 'function') {
            this.props.onDateChange(this.getDateStr(this.state.date), this.state.date);
        }
    }
//Android获取时间日期date
    onDatePicked({action, year, month, day}) {
        if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({
            date: new Date(year, month, day)
        });
        this.datePicked();
        }
    }
    //Android获取时间time
    onTimePicked({action, hour, minute}) {
        if (action !== DatePickerAndroid.dismissedAction) {
            this.setState({
                date: Moment().hour(hour).minute(minute).toDate()
            });
            this.datePicked();
        }
    }
    //Android获取时间日期date
    onDatetimePicked({action, year, month, day}) {
        if (action !== DatePickerAndroid.dismissedAction) {
        let timeMoment = Moment(this.state.date);

        TimePickerAndroid.open({
            hour: timeMoment.hour(),
            minute: timeMoment.minutes(),
            is24Hour: !this.format.match(/h|a/)
        }).then(this.onDatetimeTimePicked.bind(this, year, month, day));
        }
    }
    //Android获取datetime
    onDatetimeTimePicked(year, month, day, {action, hour, minute}) {
        if (action !== DatePickerAndroid.dismissedAction) {
        this.setState({
            date: new Date(year, month, day, hour, minute)
        });
        this.datePicked();
        }
    }

    getDate(date = this.props.date) {
        // date默认值
        if (!date) {
        let now = new Date();
            if (this.props.minDate) {
                let minDate = this.getDate(this.props.minDate);

                if (now < minDate) {
                    return minDate;
                }
            }

            if (this.props.maxDate) {
                let maxDate = this.getDate(this.props.maxDate);

                    if (now > maxDate) {
                        return maxDate;
                    }
            }

            return now;
        }

        if (date instanceof Date) {
            return date;
        }

        return Moment(date, this.format).toDate();
    }

    getDateStr(date = this.props.date) {
        if (date instanceof Date) {
            return Moment(date).format(this.format);
        } else {
            return Moment(this.getDate(date)).format(this.format);
        }
    }

    onPressCancel() {
        this.props.onPressCancel && this.props.onPressCancel();
        this.setModalVisible(false);
    }

    onPressConfirm() {
        this.datePicked();
        this.setModalVisible(false);
    }

    _onStartShouldSetResponder(e) {
        return true;
    }

    _onMoveShouldSetResponder(e) {
        return true;
    }

    _setModalVisible(visible){
        this.setState({
            modalVisible:visible
        })

        if (visible) {
            Animated.timing(
                this.state.animatedHeight,
                {
                    toValue: this.props.height,
                    duration: this.props.duration
                }
            ).start();
        } else {
            this.setState({
                animatedHeight: new Animated.Value(0)
            });
        }
    }

    render(){
        let customStyles = this.props.customStyles;
        let plat = Platform.OS;
        if(Platform.OS == 'ios') {
            return <Modal transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {}}>
                <View
                style={{flex: 1}}
                // onStartShouldSetResponder={this.onStartShouldSetResponder}
                // onMoveShouldSetResponder={this.onMoveShouldSetResponder}
                // onResponderTerminationRequest={this.props.modalOnResponderTerminationRequest}
                >
                    <TouchableHighlight
                        style={Style.datePickerMask}
                        // activeOpacity={1}
                        underlayColor={'#00000077'}
                        onPress={this.onPressCancel}
                    >
                        <TouchableHighlight
                        underlayColor={'#fff'}
                        style={{flex: 1}}
                        >
                            <Animated.View
                                style={[Style.datePickerCon, {height: this.state.animatedHeight}, customStyles.datePickerCon]}
                            >
                                <DatePickerIOS
                                date={this.state.date}
                                mode={this.props.mode}
                                minimumDate={this.props.minDate && this.getDate(this.props.minDate)}
                                maximumDate={this.props.maxDate && this.getDate(this.props.maxDate)}
                                onDateChange={(date) => this.setState({date: date})}
                                minuteInterval={this.props.minuteInterval}
                                timeZoneOffsetInMinutes={this.props.timeZoneOffsetInMinutes}
                                style={[Style.datePicker, customStyles.datePicker]}
                                />
                                <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={this.onPressCancel}
                                style={[Style.btnText, Style.btnCancel, customStyles.btnCancel]}
                                >
                                    <Text
                                        style={[Style.btnTextText, Style.btnTextCancel, customStyles.btnTextCancel]}
                                    >
                                        {this.props.cancelBtnText}
                                    </Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                underlayColor={'transparent'}
                                onPress={this.onPressConfirm}
                                style={[Style.btnText, Style.btnConfirm, customStyles.btnConfirm]}
                                >
                                <Text style={[Style.btnTextText, customStyles.btnTextConfirm]}>{this.props.confirmBtnText}</Text>
                                </TouchableHighlight>
                            </Animated.View>
                        </TouchableHighlight>
                    </TouchableHighlight>
                </View>
          </Modal>
        } else {
            return null
        }
    }
}
const styles = StyleSheet.create({
})
