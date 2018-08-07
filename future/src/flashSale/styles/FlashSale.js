import Styles from 'future/public/lib/styles/Styles';
import { PixelRatio } from 'react-native';
var fullWidth = require('Dimensions').get('window').width;
export default styles = Styles.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#f0f8f8'
  },
  listViewStyle:{        
    flexDirection:'row', //设置横向布局       
    flexWrap:'wrap'    //设置换行显示
  }, 
  tabItem:{
    flex: 1,
    width: 150,
    height: 40,
    alignItems: 'center'
  },
  //activityItem
  activityItem: {
    // width: 290,
    height: 164 * fullWidth / 320,
    marginTop: 10,
    marginHorizontal: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  activityImageView: {
    backgroundColor:'#fff',
    marginTop:10,
    width:fullWidth,
    height:27*fullWidth/64+10,
  },
  activityImage: {
    width:fullWidth,
    height:27*fullWidth/64,
  },
  navRightBtn:{
    width:44,
    height:44,
    justifyContent:'center',
    alignItems:'center'
  },
  scrollTabBar:{
    height: 45,
    borderBottomWidth: 1 / PixelRatio.get(),
  },
  leftListItemBottom:{
    backgroundColor:'#fff',
    width:fullWidth,
    height:35,
    flexDirection:"row",
    alignItems:'center',
    justifyContent: 'space-between'
  },
  leftListItemBottom_info:{
    flexDirection:"row",
    alignItems:'center',
  },
  leftListItemBottom_dic:{
    marginLeft:13,
    color:'#FF6600',
    fontSize:15
  },
  leftListItemBottom_Nm:{
    marginLeft:8,
    color:'#4B5963',
    fontSize:15
  },
  leftListItemBottom_leftTime:{
    marginRight:13,
    color:'#9E9EAF',
    fontSize:13
  },
  listStyle:{
    backgroundColor:'#f9f9f9'
  }
})

