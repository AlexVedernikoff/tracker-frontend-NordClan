/* Toggle Switch для фильтра
 * Параметры:
 * style - стили
 * checked - состояние
 * touchTapHandler - хэндлер клика
*/
import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/FlatButton/FlatButton';

const FilterSwitch = (props, context) => {
  const { checked, label, value, onChange } = props;
  const { muiTheme } = context;
  const styles = {
    switch: {
      minWidth: 'auto',
      height: '26px',
      lineHeight: '26px',
      padding: 0,
      marginRight: 2,
      boxShadow: checked ? '0 1px 3px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.12)' : 'none',
      color: checked ? muiTheme.rawTheme.palette.alternateTextColor : 'inherit',
      backgroundColor: checked ? muiTheme.baseTheme.palette.primary1Color : 'inherit'
    },
    label: {
      paddingLeft: 12,
      paddingRight: 12,
      fontSize: 13,
      fontWeight: 'inherit',
      textTransform: 'none'
    }
  };

  const touchTapHandler = () => {
    onChange(value);
  };

  return (
    <FlatButton label={label} style={styles.switch} labelStyle={styles.label} onTouchTap={touchTapHandler} />
  );
};

FilterSwitch.defaultProps = {
  checked: false
};

FilterSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func
};

FilterSwitch.contextTypes = {
  muiTheme: PropTypes.object.isRequired
};

export default FilterSwitch;
