import React, { useState, useEffect, useRef } from "react";

const FileSearch = ({ title, onFileSearch }) => {
  const [inputActive, setInputActive] = useState(false);
  const [value, setValue] = useState("");
  let node = useRef(null);
  const closeSearch = (e) => {
    e.preventDefault();
    setInputActive(false);
    setValue("");
  };

  useEffect(() => {
    const handleInputEvent = (e) => {
      const { keyCode } = e;
      //   enter是13
      if (keyCode === 13 && inputActive) {
        onFileSearch(value);
        // esc 是 27
      } else if (keyCode === 27 && inputActive) {
        closeSearch(e);
      }
    };
    document.addEventListener("keyup", handleInputEvent);
    return () => {
      document.removeEventListener("keyup", handleInputEvent);
    };
  });

  useEffect(() => {
    if (inputActive) {
      node.current.focus();
    }
  }, [inputActive]);
  return (
    <div className="alert alert-primary">
      {!inputActive && (
        <div className="d-flex justify-content-between align-items-center">
          <span>{title}</span>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setInputActive(true)}
          >
            搜索
          </button>
        </div>
      )}
      {inputActive && (
        <div className="row">
          <input
            className="form-control col-8"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            ref={node}
          />
          <button
            type="button"
            className="btn btn-primary col-4"
            onClick={(e) => {
              closeSearch(e);
            }}
          >
            关闭
          </button>
        </div>
      )}
    </div>
  );
};

export default FileSearch;
