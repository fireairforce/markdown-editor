import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

// 使用bootstrap的navs-pills来做布局
const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills">
      {files.map((file) => {
        const fClassName = classNames({
            'nav-link': true,
            'active': file.id === activeId
        })
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
              <span className="ml-2">
                  <FontAwesomeIcon 
                    icon={faTimes}
                  />
              </span>
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
};

export default TabList;
