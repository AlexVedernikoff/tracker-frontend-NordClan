import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './GanttChart.scss';
import classnames from 'classnames';

export default class Toolbar extends Component {
  static propTypes = {
    onZoomChange: PropTypes.func,
    zoom: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  handleZoomChange = e => {
    if (this.props.onZoomChange) {
      this.props.onZoomChange(e.target.value);
    }
  };

  render() {
    const zoomRadios = ['Hours', 'Days', 'Months'].map(value => {
      const isActive = this.props.zoom === value;
      return (
        <label
          key={value}
          className={classnames({
            [css.radioLabel]: true,
            [css.radioLabelActive]: isActive
          })}
        >
          <input type="radio" checked={isActive} onChange={this.handleZoomChange} value={value} />
          {value}
        </label>
      );
    });

    return (
      <div className="zoom-bar" style={{ marginBottom: 10 }}>
        <b>Zooming: </b>
        {zoomRadios}
      </div>
    );
  }
}
