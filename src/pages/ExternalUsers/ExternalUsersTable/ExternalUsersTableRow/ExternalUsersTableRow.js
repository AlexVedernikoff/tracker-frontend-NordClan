import React, { Component } from 'react';
import * as css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
import ExternalUserInput from './ExternalUserInput';
import ExternalUserActivity from './ExternalUserActivity';
import ExternalUserExpiredDate from './ExternalUserExpiredDate';
import ExternalUserDelete from './ExternalUserDelete';
import { connect } from 'react-redux';
import { editExternalUser } from '../../../../actions/ExternalUsers';
import { showNotification } from '../../../../actions/Notifications';

class ExternalUsersTableRow extends Component {
  constructor(props) {
    super(props);
  }
  editUser = id => changedFields => {
    this.props.editExternalUser(id, changedFields);
  };
  render() {
    return (
      <div className={css.TableHeader}>
        <div className={css.TableCell}>
          <ExternalUserInput
            value={this.props.exUser.name}
            changeValue={this.editUser(this.props.exUser.id)}
            showNotification={this.props.showNotification}
            fieldType="name"
          />
        </div>
        <div className={css.TableCell}>
          <ExternalUserInput
            value={this.props.exUser.email}
            changeValue={this.editUser(this.props.exUser.id)}
            showNotification={this.props.showNotification}
            fieldType="email"
          />
        </div>
        <div className={css.TableCell}>
          <ExternalUserActivity
            checked={this.props.exUser.isActive}
            fieldType="isActive"
            changeValue={this.editUser(this.props.exUser.id)}
          />
        </div>
        <div className={css.TableCell}>
          <ExternalUserExpiredDate
            value={this.props.exUser.expiredDate}
            fieldType="expiredDate"
            changeValue={this.editUser(this.props.exUser.id)}
          />
        </div>
        <div className={css.TableCellDelete}>
          <ExternalUserDelete />
        </div>
      </div>
    );
  }
}
ExternalUsersTableRow.propTypes = {
  editExternalUser: PropTypes.func,
  exUser: PropTypes.object,
  showNotification: PropTypes.func
};
const mapStateToProps = state => ({});
const mapDispatchToProps = {
  editExternalUser,
  showNotification
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalUsersTableRow);
