## Introduction

一个基于`electron`和`react`开发的桌面端应用程序

样式库使用`bootstrap`来简化操作,图标库由`svg`来做的.

hooks 目录下为一些自定义的 hooks

使用`prop-types`来完成类型检测

使用`classnames`来完成`className`的属性拼接

根据文档可以为`cra`添加`sass`文件的的解析功能

使用`uuid`提供创建文件时的唯一 id 值

`flattern state`:使用索引值，来把对象打平来设计一个效率更高的`state`

如果要使用`electron`里面的`node`模块，按照下面方法引用即可:

```js
const fs = window.require("fs");
```

### makrkown 库的选择

- 支持预览模式
- 支持高亮显示不同的内容
- 自定义工具栏

选用[esaymde](https://github.com/Ionaru/easy-markdown-editor) 来作为本次开发的`md`文本编辑器。

当然这个库有`react`版本的，因此可以直接考虑去使用`react`提供的:
[react-simplemde-editor](https://github.com/RIP21/react-simplemde-editor)

### state 设计原则

- 最小化(应用的最小可变状态集)
- 不要重复
- 有些数据可以根据已有的`State`计算出来
- 使用多个`State`变量

### 持久化保存数据(解决方案)

- 数据库软件的方案
- 浏览器相关的解决方案
- 使用`Electron Strore`(文件保存方式)

这里使用`electron store`来提供解决方案
地址:https://github.com/sindresorhus/electron-store

```js
const Store = window.require("electron-store");

const store = new Store();
store.set("name", "zoomdong");

console.log(store.get("name"));
```

### 导入文件

使用`dialog`模块来完成导入的功能。

[文档地址](https://www.electronjs.org/docs/api/dialog#dialogshowerrorboxtitle-content)

这里可以直接在`app.js`里面使用`remote.dialog.showDialog()`来打开对话框。

### html5-custom-data

适应 html5 里面的`data-*`属性来使用 dom 获取到对应节点的一些信息。(具体代码参考`filelist`获取子菜单那部分代码，然后用 useRef 去保存一个 dom 节点值)

## 菜单

- 原生应用菜单(就是电脑上面的`tab`栏目)
- 上下文菜单(点击右键弹出来的菜单)

[文档地址](https://www.electronjs.org/docs/api/menu-item#menuitemmenu)

### 应用菜单

代码位于`menuTemplate.js`目录下面,可以参考官网的模板去进行一个修改。利用`shell`模块进行开发。这里的`menu`使用的是主进程里面的事件(使用`ipcrenderer`来完成快捷键事件的绑定以及添加)。

### 弹出窗口替代路由模式
一些新的配置窗口使用`electron`的弹出窗口(`渲染进程`)来完成，而不去使用`react-router-dom`去做，这样可以使其更简单。

- 不用增加复杂度，相对独立(同样使用`ipcrenderer`来使用)
- 配置相对简单，不需要使用框架
- 使用原生的`js`进行开发

## Notice

- 不要过度思考去选择项目目录，直接开干

electron 里面打开控制台调试应用程序的方法有:

```js
mainWindow.webContents.openDevTools();
```
