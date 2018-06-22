import React, { Component } from 'react';
// import { Row, Col } from 'react-flexbox-grid/lib/index';
import PropTypes from 'prop-types';
import * as css from './ExternalUsersTable.scss';
import { connect } from 'react-redux';
import { getExternalUsers } from '../../../actions/ExternalUsers';
import ExternalUsersTableHeader from './ExternalUsersTableHeader';
import ExternalUsersTableRow from './ExternalUsersTableRow';

class ExternalUsersTable extends Component {
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
        {this.props.exUsers.map(item => <ExternalUsersTableRow key={item.id} exUser={item} />)}
      </div>
    );
  }
}
const mapStateToProps = state => ({
  exUsers: state.ExternalUsers.users
});

const mapDispatchToProps = {
  getExternalUsers
  // editExternalUser
};

ExternalUsersTable.propTypes = {
  // editExternalUser: PropTypes.func,
  exUsers: PropTypes.array,
  getExternalUsers: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ExternalUsersTable);
