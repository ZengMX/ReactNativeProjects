import { Platform, PixelRatio, Dimensions } from 'react-native';
import Styles from 'future/src/lib/styles/Styles';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const drawerWidth = screenWidth - 65;

const styles = Styles.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f8f8'
  },
  screening: {
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightButtonView: {
    flexDirection: 'row',
    width: 60,
    alignItems: 'center'
  },
  rightButtonText: {
    color: '#fff',
    fontSize: 14,
    marginLeft: 5,
    maxWidth: 60,
    textAlign: 'center'
  },
  inputsBox: {
    flex: 1,
    height: 30,
    marginRight: 80,
    marginLeft: 40,
    paddingLeft: 5,
    backgroundColor: '#fff',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 0,
  },
  firstDrawer: {
    flex: 1,
    marginTop: IS_IOS ? 20 : STATUS_HIGHT,
    flexDirection: 'row'
  },
  firstDrawerLeft: {
    backgroundColor: 'transparent',
    width: 65,
  },
  firstDrawerRight: {
    backgroundColor: '#f0f8f8',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inDrawerButton: {
    marginTop: 10,
    height: 45,
    backgroundColor: 'rgb(48,185,195)',
    borderRadius: 5,
    paddingHorizontal: 5,
    justifyContent: 'center',
  },
  overlay: {
    position: 'absolute',
    top: '$STATUS_HIGHT',
    backgroundColor: 'rgba(0,0,0,0.2)',
    left: 0,
    right: 0,
    bottom: 0,
  },
})

export default styles;