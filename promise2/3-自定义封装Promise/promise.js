function Promise(executor) {
  //添加属性
  this.PromiseState = "pending";
  this.PromiseResult = null;
  // 声明一个保存回调的变量
  this.callbacks = [];
  // 保存实例对象的this值
  const self = this;
  //resolve后面需要作为形参传递给执行器函数
  function resolve(data) {
    if (self.PromiseState !== "pending") return; //说明已经被改变了一次，加上之后就做到了Promise状态只会改变一次的特点
    //resolve可以改变对象状态和设置对象的结果值
    //1.改变状态
    self.PromiseState = "fulfilled";
    //   这里如果使用this的话就会造成不正确，因为这里的this是window
    self.PromiseResult = data;
    // 异步回调
    setTimeout(() => {
      // 调用成功的回调---->回调执行的地方是状态改变的时候
      self.callbacks.forEach((item) => {
        item.onResolved(data);
      });
    });
  }
  //reject需要作为形参传递给执行器函数
  function reject(data) {
    if (self.PromiseState !== "pending") return;
    //reject可以改变对象状态和设置对象的结果值
    self.PromiseState = "rejected";
    self.PromiseResult = data;
    setTimeout(() => {
      self.callbacks.forEach((item) => {
        item.onRejected(data);
      });
    });
  }
  //throw错误的时候调用这个
  try {
    //同步调用执行器函数
    executor(resolve, reject);
  } catch (e) {
    //修改Promise对象状态为失败
    reject(e); //e就是抛出的
  }
}

//添加then方法
// 这边是实参，
Promise.prototype.then = function (onResolved, onRejected) {
  if (typeof onRejected !== "function") {
    onRejected = (reason) => {
      throw reason;
    };
  }
  if (typeof onResolved !== "function") {
    onResolved = (value) => value;
    // value = >{return value}
  }

  return new Promise((resolve, reject) => {
    if (this.PromiseState === "fulfilled") {
      // 使其异步
      setTimeout(() => {
        try {
          // 获取回调函数的执行结果
          let result = onResolved(this.PromiseResult); //将this.PromiseResult传递给value
          //判断
          if (result instanceof Promise) {
            //如果是Promise对象
            result.then(
              (v) => {
                resolve(v);
              },
              (r) => {
                r;
              }
            );
          } else {
            // 结果状态变为成功
            resolve(result);
          }
        } catch {
          reject(e); //即使是抛出错误也可以接受
        }
      });
    }
    if (this.PromiseState === "rejected") {
      setTimeout(() => {
        try {
          // 获取回调函数的执行结果
          let result = onRejected(this.PromiseResult); //将this.PromiseResult传递给value
          //判断
          if (result instanceof Promise) {
            //如果是Promise对象
            result.then(
              (v) => {
                resolve(v);
              },
              (r) => {
                r;
              }
            );
          } else {
            // 结果状态变为成功
            resolve(result);
          }
        } catch {
          reject(e); //即使是抛出错误也可以接受
        }
      });
    }
    if (this.PromiseState === "pending") {
      //处理异步代码执行的时候的问题
      // 保存回调函数----->>在这里我们是还无法去处理回调函数的，状态未改变不可能执行回调
      // 所以采用保存回调函数的形式
      this.callbacks.push({
        onResolved: function () {
          try {
            // 执行成功的回调函数
            let result = onResolved(self.PromiseResult);
            // 判断
            if (result instanceof Promise) {
              result.then(
                (v) => {
                  resolve(v);
                },
                (r) => {
                  reject(r);
                }
              );
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        },
        onRejected: function () {
          try {
            // 执行成功的回调函数
            let result = onRejected(self.PromiseResult);
            // 判断
            if (result instanceof Promise) {
              result.then(
                (v) => {
                  resolve(v);
                },
                (r) => {
                  reject(r);
                }
              );
            } else {
              resolve(result);
            }
          } catch (e) {
            reject(e);
          }
        },
      });
    }
  });
};

// 添加catch
Promise.prototype.catch = function (onRejected) {
  return this.then(undefined, onRejected);
};

//添加resolve
Promise.resolve = function (value) {
  return new Promise((resolve, reject) => {
    if (value instanceof Promise) {
      value.then(
        (v) => {
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    } else {
      // 状态设置为成功
      resolve(value);
    }
  });
};

// 添加reject，不管传什么都是失败
Promise.reject = function (reason) {
  return new Promise((resolve, reject) => {
    reject(reason);
  });
};

// 封装all方法
Promise.all = function (promises) {
  return new Promise((resolve, reject) => {
    //由每一个状态决定
    let count = 0;
    let arr = [];
    for (let i = 0; i < promises.length; i++) {
      promises[i].then(
        (v) => {
          //得知对象的状态是成功的
          count++;
          // 存入数组中
          arr[i] = v;
          if (count === promises.length) {
            resolve(arr);
          }
        },
        (r) => {
          reject(r);
        }
      );
    }
  });
};

// race方法
Promise.race = function (promises) {
  return new Promise((resolve, reject) => {
    for (let i = 0; i < Promise.length; i++) {
      Promise[i].then(
        (v) => {
          // 修改返回对象的状态为成功
          resolve(v);
        },
        (r) => {
          reject(r);
        }
      );
    }
  });
};
