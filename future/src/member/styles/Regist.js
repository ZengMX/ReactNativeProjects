import Styles from 'future/public/lib/styles/Styles';
import {
    PixelRatio,
    Dimensions
} from 'react-native';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
const styles = Styles.create({
    inputView: {
        width: screenWidth - 50,
        height: 42,
        borderBottomWidth: 2 / PixelRatio.get(),
        borderColor: '#eee',
        marginTop: 25,
        flexDirection:"row",
        alignItems:'center'
    },
    textInput: {
        flex: 1,
        fontSize: 14,
        paddingLeft: 10,
        // height: 23,
    },
    check: {
        height: 18,
        marginTop: 25,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    regist: {
        height: 45,
        marginTop: 30,
        backgroundColor: '#E0E0E1',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2,
    },
    registSuccess: {
        width: 275,
        height: 390,
        backgroundColor: '#fff',
        position: 'absolute',
        top: (screenHeight - 390)/2,
        left: (screenWidth - 275)/2,
        flexDirection: 'column',
        borderRadius: 10,
        alignItems:'center'
    },
    registImageBg:{
        width: 275,
        height:155,
        alignItems:'center'
    },
    registIcon:{
        width: 54.5,
        height: 54.5,
        marginTop:21
    },
    registIconView:{
        marginTop:17.5,
        width:210,
        height:52,
        backgroundColor:"rgba(0,0,0,0)",
        flexWrap:'wrap'
    },
    centerView:{
        width:275,
        height:66,
        marginTop:30,
        flexDirection:'row',
        alignItems:'center',
        backgroundColor:'#fff',
        justifyContent:'space-around'
    },
    centerItem:{
        width:46,
        height:91,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    centerItemIcon:{
        width:35,
        height:35
    },
    perfect:{
        width:275 - 45,
        height:45,
        marginTop:33,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#FABE15'
    },
    backHome:{
        width:screenWidth - 90,
        height:45,
        marginTop:10,
        justifyContent:'center',
        alignItems:'center',
    },
    registBottomView:{
        marginTop:80,
        width:screenWidth,
        height:17,
        flexDirection:"row",
        alignItems:'center',
        justifyContent:'center',
    },
});
export default styles;
