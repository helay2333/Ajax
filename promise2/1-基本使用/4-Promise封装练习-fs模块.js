// 封装一个函数mineReadFile读取文件内容
// 参数:path文件路径
// 返回:Promise对象
// 成功的结果是文件内容，失败就是失败那个对象
function mineReafFile(path) {
  return new Promise((resolve, reject) => {
    //读取文件
    require("fs").readFile(path, (err, data) => {
      if (err) reject(err);
      //成功
      resolve(data);
    });
  });
}

mineReafFile("./resource/content.txt").then(
  (value) => {
    // 输出文件内容，buffer----使用toString()转汉字
    console.log(value.toString());
  },
  (reason) => {
    //   输出错误
    console.log(reason);
  }
);
