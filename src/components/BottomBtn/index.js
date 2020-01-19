import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PropTypes from "prop-types";

const BottomBtn = ({ text, colorClass, icon, onBtnClick }) => (
  <button onClick={onBtnClick} type="button" className={`btn btn-block no-border ${colorClass}`}>
    <FontAwesomeIcon className="mr-2" size="lg" icon={icon} />
    {text}
  </button>
);

BottomBtn.propTypes = {
    text: PropTypes.string,
    colorClass: PropTypes.string,
    // 注意icon这里必须
    icon: PropTypes.object.isRequired,
    onBtnClick: PropTypes.func
}

BottomBtn.defaultProps = {
    text:'新建'
}

export default BottomBtn;
