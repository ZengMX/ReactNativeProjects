/* 一定要用下面这个组件写样式
	react-native-extended-stylesheet
	常量
  W: width,//屏幕宽度
  H: height,//屏幕高度
  BW: 1 / PixelRatio.get(),//边框宽度
  STATUS_HIGHT: Platform.OS == 'ios' ? 20 : 0,//状态栏高度
  NAVH: 44,//NavBar高度
  HEAD_HIGHT: '$STATUS_HIGHT + $NAVH',//状态栏 + NavBar的高度
  TABH: 50,//TabBar高度
  IS: width / 320.0,//图片缩放比例
  MAIN_COLOR: '#2fbdc8',//主色调
  font: {//项目对应的字体
    f11: 11,
    f12: 12
  },
  color: {//项目对应的颜色
    c1: '#666543',
    c333: '#333333'
  },
  bColor: {//项目对应的背景颜色
    main: '#f0f8f8'
  },
  context: {//内容距离屏幕边距
    b10: 10,
    b12: 12
  },
  line: {
    main: '#E1E1E1'
  }
*/
import Styles from 'future/src/lib/styles/Styles';

const styles = Styles.create({
  screen: {
    flex: 1,
    backgroundColor:'$bColor.main',
  },
  container: {
    flex: 1,
    marginHorizontal: '$context.b10+2',
  },
  content: {
    fontSize: '$font.f12', // 使用上面常量方法，引号内$开头
    color:'$color.c1',
  },
  button:{
    backgroundColor:'$MAIN_COLOR',
    marginTop:10,
  },
});

export default styles;