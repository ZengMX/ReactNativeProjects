import Styles from 'future/public/lib/styles/Styles';
import {
    PixelRatio,
    Dimensions
} from 'react-native';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
const styles = Styles.create({
    headImage: {
        width: screenWidth,
        height: 100,
        // backgroundColor: '#FF6600',
        flexDirection: 'column',
        justifyContent: 'center',
        paddingLeft: 25,
		backgroundColor: 'transparent'
    },
    address: {
        width: screenWidth,
        paddingHorizontal: 13,
        height: 134,
        backgroundColor: "#fff",
        flexDirection: 'column',
        paddingTop: 15,
    },
    phone: {
        width: screenWidth,
        height: 22,
        flexDirection: "row",
        alignItems: 'center',
        marginTop: 15
    },
    adressDe: {
        width: screenWidth,
        paddingRight: 13,
        height: 38,
        flexDirection: "row",
        marginTop: 15,
        flexWrap: 'wrap'
    },
    shopList: {
        width: screenWidth,
        paddingHorizontal: 13,
        height: 45,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    shopName: {
        width: screenWidth,
        paddingHorizontal: 13,
        height: 52.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FAFAFA'
    },
    sorceView: {
        width: screenWidth,
        paddingHorizontal: 13,
        height: 46.5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    line: {
        width: screenWidth - 26,
        height: 2 / PixelRatio.get(),
        backgroundColor: '#eee',
        marginLeft: 13
    },
    bottomView: {
        marginTop: 10,
        width: screenWidth,
        // height: 62,
        backgroundColor: '#fff',
        paddingVertical: 8
    },
    bottomItems: {
        width: screenWidth,
        height:27,
        paddingHorizontal: 13,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff'
    },
    confirm:{
        width:screenWidth,
        height:60,
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'flex-end',
        backgroundColor:'#fff',
        paddingRight:13
    },
    confirmView:{
        width:70,
        height:28,
        backgroundColor:'#fff',
        marginLeft:13,
        borderWidth:2/PixelRatio.get(),
        borderColor:'#0082FF',
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center'
    },
});
export default styles;

