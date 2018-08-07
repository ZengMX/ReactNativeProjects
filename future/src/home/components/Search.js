import React, { Component } from 'react';
import {
	Text,
	View,
	Image,
	StyleSheet,
	TouchableOpacity,
	ScrollView,
	Platform,
	InteractionManager,
	TouchableHighlight
} from 'react-native';

import {
	Fetch,
	imageUtil,
	ValidateUtil,
} from 'future/public/lib';

import {
	Loading,
	Toast,
	BaseView,
	TextInputC
} from 'future/public/widgets';
import _ from 'underscore';

import ProductList from '../../product/components/ProductList'

export default class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {
			keyword: [],																		//历史搜索词数组
			searchWord: this.props.params && this.props.params.searchWord || '',				//搜索输入框关键字
			hotWord: [],																		//热门搜索词
		}
	}
	componentWillMount() {
		InteractionManager.runAfterInteractions(() => {
			this.getHotWord();
			this.getStorageData();
		})
	}
	componentDidMount() {
	}
	componentWillUnmount() {
	}

	getHotWord() {
		new Fetch({
			url: '/app/product/getKeyWord.json',
			data: {
				limit: 10
			},
		}).dofetch().then((data) => {
			if (data.result) {
				this._deleteNULL(data.result);
			}
		}).catch((error) => {
			Toast.show('网络异常');
			console.log('catch: ', error);
		})
	}

	//删除数组中返回的null值
	_deleteNULL(array) {
		let hotArray = [];//去除null后的结果
		for (var i = 0; i < array.length; i++) {
			if (array[i] != null) {
				hotArray.push(array[i]);
			}
		}

		this.setState({
			hotWord: hotArray
		})
	}

	getStorageData() {
		global.storage.load({
			key: 'historyWord',
		}).then((res) => {
			this.setState({
				keyword: res.keyword,
			})
		}).catch((err) => {
			switch (err.name) {
				case 'NotFoundError':
					console.log('NotFoundError');
					break;
				case 'ExpiredError':
					console.log('ExpiredError');
					break;
			}
		})
	}

	setStorageData(arr) {
		global.storage.save({
			key: 'historyWord',
			rawData: {
				keyword: arr
			}
		})
	}

	clearStorageData() {
		global.storage.remove({
			key: 'historyWord'
		});
	}

	clearHistoryWord() {
		this.setState({
			keyword: [],
		});
		this.clearStorageData();
	}

	submit(keyword) {

		let arr = this.state.keyword;
		let a = keyword || this.state.searchWord;
		//当a不为空，而且不重复的时候，将结果设置到storage
		if (a.trim() != '' && arr.indexOf(a) == -1) {
			arr.push(a);
			this.setStorageData(arr);
			this.setState({ keyword: arr });
		}

		//this.props.params.callBack && this.props.params.callBack(this.state.text);
		//避免安卓BUG触发2次
		this.timeout && clearTimeout(this.timeout);
		this.timeout = setTimeout(() => {
			InteractionManager.runAfterInteractions(() => {
				this.props.navigator.push({
					params: {
						keyword: this.state.searchWord,
						fromSearch: true,
					},
					component: ProductList
				})
			})
		}, 300);

	}

	_templateWordStyle(data) {
		let lists = _.map(data, (item, index) => {
			return (
				<TouchableHighlight
					underlayColor='#eff0f4'
					onPress={() => {
						this.setState({ searchWord: item })
						setTimeout(() => {
							this.submit(item)
						}, 0)
					} }
					style={styles.keywordTouch}
					key={item + index}
					>
					<Text style={styles.keywordText}>{item}</Text>
				</TouchableHighlight>
			)
		})
		return lists;
	}

	_getHistortWord() {
		return this._templateWordStyle(this.state.keyword);
	}

	renderHead() {
		return (
			<View style={{ flexDirection: 'row', backgroundColor: '#34457D', alignItems: 'center' }}>
				<View style={{
					backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center',
					flex: 1, borderRadius: 4, height: 30, marginLeft: 13
				}}>
					<TouchableOpacity
						onPress={() => {
							this.submit();
						} }
						>
						<Image style={{ width: 16, height: 16, marginHorizontal: 10, }} source={require('../res/search/a002sousuo.png')} />
					</TouchableOpacity>
					<TextInputC
						onSubmitEditing={() => {
							this.submit();
						} }
						onChangeText={(text) => {
							this.setState({
								searchWord: text
							});
						} }
						returnKeyType={'search'}
						numberOfLines={1}
						autoFocus={true}
						value={this.state.searchWord}
						clearButtonMode={'while-editing'}
						placeholder='搜索商品 / 品牌'
						placeholderTextColor='#73777C'
						style={{ color: '#333333', fontSize: 13, flex: 1 }}
						/>
				</View>
				<TouchableOpacity
					activeOpacity={0.7}
					onPress={() => {
						this.props.navigator.pop();
					} }>
					<Text style={{ fontSize: 15, color: '#fff', marginLeft: 12, marginRight: 13 }}>取消</Text>
				</TouchableOpacity>
			</View>
		)
	}

	render() {
		return (
			<BaseView
				head={this.renderHead()}
				scrollEnabled={false}
				hideLeftBtn={true}
				navigator={this.props.navigator}
				mainColor={'#34457D'}
				statusBarStyle={'light-content'}
				>
				<ScrollView
					showsVerticalScrollIndicator={false}
					keyboardShouldPersistTaps={false}
					keyboardDismissMode='on-drag'
					style={styles.body}>
					<View style={styles.body}>
						<View style={styles.hotRearch}>
							<Text style={styles.hotRearchText}>热门搜索</Text>
						</View>

						<View style={{ height: 40 }}>
							<ScrollView
								contentContainerStyle={{ paddingHorizontal: 10 }}
								showsHorizontalScrollIndicator={false}
								horizontal={true}
								>
								{
									this.state.hotWord.length > 0 && this.state.hotWord.map((item, index) => {
										//if (item == null) continue;
										return (
											<TouchableHighlight
												underlayColor='#eff0f4'
												onPress={() => {
													this.setState({ searchWord: item })
													setTimeout(() => {
														this.submit(item)
													}, 0)
												} }
												style={[styles.keywordTouch, { maxWidth: global.SCREENWIDTH - 24 }]}
												key={index}
												>
												<Text style={[styles.keywordText]} numberOfLines={1}>{item}</Text>
											</TouchableHighlight>
										)
									})
								}
							</ScrollView>
						</View>
						<View style={styles.historyRea}>
							<Text style={styles.historyText1}>历史搜索</Text>
							<TouchableOpacity
								onPress={() => {
									this.clearHistoryWord()
								} }>
								<Text style={styles.historyText2}>清空</Text>
							</TouchableOpacity>
						</View>
						<View style={styles.keywordView}>
							{this._getHistortWord()}
						</View>

					</View>
				</ScrollView>
			</BaseView>
		)
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff'
	},
	imgR: {
		width: 16,
		height: 16,
	},
	body: {
		flex: 1,
	},
	hotRearch: {
		height: 40,
		width: global.SCREENWIDTH,
		justifyContent: 'center'
	},
	hotRearchText: {
		color: '#666',
		fontSize: 14,
		marginLeft: 13
	},
	historyRea: {
		height: 40,
		width: global.SCREENWIDTH,
		flexDirection: 'row',
		alignItems: 'center',
	},
	historyText1: {
		color: '#666',
		fontSize: 14,
		marginLeft: 13,
		flex: 1
	},
	historyText2: {
		color: '#0082FF',
		fontSize: 14,
		width: 42,
		marginLeft: 30,
	},
	keywordView: {
		marginHorizontal: 10,
		flexDirection: 'row',
		flexWrap: 'wrap',
	},
	keywordTouch: {
		height: 30,
		justifyContent: 'center',
		paddingHorizontal: 12,
		backgroundColor: '#fff',
		borderRadius: 3,
		margin: 5,
		borderWidth: StyleSheet.hairlineWidth,
		borderColor: '#979797'
	},
	keywordText: {
		color: '#333',
		fontSize: 14,
	}
})
