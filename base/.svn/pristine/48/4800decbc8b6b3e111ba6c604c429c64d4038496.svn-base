import React, { Component } from 'react';
import {
	View,
	TouchableOpacity,
	InteractionManager,
	Dimensions,
	Platform,
} from 'react-native';
import Drawer from 'react-native-drawer';
import { Text, BaseView, RightNavBtn } from 'future/src/widgets';

import styles from './TwoDrawer.css';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const drawerWidth = screenWidth - 65;

export default class TwoDrawer extends Component {
	constructor(props) {
		super(props);
		this.state = {
			overlay: false,
		}
		this.openFirstDrawer = this._openFirstDrawer.bind(this);
		this.closeFirstDrawer = this._closeFirstDrawer.bind(this);
		this.openSecondDrawer = this._openSecondDrawer.bind(this);
		this.closeSecondDrawer = this._closeSecondDrawer.bind(this);
		this.closeTwoDrawer = this._closeTwoDrawer.bind(this);
	}

	// 第二层抽屉内容
	_renderSecondDrawer() {
		return (
			<View style={styles.firstDrawerRight}>
				<Text>第二层</Text>
				<TouchableOpacity onPress={this.closeSecondDrawer} style={styles.inDrawerButton} >
					<Text>关闭第二层</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={this.closeTwoDrawer} style={styles.inDrawerButton} >
					<Text>关闭两层</Text>
				</TouchableOpacity>
			</View>
		);
	}
	// 关闭两层抽屉
	_closeTwoDrawer() {
		this.secondDrawer.close();
		this.firstDrawer.close();
	}
	//打开、关闭第二层抽屉
	_openSecondDrawer() {
		console.log('第二层抽屉');
		this.secondDrawer.open();
	}
	_closeSecondDrawer() {
		this.secondDrawer.close();
	}

	// 第一层抽屉内容
	_renderFirstDrawer() {
		return (
			<View style={styles.firstDrawer}>
				<TouchableOpacity
					style={styles.firstDrawerLeft}
					activeOpacity={1}
					onPress={this.closeFirstDrawer}
					/>
				<Drawer
					type="overlay"
					side={'right'}
					styles={{ flex: 1 }}
					openDrawerOffset={0}
					ref={(ref) => this.secondDrawer = ref}
					content={this._renderSecondDrawer()}>

					<View style={styles.firstDrawerRight}>
						<Text>第一层</Text>
						<TouchableOpacity onPress={this.closeFirstDrawer} style={styles.inDrawerButton} >
							<Text>关闭第一层</Text>
						</TouchableOpacity>
						<TouchableOpacity onPress={this.openSecondDrawer} style={styles.inDrawerButton} >
							<Text>打开第二层</Text>
						</TouchableOpacity>
					</View>

				</Drawer>
			</View>
		)
	}

	//打开、关闭第一层抽屉
	_openFirstDrawer() {
		this.firstDrawer.open();
	}
	_closeFirstDrawer() {
		this.firstDrawer.close();
	}

	render() {
		return (
			<Drawer
				type="overlay"
				side={'right'}
				openDrawerOffset={0}
				ref={(ref) => this.firstDrawer = ref}
				content={this._renderFirstDrawer()}
				onOpen={() => {
					InteractionManager.runAfterInteractions(() => {
						this.setState({ overlay: true });
					});
				} }
				onClose={() => {
					InteractionManager.runAfterInteractions(() => {
						this.setState({ overlay: false });
					});
				} }>
				<BaseView style={styles.container}
					navigator={this.props.navigator}
					rightButton={(<RightNavBtn handler={this.openFirstDrawer} title='打开抽屉' />)}
					head={(<TouchableOpacity activeOpacity={1} style={styles.inputsBox} onPress={() => { } } >
						<Text style={styles.inputs}> {"请输入关键字"} </Text>
					</TouchableOpacity>)}>
				</BaseView>
        {this.state.overlay && <View style={styles.overlay} />}
			</Drawer >
		);
	}
}

