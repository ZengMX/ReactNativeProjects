import React, {Component} from 'react';
import {
    Modal,
	Dimensions,
	View,
	Text
} from 'react-native';

import ScalePopupView from '../modal/ScalePopupView';
import Banner from '../banner/Banner';
export default class Gallery extends Component {
	constructor(props) {
        super(props);
		this.state={
			transparent: true,
			modalVisible: false,
		}
	}
	show(){
		// this.popup.show();
		this.setState({
			modalVisible:true
		})
	}
	hide(){
		// this.popup.hide();
		this.setState({
			modalVisible:false
		})
	}
	// _renderRows(images) {
	// 	return images.map((image, index) => {
	// 		return (
	// 			<PhotoView
	// 			    source={{
	// 			      uri: image
	// 			    }}
	// 				style={{width:320, height:320,backgroundColor:'red'}}
	// 			    minimumZoomScale={0.5}
	// 			    maximumZoomScale={3}
	// 			    androidScaleType="center"
	// 			    onLoad={() => console.log("Image loaded!")}
	// 				>
	// 			  </PhotoView>
	// 		);
	// 	});
	// }
    render() {
		const {images, ...props} = this.props;

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
						paginationStyle={{
							bottom: -20,
						}}
					/>
					<Text style={{flex:1,width:Dimensions.get('window').width}} onPress={()=>{this.setState({modalVisible:false})}}>
					</Text>
				</View>

			</Modal>
        );
    }
}

/*<Swiper
	dot={<View style={{ backgroundColor: 'rgba(255,255,255,.3)', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7, }} />}
	activeDot={<View style={{ backgroundColor: '#fff', width: 10, height: 10, borderRadius: 7, marginLeft: 7, marginRight: 7 }} />}
	paginationStyle={{
		bottom: 10,
	}}
	index={0}
	autoplay={false}
	>

	{ this._renderRows(images1) }
</Swiper>*/
