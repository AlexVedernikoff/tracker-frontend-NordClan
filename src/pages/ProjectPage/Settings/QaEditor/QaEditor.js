import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as css from './QaEditor.scss';
import { changeProject } from '../../../../actions/Project';
import classnames from 'classnames';

class QaEditor extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    project: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      value: this.props.project.percentQA || 30
    };
  }

  handleChange = event => {
    this.setState({ value: event.target.value }, () => {
      this.props.changeProject(
        {
          id: this.props.project.id,
          percentQa: this.state.value
        },
        'percentQa'
      );
    });
  };

  render() {
    return (
      <div className={css.PortfolioEditor}>
        <h2>% на QA</h2>
        <input
          type="text"
          placeholder="Введите % на QA"
          className={classnames(css.selectPortfolio, css.input)}
          value={this.state.value}
          onChange={this.handleChange}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.Project.project,
  user: state.Auth.user
});

const mapDispatchToProps = {
  changeProject
};

export default connect(mapStateToProps, mapDispatchToProps)(QaEditor);
