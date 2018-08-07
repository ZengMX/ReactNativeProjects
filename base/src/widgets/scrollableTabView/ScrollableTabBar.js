const React = require('react');
const ReactNative = require('react-native');
const {
	View,
	TouchableOpacity,
	Animated,
	StyleSheet,
	ScrollView,
	Text,
	Platform,
	Dimensions,
} = ReactNative;

const WINDOW_WIDTH = Dimensions.get('window').width;

const ScrollableTabBar = React.createClass({
	propTypes: {
		goToPage: React.PropTypes.func,
		activeTab: React.PropTypes.number,
		tabs: React.PropTypes.array,
		underlineColor: React.PropTypes.string,
		underlineHeight: React.PropTypes.number,
		backgroundColor: React.PropTypes.string,
		scrollOffset: React.PropTypes.number,
		style: View.propTypes.style,
		tabsContainerStyle: View.propTypes.style
	},

	getDefaultProps() {
		return {
			scrollOffset: 52,
			underlineColor: '#2fbdc8',
			backgroundColor: null,
			underlineHeight: 2,
			style: {},
			tabsContainerStyle: {},
		};
	},
	getInitialState() {
		this._tabsMeasurements = [];
		return {
			_leftTabUnderline: new Animated.Value(0),
			_widthTabUnderline: new Animated.Value(0),
			_containerWidth: null,
		};
	},

	componentDidMount() {
		this.props.scrollValue.addListener(this.updateView);
	},

	updateView(offset) {
		const position = Math.floor(offset.value);
		const pageOffset = offset.value % 1;
		const tabCount = this.props.tabs.length;
		const lastTabPosition = tabCount - 1;

		if (tabCount === 0 || offset.value < 0 || offset.value > lastTabPosition) {
			return;
		}

		if (this.necessarilyMeasurementsCompleted(position, position === lastTabPosition)) {
			this.updateTabPanel(position, pageOffset);
			this.updateTabUnderline(position, pageOffset, tabCount);
		}
	},

	necessarilyMeasurementsCompleted(position, isLastTab) {
		return this._tabsMeasurements[position] &&
			(isLastTab || this._tabsMeasurements[position + 1]) &&
			this._tabContainerMeasurements &&
			this._containerMeasurements;
	},

	updateTabPanel(position, pageOffset) {
		const containerWidth = this._containerMeasurements.width;
		const tabWidth = this._tabsMeasurements[position].width;
		const nextTabMeasurements = this._tabsMeasurements[position + 1];
		const nextTabWidth = nextTabMeasurements && nextTabMeasurements.width || 0;
		const tabOffset = this._tabsMeasurements[position].left;
		const absolutePageOffset = pageOffset * tabWidth;
		let newScrollX = tabOffset + absolutePageOffset;

		// center tab and smooth tab change (for when tabWidth changes a lot between two tabs)
		newScrollX -= (containerWidth - (1 - pageOffset) * tabWidth - pageOffset * nextTabWidth) / 2;
		newScrollX = newScrollX >= 0 ? newScrollX : 0;

		if (Platform.OS === 'android') {
			this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false, });
		} else {
			const rightBoundScroll = this._tabContainerMeasurements.width - (this._containerMeasurements.width);
			newScrollX = newScrollX > rightBoundScroll ? rightBoundScroll : newScrollX;
			this._scrollView.scrollTo({ x: newScrollX, y: 0, animated: false, });
		}

	},

	updateTabUnderline(position, pageOffset, tabCount) {
		const lineLeft = this._tabsMeasurements[position].left;
		const lineRight = this._tabsMeasurements[position].right;

		if (position < tabCount - 1) {
			const nextTabLeft = this._tabsMeasurements[position + 1].left;
			const nextTabRight = this._tabsMeasurements[position + 1].right;

			const newLineLeft = (pageOffset * nextTabLeft + (1 - pageOffset) * lineLeft);
			const newLineRight = (pageOffset * nextTabRight + (1 - pageOffset) * lineRight);

			this.state._leftTabUnderline.setValue(newLineLeft);
			this.state._widthTabUnderline.setValue(newLineRight - newLineLeft);
		} else {
			this.state._leftTabUnderline.setValue(lineLeft);
			this.state._widthTabUnderline.setValue(lineRight - lineLeft);
		}
	},

	renderTabOption(name, page) {
		const isTabActive = this.props.activeTab === page;
		const tab = this.props.renderTab(isTabActive, name, page);

		return React.cloneElement(tab, {
			key: `${name}_${page}`,
			accessible: true,
			accessibilityLabel: name,
			accessibilityTraits: 'button',
			onPress: () => this.props.goToPage(page),
			onLayout: this.measureTab.bind(this, page)
		});
	},

	measureTab(page, event) {
		const { x, width, height, } = event.nativeEvent.layout;
		this._tabsMeasurements[page] = { left: x, right: x + width, width, height, };
		this.updateView({ value: this.props.scrollValue._value, });
	},

	render() {
		const tabUnderlineStyle = {
			position: 'absolute',
			height: this.props.underlineHeight,
			backgroundColor: this.props.underlineColor,
			bottom: 0,
		};

		const dynamicTabUnderline = {
			left: this.state._leftTabUnderline,
			width: this.state._widthTabUnderline,
		};
		return <View
			style={[styles.container, { backgroundColor: this.props.backgroundColor, }, this.props.style,]}
			onLayout={this.onContainerLayout}
			>
			<ScrollView
				ref={(scrollView) => { this._scrollView = scrollView; } }
				horizontal={true}
				showsHorizontalScrollIndicator={false}
				showsVerticalScrollIndicator={false}
				directionalLockEnabled={true}
				bounces={false}
				scrollsToTop={false}
				>
				<View
					style={[styles.tabs, { width: this.state._containerWidth, }, this.props.tabsContainerStyle,]}
					ref={'tabContainer'}
					onLayout={this.onTabContainerLayout}
					>
					{this.props.tabs.map((tab, i) => this.renderTabOption(tab, i))}
					<Animated.View style={[tabUnderlineStyle, dynamicTabUnderline,]} />
				</View>
			</ScrollView>
		</View>;
	},

	onTabContainerLayout(e) {
		this._tabContainerMeasurements = e.nativeEvent.layout;
		let width = this._tabContainerMeasurements.width;
		if (width < WINDOW_WIDTH) {
			width = WINDOW_WIDTH;
		}
		this.setState({ _containerWidth: width, });
		this.updateView({ value: this.props.scrollValue._value, });
	},

	onContainerLayout(e) {
		this._containerMeasurements = e.nativeEvent.layout;
		this.updateView({ value: this.props.scrollValue._value, });
	},
});

module.exports = ScrollableTabBar;

const styles = StyleSheet.create({
	container: {
		height: 50,
		borderWidth: 1,
		borderTopWidth: 0,
		borderLeftWidth: 0,
		borderRightWidth: 0,
		borderBottomColor: '#ccc',
	},
	tabs: {
		flexDirection: 'row',
		justifyContent: 'space-around',
	},
});
