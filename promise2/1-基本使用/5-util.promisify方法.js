// 引入util
const util = require("util");
// 引入fs
const fs = require("fs");
let mineReadFile = util.promisify(fs.readFile); //将回调形式函数作为参数，最终由promisify返沪一个promise形式的函数
mineReadFile("./resource/content.txt").then((value) => {
  console.log(value);
});
