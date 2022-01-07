// webpack.congif.js  webpack的配置文件
// 作用就是指示webpack干哪些活(当你运行webpack指令的时候，会加载里面的配置)

//resolve用来拼接绝对路径的方法
const { resolve } = require("path");
module.exports = {
  //webpack配置
  //入口起点
  entry: "./src/index.js",
  //输出
  output: {
    //输出文件名
    filename: "built.js",
    //输出路径

    //__dirname nodejs变量,代表当前文件的目录绝对路径
    path: resolve(__dirname, "build"),
  },
  //loader配置
  module: {
    rules: [
      //详细的loader配置
      {
        //匹配的文件
        test: /\.css$/,
        user: [
          //user数组中的loder执行顺序是从右项左执行

          //创建style标签,将js中的样式资源插入添加到head中生效
          "style-loader",
          //将css文件变成commonjs模块js中，里面内容是样式字符串
          "css-loader",
        ],
      },
    ],
  },
  //plugins的配置
  plugins: [
    //详细的plugins配置
  ],
  //模式
  mode: "development", //开发模式
  //mode:'production'生产模式会压缩
};
