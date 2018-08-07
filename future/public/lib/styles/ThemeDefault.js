// 常用样式表
import {
  Platform,
  Dimensions,
  PixelRatio
} from 'react-native';

let { height, width } = Dimensions.get('window');

export default theme = {
  W: width,//屏幕宽度
  H: height,//屏幕高度
  BW: 1 / PixelRatio.get(),//边框宽度
  STATUS_HIGHT: Platform.OS == 'ios' ? 20 : 0,//状态栏高度
  NAVH: 44,//NavBar高度
  HEAD_HIGHT: '$STATUS_HIGHT + $NAVH',//状态栏 + NavBar的高度
  TABH: 50,//TabBar高度
  IS: width / 320.0,//图片缩放比例
  MAIN_COLOR: '#f9f9f9',//主色调
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
}

