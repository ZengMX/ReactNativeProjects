import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
	infoWrap: {
		paddingHorizontal: 25
	},
	item: {
		height: 56, 
		paddingTop: 5, 
		flexDirection: 'row', 
		alignItems: 'center',
		borderBottomColor: '#b1b1b6',
		borderBottomWidth: '$BW'
	},
	inputStyle: {
		flex: 1,  
		fontSize: 15, 
		color: '#0c1828',
		marginRight: 15,
	},
	otherItem: {
		height: 61,
		paddingTop: 10
	},
	settingMode: {
		paddingRight: 10, height: 40, justifyContent: 'center'
	},
	settingImg: {
		width: 22, height: 4
	},
	btn: {
		backgroundColor: '#e0e0e1',
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center'
	},
	btnText: {
		color: '#bfbfbf'
	},
	btnAct: {
		backgroundColor: '#34457d'
	},
	btnTextAct: {
		color: '#fff'
	},
	codeBtnSize: {
		width: 85,
		height: 30,
		marginRight: 5
	},
	codeBtnTextSize: {
		fontSize: 13,
	},
	submitBtnSize: {
		height: 45,
		marginTop: 30
	},
	submitBtnTextSize: {
		fontSize: 16
	},

	setModeModal: {
		width: 190,
		backgroundColor: 'rgba(255,255,255,0)',
		position: 'absolute',
		right: 14,
		alignItems: 'flex-end',
		flexDirection: 'column',
	},
	sanjiao: {
		width: 23,
		height: 11,
		backgroundColor: 'rgba(255,255,255,0)',
		marginRight: 20
	},
	setModeWrap: {
		width: 190,
		backgroundColor: '#fff',
		borderRadius: 3,
		paddingLeft: 10,
		marginTop: -1
	},
	modeItem: {
		height: 50,
		flexDirection: 'row',
		alignItems: 'center',
		paddingLeft: 5
	},
	border: {
		borderBottomColor: '#e5e5e5',
		borderBottomWidth: '$BW'
	},
	modeItemText: {
		fontSize: 15, 
		color: '#333'
	},
	correctImg: {
		width: 19, 
		height: 16, 
		position: 'absolute', 
		top: 27, 
		left: 70
	}
});

export default styles;