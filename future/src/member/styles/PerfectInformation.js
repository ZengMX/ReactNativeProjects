import Styles from 'future/public/lib/styles/Styles';
import {
    PixelRatio,
    Dimensions
} from 'react-native';
var screenWidth = Dimensions.get('window').width;
var screenHeight = Dimensions.get('window').height;
var lineItemWidth = (screenWidth - 10) / 6;
const styles = Styles.create({
    lineView: {
        width: screenWidth,
        height: 7,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    lineItem: {
        width: lineItemWidth,
        height: 7,
        backgroundColor: '#E0E9F2'
    },
    marTop: {
        width: screenWidth,
        height: 18,
        backgroundColor: "#fff"
    },
    ItemsView: {
        width: screenWidth,
        height: 54,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: "#fff",
        paddingLeft: 13,
        borderBottomWidth: 2 / PixelRatio.get(),
        borderColor: '#eee'
    },
    textInput: {
        flex: 1,
        height: 53,
        marginRight: 12,
    },
    rentZone: {
        width: screenWidth,
        height: 53,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#fff",
        marginTop: 10,
        paddingHorizontal: 13,
        borderBottomWidth: 2 / PixelRatio.get(),
        borderColor: '#eee'
    },
    regAddr: {
        width: screenWidth,
        height: 125,
        backgroundColor: "#fff"
    },
    regAddrTextInput: {
        width: screenWidth,
        height: 125,
        backgroundColor: "#fff",
        padding: 13,
        color: '#AAAEB9',
        fontSize: 14,
        textAlignVertical: 'top'
    },

    buttomView: {
        width: screenWidth - 30,
        height: 45,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 2,
        backgroundColor: '#E0E0E1',
        marginBottom: 10,
        marginLeft: 15
    },
    uploadView: {
        width: screenWidth,
        height: 90,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff'
    },
    spaceView: {
        width: screenWidth,
        height: 53,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: "#fff",
        paddingHorizontal: 13,
        borderBottomWidth: 2 / PixelRatio.get(),
        borderColor: '#eee'
    },
    step6input: {
        flex: 1,
        height: 53,
        marginRight: 12,
        fontSize: 15,
        color: '#0C1828',
    },
    invoiceType: {
        width: 90,
        height: 30,
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderWidth: 2 / PixelRatio.get(),
        borderRadius: 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    completeView: {
        width: screenWidth,
        height: 290,
        flexDirection: "column",
        alignItems: 'center',
    },
    completeTop: {
        width: screenWidth,
        height: 15,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 33
    },
    businessRanges: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'flex-end',
        flexDirection: 'column'
    },
    brHead: {
        width: screenWidth,
        height: 64,
    },
    brHeadCon: {
        width: screenWidth,
        height: 44,
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        borderBottomWidth: 2 / PixelRatio.get(),
        borderColor: '#eee'
    },
    brComfir: {
        width: screenWidth,
        height: 65,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopWidth: 2 / PixelRatio.get(),
        borderColor: '#eee'
    },
    brComfirView: {
        width: screenWidth - 30,
        height: 45,
        backgroundColor: "#435990",
        justifyContent: 'center',
        alignItems: 'center'
    },
    brContent: {
        flex: 1,
        backgroundColor: '#f7f7f7',
        paddingLeft: 15,
        flexDirection: "column",
        paddingTop: 20
    },
    brItemsView: {
        width: (screenWidth - 30 - 10 - 10) / 3,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2 / PixelRatio.get(),
        borderColor: '#eee',
        backgroundColor: '#fff',
        marginTop: 10,
        marginRight: 10
    },
});
export default styles;

