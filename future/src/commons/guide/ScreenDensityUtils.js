import {
    Dimensions,
    Platform,
    PixelRatio
} from 'react-native';
var screenWidth = require('Dimensions').get('window').width;
var screenWidthPixel = screenWidth * PixelRatio.get(); //像素
var screenHeight = require('Dimensions').get('window').height;
var screenHeightPixel = screenHeight * PixelRatio.get(); //像素
function getDensityLeve() {
    console.log('像素 screenWidthPixel', screenWidthPixel);
    console.log('像素 screenHeightPixel', screenHeightPixel);
    if (Platform.OS == 'ios') {
        if (screenWidthPixel <= 640) {
            // console.log('i4 <= 640');
            return 'i4';
        } else if (screenWidthPixel > 640 && screenWidthPixel <= 750) {
           // console.log('i5 <= 750');
            return 'i5';
        } else if (screenWidthPixel > 750 && screenWidthPixel <= 1125) {
           // console.log('6PX <= 1125');
            return 'i6PX';
        } else {
            //console.log('i6P >1125');
            return 'i6P';
        }
    } else {
        if (screenWidthPixel <= 480) {
           // console.log('hdpi <= 480');
            return 'hdpi';
        } else if (screenWidthPixel > 480 && screenWidthPixel <= 720) {
            //console.log('xhdpi <= 720');
            return 'xhdpi';
        } else if (screenWidthPixel > 720 && screenWidthPixel <= 1080) {
           // console.log('xxhdpi <= 1080');
            return 'xxhdpi';
        } else {
            //console.log('xxxhdpi > 1080');
            return 'xxxhdpi';
        }
    }
}
function getPlatform() {
    if (Platform.OS == 'ios') {
        return 'ios';
    } else {
        return 'android';
    }
}
exports.getDensityLeve = getDensityLeve;
exports.getPlatform = getPlatform;
// new Fetch({
//     url: 'app/index/splash.json?platformCode=' + ScreenDensityUtils.getPlatform()
//     + '&densityCode=' + ScreenDensityUtils.getDensityLeve(),
//     method: 'GET',
// }).dofetch().then((data) => {
//     console.log('getSplash——————————>>>>>>>>>>>', data.result)
//     });
// 1：参数platform 值是ios或者android 
// 2：传递的参数density 如果是android就返回一下参数
// 参数hdpi  返回 480 x 800对应的图片uri
// 参数xhdpi  返回 720 x 1280对应的图片uri
// 参数xxhdpi  返回 1080 x 1920对应的图片uri
// 参数xxxhdpi  返回 1440 x 2560对应的图片uri
// density 如果是ios
// 参数i4  返回 640 x 1136 对应的图片uri
// 参数i5  返回 750 x 1334   对应的图片uri
// 参数i6PX  返回 1125 x 2001 对应的图片uri
// 参数i6P  返回 11242 x 2208 对应的图片uri
// 返回的数据
// 模拟后台数据
// const datas = {
//     "pagePics": [
//       {
//         "pagePicUrl": "http://www.jingyanbus.com/uploads/allimg/c160621/14B4K21T2E0-5LB4.jpg", //每个活动页的全屏背景图片
//         "isSpikActivityPage": "false", //是否跳过这个活动页
//         "spikPageParams": { //点击 每页的activityPosition活动按钮时候的要传到对应页面的参数
//           "productId": "44"
//         }
//       },
//       {
//         "pagePicUrl": "http://www.jingyanbus.com/uploads/allimg/c160621/14B4K21Z94Z-5X526.jpg",
//         "isSpikActivityPage": "false",
//         "spikPageParams": {
//           "productId": "43"
//         }
//       },
//       {
//         "pagePicUrl": "http://www.jingyanbus.com/uploads/allimg/c160621/14B4K2195F-5aA4.jpg",
//         "isSpikActivityPage": "true",
//         "spikPageParams": {
//           "productId": "42"
//         }
//       }
//     ],
//     "skipStyle": {    //跳过按钮的样式
//       "borderColor": "#ff0000",
//       "backgroundColor": "#676359",
//       "textColor": "#676359"
//     },
//     "activityPosition": {   //底部活动按钮的样式
//       "bottom": "10",
//       "left": "10",
//       "top": "0",
//       "right": "0",
//       "backgroundColor": "#f00",
//       "textColor": "#000"
//     },
//     "skipButtonUrl": "http://a1.img.3366.com/fileupload/img/upload/201404/20140429150022_1801.jpg",
//     "appSplashId": "1",  // 每个活动的id
//     "endDate": "1509120000000" //活动结束时间，结束了就不要再显示活动页了
//   }
