/* Панель выбора полей фильтрации
 * Параметры:
 * label - подпись перед панелью
*/
import React, { PropTypes } from 'react';

const FilterPanel = (props, context) => {
  const { label, onFilterChange, css } = props;
  const { muiTheme } = context;
  const labelColor = {
    color: muiTheme.rawTheme.palette.accent3Color
  };
  return (
    <div className={css.block}>
      <span className={css.label} style={labelColor}>{label}</span>
      {React.Children.map(props.children, (child) => {
        return React.cloneElement(child, { onChange: onFilterChange });
      })}
    </div>
  );
};

FilterPanel.propTypes = {
  children: PropTypes.array,
  label: PropTypes.string,
  onFilterChange: PropTypes.func,
  css: PropTypes.object
};

FilterPanel.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

FilterPanel.defaultProps = {
  css: require('./filterPanel.scss')
};

export default FilterPanel;
