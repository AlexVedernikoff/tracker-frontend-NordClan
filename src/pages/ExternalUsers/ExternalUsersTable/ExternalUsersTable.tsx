import React, { Component } from 'react';
import PropTypes from 'prop-types';
import css from './ExternalUsersTable.scss';
import { connect } from 'react-redux';
import { getExternalUsers } from '../../../actions/ExternalUsers';
import ExternalUsersTableHeader from './ExternalUsersTableHeader';
import ExternalUsersTableRow from './ExternalUsersTableRow';
import { User } from '../../types';

export type ExternalUser = User & {
  login: string,
  description: string,
  isActive: boolean,
  expiredDate: string,
};

type ExternalUsersTableProp = {
  getExternalUsers: () => any,
  exUsers: ExternalUser[],
};

class ExternalUsersTable extends Component<ExternalUsersTableProp, {}> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.getExternalUsers();
  }
  render() {
    return (
      <div className={css.ExternalUsersTable}>
        <ExternalUsersTableHeader />
        {this.props.exUsers.map(item => (
          <ExternalUsersTableRow key={item.id} exUser={item} />
        ))}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  exUsers: state.ExternalUsers.users
});

const mapDispatchToProps = {
  getExternalUsers
};

(ExternalUsersTable as any).propTypes = {
  exUsers: PropTypes.array,
  getExternalUsers: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ExternalUsersTable);
