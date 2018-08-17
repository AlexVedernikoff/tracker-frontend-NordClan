import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Select from 'react-select';
import * as css from './PortfolioEditor.scss';
import getPortfolios from '../../../../utils/getPortfolios';
import { changeProject } from '../../../../actions/Project';
import checkProjectAdmin from '../../../../utils/checkProjectAdmin';
import localize from './portfolioEditor.json';

class PortfolioEditor extends Component {
  static propTypes = {
    changeProject: PropTypes.func,
    project: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    lang: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      selectedPortfolio: this.getInitSelectValue(this.props)
    };
  }

  componentWillReceiveProps = nextProps => {
    if (typeof this.props.project.portfolio === 'undefined') {
      this.setState({ selectedPortfolio: this.getInitSelectValue(nextProps) });
    }
  };

  getInitSelectValue = props => {
    if (props.project.portfolio) {
      return {
        value: props.project.portfolio.id,
        label: props.project.portfolio.name
      };
    } else {
      return null;
    }
  };

  handlePortfolioChange = event => {
    const portfolioData = this.detectPorfolioData(event);
    let value = event;
    if (Array.isArray(event)) {
      value = null;
    } else {
      this.props.changeProject(
        {
          id: this.props.project.id,
          [portfolioData.field]: portfolioData.value
        },
        'Portfolio'
      );
    }

    this.setState({
      selectedPortfolio: value
    });
  };

  detectPorfolioData = event => {
    if (event && typeof event.value === 'string') {
      return {
        field: 'portfolioName',
        value: event.value
      };
    }

    return {
      field: 'portfolioId',
      value: event ? event.value : 0
    };
  };

  render() {
    const SelectAsync = Select.AsyncCreatable;
    const { user, project, lang } = this.props;
    const isProjectAdmin = checkProjectAdmin(user, project.id);

    return (
      <div className={css.PortfolioEditor}>
        <h2>{localize[lang].PORTFOLIO}</h2>
        <SelectAsync
          promptTextCreator={label => `${localize[lang].PORTFOLIO} '${label}'`}
          searchPromptText={localize[lang].ENTER_NAME_PORTFOLIO}
          multi={false}
          ignoreCase={false}
          placeholder={localize[lang].SELECT_PORTFOLIO}
          loadOptions={getPortfolios}
          filterOption={el => el}
          disabled={!isProjectAdmin}
          onChange={this.handlePortfolioChange}
          value={this.state.selectedPortfolio}
          className={css.selectPortfolio}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.Project.project,
  user: state.Auth.user,
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  changeProject
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PortfolioEditor);
