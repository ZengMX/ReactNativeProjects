import Styles from 'future/public/lib/styles/Styles';
import {
    PixelRatio,
    Dimensions
} from 'react-native';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
const styles = Styles.create({
    way: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginTop: 20,
        marginHorizontal: 25,
        alignItems: 'center',
        borderBottomWidth: 2 / PixelRatio.get(),
        borderColor: '#eee'
    },
    selectWay: {
        width: 22,
        height: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 45,
        flex: 1,
        fontSize: 14,
        paddingLeft: 10,
        marginRight:10,
    },
    verification: {
        width: 85,
        height: 30,
        backgroundColor: '#34457D',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
    reSet: {
        marginTop:30,
        width: screenWidth - 50,
        marginHorizontal:25,
        height: 45,
        backgroundColor: '#34457D',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 2
    },
});
export default styles;
