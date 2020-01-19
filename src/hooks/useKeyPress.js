import { useState, useEffect } from "react";

const useKeyPress = (targetKeyCode) => {
  const [keyPressed, setKeyPressed] = useState(false);
  // 键盘按下和拿起事件
  const keyDownHandler = ({ keyCode }) => {
    if (keyCode === targetKeyCode) {
      setKeyPressed(true);
    }
  };
  const keyUpHandler = ({ keyCode }) => {
    if (keyCode === targetKeyCode) {
      setKeyPressed(false);
    }
  };
  useEffect(() => {
    //   在useEffect里面对时间进行注册
    document.addEventListener("keydown", keyDownHandler);
    document.addEventListener("keyup", keyUpHandler);
    // 同时也要在组件卸载时卸除副作用影响
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
      document.removeEventListener("keyup", keyUpHandler);
    };
  }, []);
  return keyPressed;
};

export default useKeyPress;
