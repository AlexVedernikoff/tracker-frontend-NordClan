import React from 'react';
import PropTypes from 'prop-types';
import * as css from './ProjectIcon.scss';

const ProjectIcon = props => {
  const name = props.projectName;
  const prefix = props.projectPrefix;
  const hexToLuma = hex => {
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    return [0.299 * r, 0.587 * g, 0.114 * b].reduce((a, с) => a + с) / 255;
  };

  const backColor = parseInt(
    btoa(encodeURI(name))
      .toLowerCase()
      .replace(/[^a-z0-9]/, ''),
    36
  )
    .toString(16)
    .substr(0, 6);

  const fontColor = hexToLuma(backColor) > 0.5 ? '#333' : '#fafafa';
  const divStyle = {
    backgroundColor: `#${backColor}`,
    color: fontColor
  };

  return (
    <div className={css.projectIcon} style={divStyle}>
      <span>
        {
          prefix
          .slice(0, 2)
          .toUpperCase()
        }
      </span>
    </div>
  );
};

ProjectIcon.propTypes = {
  projectName: PropTypes.string,
  projectPrefix: PropTypes.string
};

export default ProjectIcon;
