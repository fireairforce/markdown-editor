import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "./index.scss";

// 使用bootstrap的navs-pills来做布局
const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills tablist-component">
      {files.map((file) => {
        const withUnsavedMark = unsaveIds.includes(file.id);
        const fClassName = classNames({
          "nav-link": true,
          active: file.id === activeId,
          "withUnsaved": withUnsavedMark 
        });
        return (
          <li className="nav-item" key={file.id}>
            <a
              onClick={(e) => {
                e.preventDefault();
                onTabClick(file.id);
              }}
              href=" "
              className={fClassName}
            >
              {file.title}
              <span
                className="ml-2 close-icon"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onCloseTab(file.id);
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </span>
              { withUnsavedMark && <span className="rounded-circle ml-2 unsaved-icon"></span> }
            </a>
          </li>
        );
      })}
    </ul>
  );
};

TabList.propTypes = {
  files: PropTypes.array,
  activeId: PropTypes.string,
  unsaveIds: PropTypes.array,
  onTabClick: PropTypes.func,
  onCloseTab: PropTypes.func,
};

TabList.defaultProps = {
  files: [],
  unsaveIds:[]
};

export default TabList;
