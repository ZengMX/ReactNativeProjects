import { Dimensions, PixelRatio } from 'react-native';
import Styles from 'future/public/lib/styles/Styles';
const styles = Styles.create({   
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
    splitLine: {
        backgroundColor: '#f0f0f0',
        height: 1 / PixelRatio.get(),
        width: SCREENWIDTH - 13,
        marginLeft: 13
    },
    zoneIdPress: {
        backgroundColor: '#fff',
        width: SCREENWIDTH,
        height: 50,
        paddingRight: 13,
        paddingLeft: 13,
        flexDirection:'row',
        alignItems: 'center',
    },
});
export default styles;