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
		marginLeft: 13,
		backgroundColor: '#eee',
		height: '$BW'
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
	logoutBtn: {
		width: '$W',
		height: 50,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff'
	},
	logoutText: {
		fontSize: 15,
		color: '#333'
	},
	arrowIcon: {
		width: 6, height: 11,
	}
});

export default styles;