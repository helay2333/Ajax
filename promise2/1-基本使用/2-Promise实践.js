const fs = require("fs");
//这是回调的形式
// fs.readFile("./resource/content.txt", (err, data) => {
//   if (err) throw err;
//   else {
//     console.log(data.toString());
//   }
// });

//使用Promise封装这个异步代码

const p = new Promise((resolve, reject) => {
  fs.readFile("./resource/content.txt", (err, data) => {
    if (err) reject(err);
    else {
      resolve(data);
    }
  });
});
p.then(
  (value) => {
    console.log(value.toString());
  },
  (reason) => {
    console.log(reason);
  }
);
