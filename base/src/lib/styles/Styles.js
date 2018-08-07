/**
 * 结合src/lib/initAPP/InitStyles.js中的EStyleSheet.build(ThemeDefault)
 * 封装 react-native-extended-EStyleSheet
 * 增加样式常用值属性：
 *    'layout': Layout,
 * 		'theme': ThemeDefault,
 *	
 * 使用方法：
 * import Styles from 'future/src/lib/styles/Styles';
 * 
 * 1.在定义样式文件中使用
 * const styles = Styles.create({
 * 	btn_confim: {
 * 		borderColor: '$NAVH',
		fontSize: '$font.f12'
 * 	},
 * 	container: {
 * 		position: 'absolute',
 * 		top: '$HEAD_HIGHT'
 * 	},
 * 	container2: {
 * 		position: 'absolute',
 * 		width: '20 * $IS'
 * 	}
 * })
 * 
 * 2.单独使用一个值
 * Styles.theme.MAIN_COLOR
 * 
*/
import EStyleSheet from 'react-native-extended-stylesheet';
import Layout from './Layout2';
import ThemeDefault from './ThemeDefault';

export default {
	create(obj) {
		return EStyleSheet.create(Object.assign({}, obj));
	},
	'layout': Layout,
	'theme': ThemeDefault,
};
