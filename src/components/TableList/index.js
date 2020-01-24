import React from "react";
import PropTypes from "prop-types";

// 使用bootstrap的navs-pills来做布局
const TabList = ({ files, activeId, unsaveIds, onTabClick, onCloseTab }) => {
  return (
    <ul className="nav nav-pills">
      {files.map((file) => (
        <li className="nav-item" key={file.id}>
          <a href=" " className="nav-link">
            {file.title}
          </a>
        </li>
      ))}
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
