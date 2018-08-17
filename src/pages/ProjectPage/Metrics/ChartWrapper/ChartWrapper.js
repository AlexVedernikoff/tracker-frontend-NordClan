import React, { Component } from 'react';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import * as css from './ChartWrapper.scss';
import classnames from 'classnames';

class ChartWrapper extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selected: false
    };
  }

  handleMouseDown = () => {
    this.setChartSelection(true);
  };

  handleClickOutside = () => {
    this.setChartSelection(false);
  };

  setChartSelection = state => {
    this.setState(
      {
        selected: state
      },
      this.setZoomState
    );
  };

  setZoomState = () => {
    if (this.props.chartRef) {
      const { chart_instance } = this.props.chartRef;

      if (chart_instance.modifyZoom) {
        chart_instance.modifyZoom._allowZoom = this.state.selected;
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
