# motdeditor
## 概要
  一个基于React/Draft.js/Bootstrap的，通过可视化预览和自动转换Unicode字符，提供Minecraft的样式代码的简便编辑体验的编辑器
## 什么是样式代码？
  server.properties中的motd、告示牌均使用的一种标记方式，用于标记字体样式
## 目前情况
   可用且暂未发现影响体验的bug。有bug（肯定会有）请积极issue
## 如何使用
   将build/里的index.html及关联的app.js、app.css、jQuery.js（具体文件见index.html）放在服务器上即可
   electron版会发布在release里
## TODO
  1. 支持多语言
  2. 实现样式代码到实时预览间的同步
  3. 实现随机文本的预览
