import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Checkbox from '../../../../../components/Checkbox';
class ExternalUserActivity extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: props.checked
    };
  }

  componentDidUpdate = prevProps => {
    if (prevProps.isEditing !== this.props.isEditing && !this.props.isLoading) {
      this.setState({
        checked: this.props.checked
      });
    }
  };

  onActivityChange = () => {
    const newCheckboxState = !this.state.checked;
    this.setState(
      {
        checked: newCheckboxState
      },
      () => this.props.onValueChange(+newCheckboxState)
    );
  };
  render() {
    const { isLoading, isEditing } = this.props;
    const checked = isEditing || isLoading ? this.state.checked : this.props.checked;
    return <Checkbox checked={checked} disabled={!isEditing} onChange={this.onActivityChange} />;
  }
}
ExternalUserActivity.propTypes = {
  checked: PropTypes.bool,
  fieldType: PropTypes.string,
  isEditing: PropTypes.bool,
  isLoading: PropTypes.bool,
  onValueChange: PropTypes.func
};
export default ExternalUserActivity;
