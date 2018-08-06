import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import ChartWrapper from '../ChartWrapper';
import * as css from './ClosingFeaturesChart.scss';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';
import getColor from '../../../../utils/Colors';
import localize from './ClosingFeaturesChart.json';
import { connect } from 'react-redux';

class ClosingFeaturesChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    sprintClosingFeaturesMetrics: PropTypes.array,
    sprintWorkWithoutEvaluationMetrics: PropTypes.array,
    sprintWriteOffTimeMetrics: PropTypes.array
  };

  chartRef = null;

  getGraphicOptions() {
    return {
      ...this.props.chartDefaultOptions,
      scales: {
        ...this.props.chartDefaultOptions.scales,
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: localize[this.props.lang].HOURS
            }
          }
        ]
      }
    };
  }

  makeChartData = () => {
    const { sprintClosingFeaturesMetrics, sprintWriteOffTimeMetrics, sprintWorkWithoutEvaluationMetrics } = this.props;

    getColor.reset();

    return {
      datasets: [
        this.makeBugsLine(sprintClosingFeaturesMetrics, localize[this.props.lang].DYNAMIC_CLOSE),
        this.makeBugsLine(sprintWriteOffTimeMetrics, localize[this.props.lang].DYNAMIC_OFF_TIME),
        this.makeBugsLine(sprintWorkWithoutEvaluationMetrics, localize[this.props.lang].DYNAMIC_WITHOUT_ELEVATION)
      ]
    };
  };

  makeBugsLine = (metrics, label) => {
    const line = metrics
      .map(metric => {
        return {
          x: metric.createdAt,
          y: roundNum(+metric.value, 2)
        };
      })
      .sort(sortChartLineByDates);
    return {
      data: [...line],
      label: label,
      ...this.props.getBasicLineSettings()
    };
  };

  setChartRef = node => (this.chartRef = node);

  render() {
    const { lang } = this.props;
    return (
      <ChartWrapper chartRef={this.chartRef} className={css.ClosingFeaturesChart}>
        <h3>{localize[lang].DYNAMIC}</h3>
        <Line ref={this.setChartRef} data={this.makeChartData()} options={this.getGraphicOptions()} redraw />
      </ChartWrapper>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(ClosingFeaturesChart);
