import {
	Platform,
    PixelRatio
} from 'react-native';
import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
    tabItem:{
        flex: 1,
        width: SCREENWIDTH/3,
        height: 40,
        alignItems: 'center'
    },
    scrollTabBar:{
        height: 45,
        borderBottomWidth: 1 / PixelRatio.get(),
    },
    listStyle:{
        marginTop:5,
        backgroundColor:'#f9f9f9'
    }
});

export default styles;