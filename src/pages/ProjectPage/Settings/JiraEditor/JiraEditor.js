import React, { Component } from 'react';
import PropTypes from 'prop-types';
import localize from './JiraEditor.json';
import * as css from './JiraEditor.scss';

import Button from '../../../../components/Button';
import Wizard from '../../../../components/Wizard';

class JiraEditor extends Component {
  static propTypes = {};

  constructor(props) {
    super(props);
    this.state = {
      isOpenBindWizard: false
    };
  }

  componentDidMount() {}

  handleOpenBindWizard = () => {
    this.setState({
      isOpenBindWizard: true
    });
  };

  render() {
    const { lang } = this.props;

    return (
      <div className={css.jiraEditor}>
        <h2>Jira</h2>
        <Button
          onClick={this.handleOpenBindWizard}
          addedClassNames={{ [css.addButton]: true }}
          type="primary"
          icon="IconPlus"
          text={localize[lang].BIND_PROJECT}
        />
      </div>
    );
  }
}

export default JiraEditor;
