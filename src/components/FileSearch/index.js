import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../../hooks/useKeyPress";

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");
  //　enter键
  const enterPressed = useKeyPress(13);
  // esc键
  const escPressed = useKeyPress(27);
  let node = useRef(null);
  const closeSearch = () => {
    setInputActive(false);
    setValue("");
  };

  useEffect(() => {
    if(enterPressed && inputActive) {
      onFileSearch(value)
    } 
    if(escPressed && inputActive) {
      closeSearch()
    }
    // const handleInputEvent = (e) => {
    //   const { keyCode } = e;
    //   //   enter是13
    //   if (keyCode === 13 && inputActive) {
    //     onFileSearch(value);
    //     // esc 是 27
    //   } else if (keyCode === 27 && inputActive) {
    //     closeSearch(e);
    //   }
    // };
    // document.addEventListener("keyup", handleInputEvent);
    // return () => {
    //   document.removeEventListener("keyup", handleInputEvent);
    // };
  });

  useEffect(() => {
    if (inputActive) {
      // 每次进入搜索框自动获取到搜索框的焦点
      node.current.focus();
    }
  }, [inputActive]);
  return (
    <div className="alert alert-primary d-flex justify-content-between align-items-center mb-0">
      {!inputActive && (
        <>
          <span>{title}</span>
          <button
            type="button"
            className="icon-button"
            onClick={() => setInputActive(true)}
          >
            <FontAwesomeIcon title="搜索" icon={faSearch} size="lg" />
          </button>
        </>
      )}
      {inputActive && (
        <div className="d-flex justify-content-between align-items-center">
          <input
            className="form-control"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={node}
          />
          <button type="button" className="icon-button" onClick={closeSearch}>
            <FontAwesomeIcon title="关闭" icon={faTimes} size="lg" />
          </button>
        </div>
      )}
    </div>
  );
};

FileSearch.propTypes = {
  title: PropTypes.string,
  onFileSearch: PropTypes.func.isRequired
}

FileSearch.defaultProps = {
  title: "我的云文档",
};

export default FileSearch;
