import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
	borderStyle: {
		borderBottomWidth: '$BW',
		borderBottomColor: '#e5e5e5'
	},
	section: {
		marginTop: 10,
	},
	sectionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		flex: 1,
		height: 53,
		paddingHorizontal: 13,
		backgroundColor: '#fff',
	},
	sectionTitle: {
		flex: 1,
		fontSize: 15,
		color: '#333'
	},
	line: {
		backgroundColor: '#eee',
		height: '$BW',
		marginLeft: 13
	},
	subTitle: {
		fontSize: 14,
		color: '#959fa7',
	},
	pr10: {
		paddingRight: 10
	},
	mb10: {
		marginBottom: 10
	},
	arrowIcon: {
		width: 6, height: 11,
	},
	headerImg: {
		width: 50, height: 50, marginRight: 10,
		borderRadius: 25
	},
	addrModal: {
		backgroundColor: '#fff'
	},
	modalTitleWrap: {
		height: 50, justifyContent: 'center', alignItems: 'center'
	},
	modalTitle: {
		fontSize: 16, fontWeight:'bold'
	},
	addrItem: {
		marginHorizontal: 13, 
		paddingVertical: 8, 
		borderBottomWidth: 0.5, 
		borderBottomColor: '#eee'
	},
	receiveMan: {
		fontSize: 16, color: '#333'
	},
	receiveAddr: {
		paddingVertical: 10, fontSize: 14, color: '#333',
		paddingRight: 30
	},
	noReceive: {
		height:50,justifyContent:'center',alignItems:'center'
	},
	closeBtn: {
		backgroundColor: '#34457d', 
		height: 45, justifyContent: 'center', 
		alignItems: 'center', marginTop: 20
	},
	closeText: {
		fontSize: 16, color: '#fff'
	}
});

export default styles;