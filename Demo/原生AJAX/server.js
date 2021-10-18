//引用express
const express = require("express");

//创建应用对象
const app = express();

//创建路由规则
//request 是对请求报文的封装
//response 是对响应报文的封装
app.get("/server", (request, response) => {
  //设置响应头,设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  //设置响应体
  response.send("HELLO EXPRESS");
});
// app.post("/server", (request, response) => {
//   //设置响应头,设置允许跨域
//   response.setHeader("Access-Control-Allow-Origin", "*");
//   //设置响应体
//   response.send("HELLO AJAX POSt");
// });
app.all("/json-server", (request, response) => {
  //设置响应头,设置允许跨域
  response.setHeader("Access-Control-Allow-Origin", "*");
  //响应头
  response.setHeader("Access-Control-Allow-Headers", "*");

  //响应一个数据
  const data = {
    name: "aaaa",
  };
  //response.send()中必须放一个字符串或者buffer
  //那么我们如果想要传递数据data就要对对象进行字符串转换
  let str = JSON.stringify(data);
  //设置响应体
  response.send(str);
});
app.listen(8000, () => {
  console.log("服务已启动，8000端口监视中");
});
