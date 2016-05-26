/* Toggle Switch для фильтра
 * Параметры:
 * style - стили
 * name - текст
 * checked - состояние
*/
import React, { PropTypes } from 'react';
import * as Colors from 'material-ui/styles/colors';

const FilterSwitch = (props, context) => {
  const { checked, name, style } = props;
  const { muiTheme } = context;
  const styles = {
    fontSize: 13,
    display: 'block',
    padding: '5px 10px',
    marginRight: 2,
    cursor: 'pointer',
    boxShadow: checked ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.12)' : 'none',
    color: checked ? muiTheme.rawTheme.palette.alternateTextColor : 'inherit',
    backgroundColor: checked ? Colors.purple700 : 'inherit',
    ...style
  };

  return (
    <span style={styles}>{name}</span>
  );
};

FilterSwitch.propTypes = {
  checked: PropTypes.bool,
  name: PropTypes.string,
  style: PropTypes.object
};

FilterSwitch.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default FilterSwitch;
