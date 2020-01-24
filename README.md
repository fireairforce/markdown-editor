## Introduction

一个基于`electron`和`react`开发的桌面端应用程序

样式库使用`bootstrap`来简化操作,图标库由`svg`来做的.

hooks目录下为一些自定义的hooks

使用`prop-types`来完成类型检测

使用`classnames`来完成`className`的属性拼接

## Notice
- 不要过度思考去选择项目目录，直接开干

electron 里面打开控制台调试应用程序的方法有:

```js
mainWindow.webContents.openDevTools()
```