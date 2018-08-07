/**
 * 2017/03/31
 * 用新组件取代：
 * http://192.168.1.209:8000/pages/viewpage.action?pageId=8422406
 */
import React, { Component } from 'react';
import {
	Modal,
	Dimensions,
	View,
	Text,
	Platform,
	TouchableOpacity,
	Image,
} from 'react-native';
import ScalePopupView from '../modal/ScalePopupView';
import Banner from '../banner/Banner';
import Swiper from 'react-native-swiper'
// import PhotoView from 'react-native-photo-view'
const { width, height } = Dimensions.get('window')
const renderPagination = (index, total, context) => {
	return (
		<View style={{
			position: 'absolute',
			justifyContent: 'center',
			alignItems: 'center',
			top: Platform.OS === 'ios' ? -30 : 10,
			left: 0,
			right: 0
		}}>
			<View style={{
				borderRadius: 7,
				backgroundColor: 'rgba(255,255,255,.15)',
				padding: 3,
				paddingHorizontal: 7
			}}>
				<Text style={{
					color: '#fff',
					fontSize: 14
				}}>{index + 1}/ {total}</Text>
			</View>
		</View>
	)
}

const Viewer = props => <Swiper index={props.index} renderPagination={renderPagination} loop={false}>
	{/** 
		props.imgList.map((item, i) => <View key={i}>
			<PhotoView
				source={{ uri: item }}
				minimumZoomScale={0.5}
				maximumZoomScale={3}
				androidScaleType="fitCenter" //Android only: One of the default Android scale types: "center", "centerCrop", "centerInside", "fitCenter", "fitStart", "fitEnd", "fitXY"
				onLoad={() => console.log("Image loaded!")}
				style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.6 }} />
		</View>)
	*/}
</Swiper>

export default class Gallery extends Component {
	constructor(props) {
		super(props);
		this.state = {
			transparent: true,
			modalVisible: false,
			showIndex: 0,
			imgList: this.props.images,
		}
	}
	componentDidMount() {
	}
	_onClick() {
		this.props.onClick();
	}
	show() {
		this.setState({
			modalVisible: true
		})
	}
	hide() {
		this.setState({
			modalVisible: false
		})
	}
	renderGallery() {
		if (Platform.OS == 'ios') {
			return (
				<Viewer
					index={this.state.showIndex}
					imgList={this.props.images} />
			);
		} else {
			return (
				<Banner images={this.props.images}
					height={Dimensions.get('window').height * 0.6}
					width={Dimensions.get('window').width}
					autoplay={false}
					loop={false}
					paginationStyle={{
						bottom: Platform.OS == 'ios' ? -20 : 70
					}}
				/>
			);
		}
	}
	render() {
		return (
			<Modal
				animationType={'none'}
				transparent={this.state.transparent}
				visible={this.state.modalVisible}
				onRequestClose={() => {
					this.setState({
						modalVisible: false
					})
				}}
				style={{
					justifyContent: 'center',
					alignItems: 'center'
				}}
			>
				<View style={{
					flex: 1,
					justifyContent: 'center',
					backgroundColor: 'rgba(0,0,0,0.5)',
					alignItems: 'center'
				}}>
					<Text style={{ flex: 1, width: Dimensions.get('window').width }} onPress={() => { this.setState({ modalVisible: false }) }}>
					</Text>

					<View style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height * 0.6 }}>
						{this.renderGallery()}
					</View>

					<Text style={{ flex: 1, width: Dimensions.get('window').width }} onPress={() => { this.setState({ modalVisible: false }) }}>
					</Text>
				</View>
			</Modal>
		);
	}
}

/*
import React, {Component} from 'react';
import {
    Modal,
	Dimensions,
	View,
	Text,
	Platform,
	TouchableOpacity
} from 'react-native';
import ScalePopupView from '../modal/ScalePopupView';
import Banner from '../banner/Banner';
export default class Gallery extends Component {
	constructor(props) {
        super(props);
		this.state={
			transparent: true,
			modalVisible: false,
			index:0
		}
	}
	componentDidMount(){
	}
	_onClick(){
      this.props.onClick();
	}
	show(){
		this.setState({
			modalVisible:true
		})
	}
	hide(){
		this.setState({
			modalVisible:false
		})
	}
    render() {
		const {images, ...props} = this.props;
		console.log("this.props.images",this.props.images);
		return (
			<Modal
				animationType={'none'}
				transparent={this.state.transparent}
				visible={this.state.modalVisible}
				onRequestClose={()=>{}}
				style={{
					justifyContent:'center',
					alignItems:'center'
				}}
				>
				<View style={{
					flex:1,
					justifyContent:'center',
					backgroundColor:'rgba(0,0,0,0.5)',
					alignItems:'center'}}>
					<Text style={{flex:1,width:Dimensions.get('window').width}} onPress={()=>{this.setState({modalVisible:false})}}>
					</Text>
					<Banner images={images}
						height={Dimensions.get('window').height * 0.6}
						width={Dimensions.get('window').width}
						autoplay={false}
						loop={false}
						paginationStyle={{
                                bottom: Platform.OS == 'ios' ? -20 : 70
                       }}
					/>
					<Text style={{flex:1,width:Dimensions.get('window').width}} onPress={()=>{this.setState({modalVisible:false})}}>
					</Text>
				</View>
			</Modal>	
        );
    }
}
*/
