/**
 * Created by timhuo on 2017/2/4.
 * 功能完成 2017/2/23
 */
import React, { Component } from 'react';
import {
	StyleSheet,
	TouchableOpacity,
} from 'react-native';
import { BaseView } from 'future/src/widgets';
import CheckBox from "@imall-test/react-native-checkbox";

export default class CheckBoxPage extends Component {
	constructor(props) {
		super(props);
		this.state = {
			select: true,
		};
	}

	onPress = () => {
		this.setState({
			select: !this.state.select,
		})
	};

	render() {
		return (
			<BaseView navigator={this.props.navigator} ref={base => this.base = base}>
				<CheckBox
					onChange={(state) => {
						console.log('CheckBox', state);
					}}
				/>
				<TouchableOpacity
					style={styles.container}
					onPress={this.onPress}
				>
					<CheckBox
						selectColor="#5b32df"
						noSelectColor="#ffe599"
						isRadius={false}
						select={this.state.select}
						size={30}
						touchExtended={10}
						enable={false}
					/>
				</TouchableOpacity>

			</BaseView>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		marginTop: 20,
	}
});