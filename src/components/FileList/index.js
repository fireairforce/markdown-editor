import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faMarkdown } from "@fortawesome/free-brands-svg-icons";
import PropTypes from "prop-types";
import useKeyPress from "../../hooks/useKeyPress";
import useContextMenu from "../../hooks/useContextMenu";
import { getParentNode } from "../../utils/helper";

const FileList = ({ files, onFileClick, onSaveEdit, onFileDelete }) => {
  const [editStatus, setEditStatus] = useState(false);
  const [value, setValue] = useState("");
  //　enter键
  const enterPressed = useKeyPress(13);
  // esc键
  const escPressed = useKeyPress(27);
  // 多次渲染的时候保持引用功能
  let node = useRef(null);
  const closeSearch = (editItem) => {
    setEditStatus(false);
    setValue("");
    if (editItem.isNew) {
      onFileDelete(editItem.id);
    }
  };

  const clickItem = useContextMenu(
    [
      {
        label: "打开",
        click: () => {
          const parentElement = getParentNode(clickItem.current, "file-item");
          onFileClick(parentElement.dataset.id);
        },
      },
      {
        label: "重命名",
        click: () => {
          const parentElement = getParentNode(clickItem.current, "file-item");
          setEditStatus(parentElement.dataset.id);
          setValue(parentElement.dataset.title);
        },
      },
      {
        label: "删除",
        click: () => {
          const parentElement = getParentNode(clickItem.current, "file-item");
          onFileDelete(parentElement.dataset.id);
        },
      },
    ],
    ".file-list",
    [files],
  );

  useEffect(() => {
    const editItem = files.find((file) => file.id === editStatus);
    if (enterPressed && editStatus && value.trim() !== "") {
      onSaveEdit(editItem.id, value, editItem.isNew);
      setEditStatus(false);
      setValue("");
    }
    if (escPressed && editStatus) {
      closeSearch(editItem);
    }
  });

  useEffect(() => {
    const newFile = files.find((file) => file.isNew);
    if (newFile) {
      setEditStatus(newFile.id);
      setValue(newFile.title);
    }
  }, [files]);

  useEffect(() => {
    if (editStatus) {
      node.current.focus();
    }
  }, [editStatus]);

  return (
    <ul className="list-group list-group-flush file-list">
      {files.map((file) => (
        <li
          className="mx-0 row list-group-item bg-light d-flex align-items-center file-item"
          key={file.id}
          // 使用data-id来存储一些信息
          data-id={file.id}
          data-title={file.title}
        >
          {file.id !== editStatus && !file.isNew && (
            <>
              <span className="col-2">
                <FontAwesomeIcon size="lg" icon={faMarkdown} />
              </span>
              <span
                className="col-6 c-link"
                onClick={() => {
                  onFileClick(file.id);
                }}
              >
                {file.title}
              </span>
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => {
                  setEditStatus(file.id);
                  setValue(file.title);
                }}
              >
                <FontAwesomeIcon title="编辑" size="lg" icon={faEdit} />
              </button>
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => {
                  onFileDelete(file.id);
                }}
              >
                <FontAwesomeIcon title="删除" size="lg" icon={faTrash} />
              </button>
            </>
          )}
          {(file.id === editStatus || file.isNew) && (
            <>
              <input
                className="form-control col-10"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                ref={node}
                placeholder="请输入文件名称"
              />
              <button
                type="button"
                className="icon-button col-2"
                onClick={() => {
                  closeSearch(file);
                }}
              >
                <FontAwesomeIcon title="关闭" icon={faTimes} size="lg" />
              </button>
            </>
          )}
        </li>
      ))}
    </ul>
  );
};

FileList.propTypes = {
  files: PropTypes.array,
  onFileClick: PropTypes.func,
  onFileDelete: PropTypes.func,
  onSaveEdit: PropTypes.func,
};

export default FileList;
