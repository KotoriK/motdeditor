# motdeditor
##概要
一个基于React/Draft.js/Bootstrap的，通过可视化预览和自动转换Unicode字符，提供Minecraft的样式代码的简便编辑体验的编辑器
##什么是样式代码？
  server.properties中的motd、告示牌均使用的一种标记方式，用于标记字体样式
##目前情况
   可用且暂未发现影响体验的bug。有bug（肯定会有）请积极issue
   目前只能放到web服务器上使用，未来增加本地版（electron）
##如何使用
   将dist/里的index.html及关联的app.js和app.css（具体文件吗见index.html）放在服务器上即可
##TODO
  1. 打包成electron应用
  2. 支持多语言
  3. 实现样式代码到实时预览间的同步
  4.实现随机文本的预览
