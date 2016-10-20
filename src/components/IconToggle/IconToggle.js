import React, {PropTypes} from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const IconToggle = (props) => {
  const {name, stateOnIcon, stateOffIcon, toggled, onChange} = props;
  const css = require('./iconToggle.scss');

  return (
    <RadioButtonGroup name={name} className={css.group} valueSelected={Number(toggled).toString()} labelPostion= "left" onChange={onChange}>
      <RadioButton
        value="0"
        className={css.radio}
        checkedIcon={stateOffIcon}
        uncheckedIcon={stateOffIcon} />
      <RadioButton
        value="1"
        className={css.radio}
        checkedIcon={stateOnIcon}
        uncheckedIcon={stateOnIcon} />
    </RadioButtonGroup>
  );
};

IconToggle.propTypes = {
  name: PropTypes.string.isRequired,
  stateOnIcon: PropTypes.object.isRequired,
  stateOffIcon: PropTypes.object.isRequired,
  toggled: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
};

IconToggle.defaultProps = {
  toggled: false
};

export default IconToggle;
