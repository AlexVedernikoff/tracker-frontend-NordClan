import React from 'react';
import ExternalUsersTable from './ExternalUsersTable';
import AddExternalUser from './AddExternalUser';
import { connect } from 'react-redux';
import localize from './ExternalUsers.json';

const ExternalUsers = props => {
  const { lang } = props;
  return (
    <section>
      <h1>{localize[lang].USERS}</h1>
      <hr />
      <AddExternalUser />
      <ExternalUsersTable />
    </section>
  );
};

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(ExternalUsers);
