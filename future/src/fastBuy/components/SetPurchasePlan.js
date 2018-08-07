import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
  DatePickerIOS
} from 'react-native';
import DeviceEventEmitter from 'RCTDeviceEventEmitter';
import { RefreshableListView, BaseView, DatePicker } from '../../widgets';
// import {MKSwitch,MKColor} from 'react-native-material-kit';
// import DatePickerAndroid from '@imall-test/react-native-datepicker';
import Switch from './MXSwitch';
import SetAlertParams from './SetAlertParams';
import Fetch from 'future/src/lib/Fetch';

let PARAMS = {};
let SCREENWIDTH = require('Dimensions').get('window').width;
let SCREENHEIGHT = require('Dimensions').get('window').height;
let CURRENTTYPE = { phone:'phone',realert:'realert',content:'content'};

function getTime(date) {
	var hourStr = date.getHours();
	var minuteStr = date.getMinutes();
	var hour = parseInt(hourStr);
	var minute = parseInt(minuteStr);
	var timeStr = "";
	if (hour > 12) {
		timeStr = "下午 " + (hour - 12).toString() + ":" + minuteStr;
	} else {
		timeStr = "上午 " + hourStr + ":" + minuteStr;
	}
	return timeStr;
}
export default class SetPurchasePlan extends Component {
    constructor(props) {
        super(props);
        this.renderModalScence=this._renderModalScence.bind(this);
        this.onDateChange=this._onDateChange.bind(this);
        this.state = {
            date: new Date().toLocaleDateString(),
            time:'',
            timeZoneOffsetInHours: (-1) * (new Date()).getTimezoneOffset() / 60,
            mode:'date',
            checked:props.params.isEnableNotice=='Y',
            value:props.params.isEnableNotice=='Y',
            openChecked:props.params.isPushMessage=='Y',
            openValue:props.params.isPushMessage=='Y',
            format:'YYYY-MM-DD',
            phoneTxt:props.params.receiveMobile,
            noticePeriod:props.params.noticePeriod,
            noticeContent:props.params.noticeContent
        }

        console.log('')

        PARAMS.purchaseTemplateId=props.params.purchaseTemplateId;
        PARAMS.isEnableNotice=props.params.isEnableNotice;
        PARAMS.isEnableRepeatNotice=props.params.isEnableRepeatNotice;
        PARAMS.noticePeriod=props.params.noticePeriod;
        PARAMS.noticeDate=props.params.noticeDate;
        PARAMS.isMobileNotice=props.params.isMobileNotice;
        PARAMS.receiveMobile=props.params.receiveMobile;
        PARAMS.isPushMessage=props.params.isPushMessage;
        PARAMS.noticeContent=props.params.noticeContent;
    }
    componentWillMount(){
    }
    componentDidMount(){
        let noticeDate = new Date(PARAMS.noticeDate)
        let dateString = noticeDate.getFullYear() + "-" + (noticeDate.getMonth() + 1) + "-" + noticeDate.getDate();
        let timeString = noticeDate.getHours() + ":" + noticeDate.getMinutes() + ":" + noticeDate.getSeconds();
        this.setState({
            date:noticeDate.getFullYear() + "-" + (noticeDate.getMonth() + 1) + "-" + noticeDate.getDate(),
            time:getTime(noticeDate),
        });
        PARAMS.noticeDate = dateString+" "+timeString;
        this.refs.content.setNativeProps({
            style:{
                left:PARAMS.isEnableNotice=='N'?-SCREENWIDTH:0
            }
        });
        this.callbackListener = DeviceEventEmitter.addListener('Remind',(object)=>{
            // console.log('MMMMMM',object)
            if(object&&object.type=='phone'){
                PARAMS.isMobileNotice = object.isMobileNotice;
                PARAMS.receiveMobile = object.receiveMobile;
            }

            if(object&&object.type=='realert'){
                PARAMS.isEnableRepeatNotice = object.isEnableRepeatNotice;
                PARAMS.noticePeriod = object.noticePeriod;
            }

            if(object&&object.type=='content'){
                PARAMS.noticeContent = object.noticeContent;
            }
            
            this.setState({
                phoneTxt:PARAMS.receiveMobile,
                noticePeriod:PARAMS.noticePeriod,
                noticeContent:PARAMS.noticeContent
            })
            
        });
    }
    componentWillUnmount(){
        this.callbackListener&&this.callbackListener.remove();
    }
    _onIconChecked(e){
        PARAMS.isEnableNotice = e?'Y':'N';
        this.refs.content.setNativeProps({
            style:{
                left:e==false?-SCREENWIDTH:0
            }
        })

        Platform.OS=='ios'&&this.setState({value:e});

        Platform.OS=='android'&&this.setState({
            checked:!this.state.checked
        })
    }
    _onValueChange(e){
        if(e){
            PARAMS.isPushMessage='Y';
        } else {
            PARAMS.isPushMessage='N';
        }
        Platform.OS=='ios'&&this.setState({openValue:e});

        Platform.OS=='android'&&this.setState({
            openChecked:!this.state.openChecked
        })
    }
    _onDateChange(date){
        this.setState({
            date:date
        })
    }
    _renderModalScence(){
        return(
            <View style={{backgroundColor:'#fff',alignItems:'center',height:SCREENWIDTH,borderRadius:5}}>
                <View style={{justifyContent:'center',alignItems:'center',height:35,width:SCREENWIDTH-40}}>
                     <Text style={{fontSize:14}}>请选择日期</Text>
                </View>
                <DatePickerIOS
                minimumDate={new Date()}
                style={{width:SCREENWIDTH-80,height:SCREENWIDTH-120}}
                date={this.state.date}
                mode={this.state.mode}
                timeZoneOffsetInMinutes={this.state.timeZoneOffsetInHours * 60}
                onDateChange={this.onDateChange}/>
                <View style={{justifyContent:'center',alignItems:'center',height:80,width:SCREENWIDTH-40}}>
                     <TouchableOpacity onPress={this._closePicker.bind(this)} style={{justifyContent:'center',alignItems:'center',backgroundColor:'#3491df',width:160,height:40,borderRadius:5}}>
                        <Text style={{fontSize:14,color:'#fff'}}>确认</Text>
                     </TouchableOpacity>
                </View>
            </View>
        )
    }
    _closePicker(){
        if(Platform.OS=='ios') this.refs.baseview.hideModal();
        else console.log('>>>>>>>>>>>>>');
    }
    _pickerDateTime(mode,format){
        this.setState({
            mode:mode,
            format:format
        })
        if(mode=='date'){
            this.picker.show();
        } else {
            if(this.state.date.length<8) alert('请先选择日期')
            else this.picker1.show();
        }
            
        
        // if(Platform.OS=='ios') this.refs.baseview.showModal();
        // else DatePickerAndroid.showTimePicker()
    }
    _goToSetAlertParams(type,title){
        this.props.navigator.push({
            component: SetAlertParams,
            params:{
                type:type,
                title:title,
                noticeContent:PARAMS.noticeContent,
                noticePeriod:PARAMS.noticePeriod,
                receiveMobile:PARAMS.receiveMobile,
                isEnableRepeatNotice:PARAMS.isEnableRepeatNotice
            }
        })
    }
    _save(){
        new Fetch({
			url: '/app/user/addRemind.json',
			method: 'POST',
			data: PARAMS,
			bodyType: 'json',
		}).dofetch().then((data) => {
            if(data.success){
                this.props.navigator.pop();
                DeviceEventEmitter.emit('updatePlanSuccess');
                this.refs.baseview.showToast('设置成功');
            }
		});
    }
    render(){
        return(
            <BaseView 
            ref='baseview'
            
            title={{ title: '采购计划提醒', fontSize: 16, tintColor: '#fff' }} 
            navigator={this.props.navigator} >
                <ScrollView style={styles.container}>
                    <View style={{justifyContent:'center',marginLeft:12}}>
                        <Text style={{fontSize:14,marginTop:15,marginBottom:15}}>{this.props.params.templateNm}</Text>
                    </View>
                    <View style={styles.item_view}>
                        <Text style={styles.item_title}>开启提醒</Text>
                        <Switch 
                        checked={this.state.checked}
                        value={this.state.value}
                        onCheckedChange={(e) => {this._onIconChecked(e)}}
                        onValueChange={(value)=>{this._onIconChecked(value)}}/>
                        
                    </View>
                    <View ref='content' style={styles.item_main}>
                        <View style={{marginTop:10}}>
                            <TouchableOpacity onPress={this._pickerDateTime.bind(this,'date')}>
                                <View style={styles.item_view}>
                                    <Text style={styles.item_title}>提醒日期</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={styles.item_value}>{this.state.date}</Text>
                                        <Image style={styles.item_arrow} source={require('../res/images/000jinru.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._pickerDateTime.bind(this,'time')}>
                                <View style={styles.item_view}>
                                    <Text style={styles.item_title}>提醒时间</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={styles.item_value}>{this.state.time}</Text>
                                        <Image style={styles.item_arrow} source={require('../res/images/000jinru.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                        <View style={{marginTop:10}}>
                            <TouchableOpacity onPress={this._goToSetAlertParams.bind(this,CURRENTTYPE.phone,'手机短信')}>
                                <View style={styles.item_view}>
                                    <Text style={styles.item_title}>手机短信</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text ref='phoneTxt' style={styles.item_value}>{this.state.phoneTxt}</Text>
                                        <Image style={styles.item_arrow} source={require('../res/images/000jinru.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <View style={styles.item_view}>
                                <Text style={styles.item_title}>开启消息通知</Text>
                                <Switch
                                checked={this.state.openChecked}
                                value={this.state.openValue}
                                onCheckedChange={(e) => {this._onValueChange(e)}}
                                onValueChange={(value)=>{this._onValueChange(value)}}/>
                            </View>
                        </View>
                        <View style={{marginTop:10}}>
                            <TouchableOpacity onPress={this._goToSetAlertParams.bind(this,CURRENTTYPE.realert,'重复提醒')}>
                                <View style={styles.item_view}>
                                    <Text style={styles.item_title}>重复提醒</Text>
                                    <View style={{flexDirection:'row'}}>
                                        <Text style={styles.item_value}>{PARAMS.isEnableRepeatNotice=='Y'&&this.state.noticePeriod!=''?'每隔'+this.state.noticePeriod+'天提醒':''}</Text>
                                        <Image style={styles.item_arrow} source={require('../res/images/000jinru.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={this._goToSetAlertParams.bind(this,CURRENTTYPE.content,'提醒内容')}>
                                <View style={styles.item_view}>
                                    <Text style={styles.item_title}>提醒内容</Text>
                                    <View style={{flexDirection:'row',width:SCREENWIDTH-100,justifyContent:'flex-end',}}>
                                        <Text style={styles.item_value} numberOfLines={1}>{this.state.noticeContent}</Text>
                                        <Image style={styles.item_arrow} source={require('../res/images/000jinru.png')}/>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
                <View style={styles.bottom_content}>
                    <TouchableOpacity style={styles.bottom_btn} onPress={this._save.bind(this)}>
                        <Text style={{color:'#fff',fontSize:13}}>保存</Text>
                    </TouchableOpacity>
                </View>
                <DatePicker
					ref={picker => this.picker = picker}
					style={{ width: 200 }}
					date={this.state.date}
					mode='date'
                    minDate={new Date()}
					format='YYYY-MM-DD' //时间日期显示时的模式
					onDateChange={(date) => { 
                        let timeStr = date + " 23:59:59";
                        if (new Date(Date.parse(timeStr.replace(/-/g, "/"))) - new Date() < 0) {
                            this.refs.baseview.showToast('提醒日期不能小于今天，请重新选择');
                        } else {
                            this.setState({ date: date }); 
                        }
                        PARAMS.noticeDate = date+" "+PARAMS.noticeDate.substr(10,8);
                    } } //选择好日期后的回调
					/>
                <DatePicker
					ref={picker => this.picker1 = picker}
					style={{ width: 200 }}
					date={this.state.time}
					mode="time"
					format="HH:mm"
					onDateChange={(time) => {this.setState({ time: time }); PARAMS.noticeDate=PARAMS.noticeDate.substr(0,10) +" "+ time+":00";} }
					/>
            </BaseView>
        )
    }
}
const styles = StyleSheet.create({
    container:{
        width:SCREENWIDTH,
        height:SCREENHEIGHT-124
    },
    item_title:{
        marginLeft:12,
        fontSize:14
    },
    item_view:{
        height:45,
        alignItems:'center',
        backgroundColor:'#fff',
        flexDirection:'row',
        justifyContent:'space-between'
    },
    item_main:{
        left:-SCREENWIDTH,
    },
    item_arrow:{
        width:6,
        height:12,
        marginRight:12
    },
    item_value:{
        fontSize:12,
        marginRight:5,
        marginTop:-1,
        color:'#9A9A9A'
    },
    bottom_content:{
        height:60,
        width:SCREENWIDTH,
        justifyContent:'center',
        alignItems:'center'
    },
    appleSwitch: {
        marginTop: 7,
        marginBottom: 7,
    },
    bottom_btn:{
        width:296,
        height:40,
        backgroundColor:'#3491df',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:5
    }
})
