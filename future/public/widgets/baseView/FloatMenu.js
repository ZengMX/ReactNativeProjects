import React, { Component } from 'react';
import {
    StyleSheet,
	Text,
    View,
    Dimensions,
    PixelRatio,
    TouchableOpacity,
    ScrollView,
    Image,
	Platform
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;
// import Search from 'future/src/home/components/Search';


export default class FloatMenu extends Component {
	static propTypes={
		closeMask:React.PropTypes.func,
		itemSelect:React.PropTypes.func,
	}
    render(){
		return (
			<ScrollView style={styles.float} showsVerticalScrollIndicator={false}>
				<TouchableOpacity style={{position: 'absolute', top: 0, width: screenWidth, height: screenHeight-64}} onPress={()=>{this.props.closeMask()}}
					activeOpacity={0.99}>
				</TouchableOpacity>
				<View style={this.props.triangleStyle || styles.shangSanJiao}>
					<Image source={require('./res/FloatMenu/011gengduosanjiao.png')}/>
				</View>
				{this.props.content}
			</ScrollView>
		)
	}
}

const styles = StyleSheet.create({
	shangSanJiao:{
		// position: 'absolute',
		// top: -4,
		// right: 20,
		// height:4,
		// width: 8,
		width: 0,
		height: 0
	},
	float : {
		position: 'absolute',
		top: Platform.OS === "ios" ? 64 : 44,
		backgroundColor:'rgba(0, 0, 0, 0.5)',
		bottom:0 ,
		// height:screenHeight-64,
		flex: 1,
		width:screenWidth,
	},
	btns : {
		height: 49,
		width : screenWidth,
		paddingLeft: 10,
		backgroundColor:'#fff',
		flexDirection:'column',
		justifyContent:'center',
		alignItems: 'center',
	}
})
