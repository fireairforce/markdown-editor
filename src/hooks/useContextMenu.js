import { useEffect, useRef } from "react";
const { remote } = window.require("electron");
const { Menu, MenuItem } = remote;

const useContextMenu = (itemArr, targetSelector, deps) => {
  let clickedElement = useRef(null);
  useEffect(() => {
    const menu = new Menu();
    itemArr.forEach((item) => {
      menu.append(new MenuItem(item));
    });
    const handleContextMenu = (e) => {
      // 通过这里来拿dom元素,只有当在filelist点的时候才弹出来
      if (document.querySelector(targetSelector).contains(e.target)) {
        clickedElement.current = e.target;
        // 在remote获取到当前页面的时候弹出子菜单
        menu.popup({ window: remote.getCurrentWindow() });
      }
    };
    window.addEventListener("contextmenu", handleContextMenu);
    return () => {
      window.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [deps]);
  return clickedElement;
};

export default useContextMenu;
