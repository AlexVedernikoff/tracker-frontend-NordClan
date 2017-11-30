import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as css from './Metrics.scss';
import StartEndDates from './StartEndDates/StartEndDates'
class Metrics extends Component {
  constructor(props) {
    super(props)
    console.log(this.props)
    
  }
  render () {
    return (
      <div>
        <section>
          <h2 className={css.testClass}>Аналитика</h2>
          <StartEndDates createdAt = {this.props.createdAt} completedAt = {this.props.completedAt}/>
        </section>
      </div>
    );
  }
}
const mapStateToProps = state => ({
  createdAt: state.Project.project.createdAt,
  completedAt: state.Project.project.completedAt,
  project: state.Project.project
});

const mapDispatchToProps = {
};

Metrics.propTypes = {
  createdAt: PropTypes.string,
  completedAt: PropTypes.string,
  project: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(Metrics)
