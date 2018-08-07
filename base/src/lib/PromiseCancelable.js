/** 
* 使Promise变成可以取消的
使用方法
    //获取已登录的用户名和手机信息
    this.getLastLoginedName = PromiseCancelable(StorageUtils.readInfo('username'));
    this.getLastLoginedName.promise.then((result) => {
      this.setState({
        username: result.data,
      });
    }, (error) => {
      console.log('已登录的用户名获取失败', error);
    });

    //取消获取最近一次成功登录的用户名操作
    this.getLastLoginedName.cancel();
**/

export default function PromiseCancelable(promise) {
  let hasCanceled_ = false;
  const wrappedPromise = new Promise((resolve, reject) => {
    promise.then((val) =>
      hasCanceled_ ? reject({ isCanceled: true }) : resolve(val)
    );
    promise.catch((error) =>
      hasCanceled_ ? reject({ isCanceled: true }) : reject(error)
    );
  });

  return {
    promise: wrappedPromise,
    cancel() {
      hasCanceled_ = true;
      // console.log('promise取消了');
    },
  };
}