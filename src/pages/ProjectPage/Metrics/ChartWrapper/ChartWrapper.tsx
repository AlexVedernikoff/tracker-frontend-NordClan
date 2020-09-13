import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import * as css from './ChartWrapper.scss';
import classnames from 'classnames';

class ChartWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false,
      zoomAllowed: false
    };
  }

  handleMouseDown = () => {
    this.setChartSelection(true);
  };

  handleClickOutside = () => {
    this.setChartSelection(false);
  };

  setChartSelection = state => {
    this.setState({
      selected: state
    });
  };

  setZoomAllowed = zoomAllowed => () => {
    this.setState({ zoomAllowed }, this.setZoomState);
  };

  setZoomState = () => {
    if (this.props.chartRef) {
      const { chartInstance } = this.props.chartRef;

      if (chartInstance && chartInstance.modifyZoom) {
        chartInstance.modifyZoom._allowZoom = this.state.zoomAllowed;
      }
    }
  };

  render() {
    return (
      <div
        className={classnames({
          [css.chartWrapper]: true,
          [this.props.className]: !!this.props.className,
          [css.selected]: this.state.selected
        })}
        onMouseDown={this.handleMouseDown}
        onMouseOver={this.setZoomAllowed(true)}
        onMouseLeave={this.setZoomAllowed(false)}
      >
        {this.props.children}
      </div>
    );
  }
}

ChartWrapper.propTypes = {
  chartRef: PropTypes.object,
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  className: PropTypes.string
};

export default onClickOutside(ChartWrapper);
