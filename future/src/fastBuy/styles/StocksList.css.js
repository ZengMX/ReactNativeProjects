import Styles from 'future/public/lib/styles/Styles';
import { PixelRatio } from 'react-native';
var SCREEN_WIDTH = require('Dimensions').get('window').width;
export default styles = Styles.create({
    container: {
        flex:1,
        backgroundColor:'#f0f0f0'
    },
    bottomMenueContainer:{
        width:SCREEN_WIDTH,
        height:50,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center'
    },
    allSelectBtn:{
        width:40,
        height:50,
        justifyContent:'center'
    },
    allSelectImg:{
        width: 16, 
        height: 16, 
        marginLeft:15
    },
    allSelect:{
        fontSize:14,
        color:'#333'
    },
    stocksListInfo:{
        flex:1,
        height:50,
        paddingRight:9
    },
    stocksListTotal:{
        marginLeft:14,
        fontSize:13,
        color:'#333',
        marginTop:8
    },
    stocksListTotalPrice:{
        
        fontSize:13,
        color:'#FF6600'
    },
    favourable:{
        marginLeft:14,
        fontSize:10,
        color:'#666',
        marginTop:6
    },
    settleBtn:{
        width:110,
        height:50,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#34457D'
    },
    settleBtnTitle:{
        color:'#fff',
        fontSize:16
    },
    cashOnDelivery:{
        alignItems:'center',
        width:68,
        height:50,
        justifyContent:'center'
    },
    menuImg:{
        width:20,
        height:15,
    },
    menuTxt:{
        color:'#333',
        fontSize:10,
        marginTop:4
    }
});