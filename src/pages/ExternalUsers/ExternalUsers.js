import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ExternalUsersTable from './ExternalUsersTable';
import AddExternalUser from './AddExternalUser';
import { connect } from 'react-redux';
import localize from './ExternalUsers.json';
import Title from 'react-title-component';

class ExternalUsers extends Component {
  static propTypes = {
    lang: PropTypes.string
  };

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
