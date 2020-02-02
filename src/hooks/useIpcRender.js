import { useEffect } from "react";
const { ipcRenderer } = window.require("electron");

// 传递进来的参数类似于obj
// const obj = {
//   "create-file": () => {},
// };

const useIpcRenderer = (keyCallbackMap) => {
  useEffect(() => {
    //   监听一个ipc事件
    Object.keys(keyCallbackMap).forEach((key) => {
        console.log(key);
      ipcRenderer.on(key, keyCallbackMap[key]);
    });
    // 移除事件
    return () => {
      Object.keys(keyCallbackMap).forEach((key) => {
        ipcRenderer.removeListener(key, keyCallbackMap[key]);
      });
    };
  });
};

export default useIpcRenderer;
