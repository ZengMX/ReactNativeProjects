import Styles from 'future/public/lib/styles/Styles';
import {
	PixelRatio,
	Image,
	StyleSheet,
	Platform,	
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenHeight = require('Dimensions').get('window').height;

const styles = Styles.create({
    header:{
        height:65,
        flex:1,
        justifyContent:'center',
        alignItems:'center'
    },
    headerContainer:{
        height:45,
        backgroundColor:'#fff',
        width:screenWidth-24,
        justifyContent:'center'
    },
    headerTitle:{
        marginLeft:10,
        color:'#333',
        fontSize:14
    },
    points:{
        fontSize:17
    }
});
export default styles;