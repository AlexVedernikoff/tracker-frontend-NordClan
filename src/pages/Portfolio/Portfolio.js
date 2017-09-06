import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as css from './Portfolio.scss';
import { getPortfolio, getPortfolioName } from '../../actions/Portfolio';
import ProjectCard from '../../components/ProjectCard';

class Portfolio extends Component {
  constructor (props) {
    super(props);
    this.state = {};
  }

  componentWillMount () {
    this.props.getPortfolio(this.props.params.portfolioId);
    this.props.getPortfolioName(this.props.params.portfolioId);
  }

  render () {
    let list = [];
    if (this.props.portfolio.length) {
      list = this.props.portfolio.map(element => {return <ProjectCard key={`project-${element.id}`} project={element} isPortfolio={false}/>;});
    }
    return (
      <div>
        <section>
          <h1 className={css.testClass}>{this.props.name}</h1>
           {list}
        </section>
      </div>
    );
  }
}


const mapStateToProps = state => ({
  portfolio: state.Portfolio.data,
  name: state.Portfolio.name
});

const mapDispatchToProps = {
  getPortfolio,
  getPortfolioName
};

Portfolio.propTypes = {
  getPortfolio: PropTypes.func,
  getPortfolioName: PropTypes.func,
  name: PropTypes.string,
  params: PropTypes.object,
  portfolio: PropTypes.array
};

export default connect(mapStateToProps, mapDispatchToProps)(Portfolio);
