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
        paddingLeft: 25
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
    prdItemView:{ 
        backgroundColor: 
        "#f9f9f9", 
        paddingHorizontal: 13, 
        paddingVertical: 14
    },
    prdNmTxt:{ 
        fontSize: 14, 
        color: "#333333", 
        marginTop: 5 
    },
    secpView:{ 
        flexDirection: 'row', 
        justifyContent: 'space-between' 
    },
    secpTxt:{ 
        fontSize: 12, 
        color: "#8495A2", 
        marginTop: 9 
    },
    topViewInfoTitle:{
        fontSize: 15,
        marginTop: 6,
        color: "#53606a",
        fontWeight: "bold",
        paddingLeft: 13,
        paddingTop: 15
    },
    detailAddrTxt:{
        fontSize: 14,
        marginTop: 8,
        color: "#53606a",
        paddingLeft: 13,
        paddingBottom: 15
    },
    shopInfoView:{
        height: 40,
        backgroundColor: "#fff",
        paddingLeft: 10,
        justifyContent: "center"
    },
    shopInfoTelView:{
        width:SCREENWIDTH,
        marginTop: 10,
        height: 45,
        backgroundColor: "#fff",
        paddingLeft: 10,
        justifyContent: "space-between",
        flexDirection:'row',
        paddingHorizontal:13,
        alignItems:'center'
    },
    shopNmTxt:{
        fontSize:14,
        color:'#333',
        marginRight:5
    },
    shopName:{
        flexDirection:'row',
        alignItems:'center'
    },
    phoneImg:{},
    canceledBttomView:{
        height: 60,
        paddingHorizontal: 13,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    statView:{
        height: 50,
        paddingHorizontal: 10,
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        backgroundColor: "#fff"
    },
    buyAgainView:{
        width: 70,
        height: 28,
        borderRadius: 5,
        borderWidth: 1 / PixelRatio.get(),
        justifyContent: "center",
        alignItems: "center"
    },
    topStatBgImage:{ 
        width: screenWidth, 
        height: 100, 
        position: "absolute" 
    },
    topStatImg:{
        top: 13,
        right: 15,
        width: 130,
        height: 75,
        position: "absolute",
    },
    topStatTitle:{
        fontSize: 18,
        color: "#fff",
        backgroundColor: "transparent"
    },
    topCancelBtnView:{
        position:'absolute',
        top:55,
        right:13,
        flexDirection:'row',
        alignItems:'center'
    },
    topDetailTxt:{
        fontSize: 12,
        color: "#fff",
        backgroundColor: "transparent"
    },
    topEndedImg:{
        width: 55,
        height: 65,
        top: 20,
        position: "absolute",
        right: 50
    },
    amountDetailView:{
        backgroundColor: "#fff",
        marginTop: 10,
        paddingHorizontal: 13
    },
    itemAmountView:{
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10
    },
    itemSpaceView:{
        marginTop: 11,
        paddingHorizontal: 13,
        height: 1 / PixelRatio.get(),
        backgroundColor: "#e5e5e5"
    },
    payAmountView:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingTop: 20,
        paddingBottom: 10,
        alignItems: "center"
    },
    pointView:{
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 5
    },
    showAllView:{
        backgroundColor: "#fff",
        height: 40,
        justifyContent: "center",
        flexDirection: "row",
        alignItems: "center"
    },
    showAllViewTxt:{
        fontSize: 13,
        color: "#333",
        textAlign: "center"
    },
    packageTopView:{
        borderTopWidth: 1/PixelRatio.get(),
        borderTopColor:'#f9f9f9',
        width:SCREENWIDTH,
        height:45,
        flexDirection:'row',
        paddingLeft:13,
        alignItems:'center'
    },
    packageBtnsView:{
        width:SCREENWIDTH,
        height:48,
        paddingRight:13,
        backgroundColor:'#fff',
        justifyContent:'center',
        alignItems:'flex-end'
    }
});
export default styles;

