import React, { Component } from 'react';
// import * as css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
import Input from '../../../../../components/Input';
import { IconEdit, IconCheck, IconClose } from '../../../../../components/Icons';

class ExternalUserName extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isEditing: false
    };
  }
  toggleEditing = () => {
    this.setState(state => ({ isEditing: !state.isEditing }));
  };
  render() {
    return (
      <div>
        {this.state.isEditing ? <Input type="text" defaultValue={this.props.name} /> : <div>{this.props.name}</div>}
        {this.state.isEditing ? (
          [
            <IconCheck
              // className={css.save}
              onClick={this.changeValue}
              key="save"
              data-tip="Сохранить"
            />,
            <IconClose data-tip="Отменить" key="cancel" />
          ]
        ) : (
          <IconEdit
            // className={css.edit}
            onClick={this.toggleEditing}
            data-tip="Редактировать"
          />
        )}
      </div>
    );
  }
}
ExternalUserName.propTypes = {
  name: PropTypes.string
};
export default ExternalUserName;
