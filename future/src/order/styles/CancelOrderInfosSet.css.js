import Styles from 'future/public/lib/styles/Styles';
import {
    PixelRatio,
    Platform,
    Dimensions
} from 'react-native';

const styles = Styles.create({
    introduce:{
        width:SCREENWIDTH,
        height:129,
        backgroundColor:'#fff'
    },
    introduceTitle:{
        fontSize:14,
        color:'#0C1828',
        marginTop:15,
        marginLeft:13
    },
    introduceTxt:{
        fontSize:13,
        color:'#55697C',
        marginTop:5,
        marginLeft:13
    },
    splitLine:{
        marginTop:12,
        backgroundColor: '#f0f0f0',
        height: 1 / PixelRatio.get(),
        width: SCREENWIDTH - 13,
        marginLeft: 13
    },
    reasonContent:{
        flex:1,
        backgroundColor:'#fff',
        marginTop:5
    },
    reasonContentView:{
        alignItems:'center',
        width:SCREENWIDTH,
    },
    reasonContentTitle:{
        marginTop:12,
        marginLeft:13,
        fontSize:15,
        color:'#0C1828'
    },
    reasonContentItemTitle:{
        fontSize:15,
        color:'#0C1828'
    },
    reasonItemImg:{
        width:15,
        height:15
    },
    reasonItem:{
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center',
        width:SCREENWIDTH-26,
        height:53
    },
    bottomView:{
        width:SCREENWIDTH,
        height:65,
        alignItems:'center',
        justifyContent:'center'
    },
    nextBtnAble:{
        width:SCREENWIDTH-30,
        height:45,
        backgroundColor:'#34457D',
        justifyContent: 'center',
        alignItems:'center'
    },
    nextBtnUnable:{
        width:SCREENWIDTH-30,
        height:45,
        backgroundColor:'#e0e0e1',
        justifyContent: 'center',
        alignItems:'center'
    },
    nextBtnTxtUnable:{
        fontSize:16,
        color:'#BFBFBF'
    },
    nextBtnTxtAble:{
        fontSize:16,
        color:'#fff'
    },
    topView:{
        width:SCREENWIDTH,
        height:120,
        backgroundColor:'#34457D'
    },
    amountTitle:{
        fontSize:13,
        color:'#AAAEB9',
        marginTop:25,
        marginLeft:13
    },
    amountTxt:{
        marginTop:Platform.OS=='ios'?10:0,
        fontSize:48,
        color:'#fff',
        marginLeft:13
    },
    buyerViews:{
        width:SCREENWIDTH,
        height:53,
        backgroundColor:'#fff',
        flexDirection:'row',
        alignItems:'center'
    },
    buyerTitle:{
        marginLeft:13,
        fontSize:15,
        color:'#AAAEB9'
    },
    buyerTxt:{
        fontSize:15,
        color:'#0C1828'
    }
})

export default styles;