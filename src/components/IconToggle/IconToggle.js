import React, {PropTypes} from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

const IconToggle = (props) => {
  const {name, stateOnIcon, stateOffIcon, toggled} = props;

  const styles = {
    group: {
      position: 'absolute',
      display: 'block',
      width: 112,
      top: 13,
      right: 8
    },
    radio: {
      float: 'right',
      width: 'auto',
      marginLeft: 16
    },
    icon: {
    }
  };

  return (
    <RadioButtonGroup name={name} style={styles.group} valueSelected={Number(toggled).toString()} labelPostion= "left" >
      <RadioButton
        value="1"
        style={styles.radio}
        iconStyle={styles.icon}
        checkedIcon={stateOnIcon}
        uncheckedIcon={stateOnIcon}
      />
      <RadioButton
        value="0"
        style={styles.radio}
        iconStyle={styles.icon}
        checkedIcon={stateOffIcon}
        uncheckedIcon={stateOffIcon}
      />
    </RadioButtonGroup>
  );
};

IconToggle.propTypes = {
  name: PropTypes.string.isRequired,
  stateOnIcon: PropTypes.object.isRequired,
  stateOffIcon: PropTypes.object.isRequired,
  toggled: PropTypes.bool.isRequired
};

IconToggle.defaultProps = {
  toggled: false
};

export default IconToggle;
