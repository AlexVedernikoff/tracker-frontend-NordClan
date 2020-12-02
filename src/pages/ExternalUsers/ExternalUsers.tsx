import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExternalUsersTable from './ExternalUsersTable';
import AddExternalUser from './AddExternalUser';
import { connect } from 'react-redux';
import localize from './ExternalUsers.json';
import Title from '../../components/Title';

type ExternalUsersProps = {
  lang: 'en' | 'ru',
}

class ExternalUsers extends Component<ExternalUsersProps, {}> {
  render() {
    const { lang } = this.props;
    return (
      <section>
        <Title render={`[Epic] - ${localize[lang].USERS}`} />
        <h1>{localize[lang].USERS}</h1>
        <hr />
        <AddExternalUser />
        <ExternalUsersTable />
      </section>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(ExternalUsers);
