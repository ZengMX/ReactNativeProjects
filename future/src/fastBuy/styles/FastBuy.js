import Styles from 'future/public/lib/styles/Styles';

const styles = Styles.create({
  // 弹层样式
  modal: {
    width: '$W',
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
	paddingVertical: 41
  },
  modalBox: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalNumBox: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalNum: {
    color: '#fff',
    fontSize: 30,
  },
  modalTitle: {
    marginTop: 15,
    fontSize: 14,
    color: '#272D34'
  },
  modalExplain: {
    marginTop: 11,
    fontSize: 11,
    color: '#AAAEB9',
    width: 108,
  },
  modalBtn: {
    borderWidth: '$BW',
    justifyContent: 'center',
    borderRadius: 20,
    width: 90,
    height: 30,
    marginTop: 25,
  },
  modalBtnTitle: {
    fontSize: 13,
    textAlign: 'center'
  },
  modalClose: {
    position: "absolute",
    width: 50,
    height: 50,
    top: 0,
    right: 0,
    justifyContent: "flex-start",
    alignItems: 'flex-end',
  },
  modalCloseImg: {
    width: 40,
    height: 40,
  },
});

export default styles;
