import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Row } from 'react-flexbox-grid/lib/index';
import Select from 'react-select';
import * as css from './PortfolioEditor.scss';
import getPortfolios from '../../../../utils/getPortfolios'
import {
  changeProject
} from '../../../../actions/Project';

class PortfolioEditor extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedPortfolio: this.getInitSelectValue(this.props)
    }
  }

  static propTypes = {
    project: PropTypes.object.isRequired
  }

  componentWillReceiveProps = (nextProps) => {
    if (typeof this.props.project.portfolio === 'undefined') {
      this.setState({ selectedPortfolio: this.getInitSelectValue(nextProps) });
    };
  }

  getInitSelectValue = (props) => {
    if (props.project.portfolio) {
      return {
        value: props.project.portfolio.id,
        label: props.project.portfolio.name
      }
    } else {
      return null
    }
  }
  
  handlePortfolioChange = event => {
    let portfolioId = event ? event.value : 0;
    let value = event
    if (Array.isArray(event)) {
      value = null
    } else {
      this.props.changeProject(
        {
          id: this.props.project.id,
          portfolioId
        },
        'Portfolio'
      );
    }
    this.setState({
      selectedPortfolio: value
    });

  };

  render() {
    const SelectAsync = Select.AsyncCreatable;

    return (
      <div className={css.PortfolioEditor}>
        <h2>Портфель</h2>
        <Row>
          <SelectAsync
            promptTextCreator={label => `Создать портфель '${label}'`}
            searchPromptText={'Введите название портфеля'}
            multi={false}
            ignoreCase={false}
            placeholder="Выберите портфель"
            loadOptions={getPortfolios}
            filterOption={el => el}
            onChange={this.handlePortfolioChange}
            value={this.state.selectedPortfolio}
            className={css.selectPortfolio}
          />
        </Row>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  project: state.Project.project
});

const mapDispatchToProps = {
  changeProject
};

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioEditor);