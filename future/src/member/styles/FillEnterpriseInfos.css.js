import { Dimensions, PixelRatio } from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const styles = Styles.create({
    splitLine: {
        backgroundColor: '#f0f0f0',
        height: 1 / PixelRatio.get(),
        width: SCREENWIDTH - 13,
        marginLeft: 13
    },
    contentItem: {
        backgroundColor: '#fff',
        width: SCREENWIDTH,
        height: 50,
        paddingRight: 13,
        paddingLeft: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },
    titleItem:{ 
        width: 84, 
        height: 22, 
        flexDirection: 'row', 
        alignItems: 'center', 
        backgroundColor: "#fff" 
    },
    titleTxt:{ 
        fontSize: 14, 
        color: '#AAAEB9', 
        paddingTop: 0, 
        paddingBottom: 0 
    },
    input: {
        width:SCREENWIDTH -  84 - 13 - 13,
        height:28,
        color: '#0C1828',
        fontSize: 14,
        marginLeft: 5,
        paddingRight:12,
        flexDirection:'row',
        alignItems:'center'
    },
    zoneIdPress: {
        marginTop:5,
        backgroundColor: '#fff',
        width: SCREENWIDTH,
        height: 50,
        paddingRight: 13,
        paddingLeft: 13,
        flexDirection:'row',
        alignItems: 'center',
    },
    allerts:{
        width: 270,
        height: 105,
        backgroundColor: '#00000000',
        position: 'absolute',
        top: (SCREENHEIGHT - 105)/2,
        left: (SCREENWIDTH - 270)/2,
    },
    alertContent:{
        width: 270,
        height: 105,
        backgroundColor: 'rgba(240,240,240,0.94)',
        borderRadius: 12,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    alertBott:{
        width: 270,
        height: 45,
        flexDirection: 'row',
        borderRadius: 12,
    },
});
export default styles;