import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Checkbox.scss';
import { IconCheck } from '../Icons';

class Checkbox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isChecked: this.props.checked
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.checked !== this.props.checked) {
      this.setState({
        isChecked: this.props.checked
      });
    }
  }

  handleOnChange = event => {
    event.persist();
    const { onChange } = this.props;
    if (onChange) {
      this.setState(
        {
          isChecked: !this.state.isChecked
        }
        // Необходимо проверить необходимость ручного вызова колбека, есть ли в этом необходимость
        //() => onChange(event)
      );
    }
  };

  render() {
    const { disabled, label, className, ...other } = this.props;
    const { isChecked } = this.state;
    const type = 'checkbox';
    const baseProps = { type, disabled, onChange: this.handleOnChange };
    const inputCheckbox =
      isChecked !== undefined ? (
        <input checked={isChecked} {...baseProps} value={isChecked} />
      ) : (
        <input {...baseProps} />
      );
    return (
      <label
        {...other}
        className={classnames({ [css.wrapper]: true, [className]: true, checked: isChecked, [css.disabled]: disabled })}
      >
        {inputCheckbox}
        <span className={classnames({ [css.pseudoSquare]: true, [css.withText]: !!label })}>
          <IconCheck />
        </span>
        <span>{label}</span>
      </label>
    );
  }
}

Checkbox.defaultProps = {
  onChange: () => {}
};

Checkbox.propTypes = {
  checked: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  refCallback: PropTypes.func
};

export default Checkbox;
