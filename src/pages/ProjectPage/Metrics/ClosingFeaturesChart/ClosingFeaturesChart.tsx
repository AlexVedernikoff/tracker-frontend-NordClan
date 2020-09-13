import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import ChartWrapper from '../ChartWrapper';
import * as css from './ClosingFeaturesChart.scss';
import getColor from '../../../../utils/Colors';
import localize from './ClosingFeaturesChart.json';
import { connect } from 'react-redux';
import { dataLabelsPlugin, defaultTimeDisplayFormats } from '../../../../utils/Charts';
import { makeLine, transformMetrics } from '../../../../utils/chartMetrics';

class ClosingFeaturesChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    lang: PropTypes.string,
    sprintClosingFeaturesMetrics: PropTypes.array,
    sprintWorkWithoutEvaluationMetrics: PropTypes.array,
    sprintWriteOffTimeMetrics: PropTypes.array
  };

  state = { chartRef: null };

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
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              displayFormats: defaultTimeDisplayFormats,
              tooltipFormat: 'DD.MM.YYYY',
              locale: localize[this.props.lang].LANG
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: localize[this.props.lang].DATE
            }
          }
        ]
      },
      plugins: dataLabelsPlugin
    };
  }

  makeChartData = () => {
    const { sprintClosingFeaturesMetrics, sprintWriteOffTimeMetrics, sprintWorkWithoutEvaluationMetrics } = this.props;

    getColor.reset();

    return {
      datasets: [
        ...this.andDottedLine(
          makeLine(sprintClosingFeaturesMetrics.beforeEndOfSprintMetrics, localize[this.props.lang].DYNAMIC_CLOSE),
          transformMetrics(sprintClosingFeaturesMetrics.afterEndOfSprintMetrics)
        ),
        ...this.andDottedLine(
          makeLine(sprintWriteOffTimeMetrics.beforeEndOfSprintMetrics, localize[this.props.lang].DYNAMIC_OFF_TIME),
          transformMetrics(sprintWriteOffTimeMetrics.afterEndOfSprintMetrics)
        ),
        ...this.andDottedLine(
          makeLine(
            sprintWorkWithoutEvaluationMetrics.beforeEndOfSprintMetrics,
            localize[this.props.lang].DYNAMIC_WITHOUT_ELEVATION
          ),
          transformMetrics(sprintWorkWithoutEvaluationMetrics.afterEndOfSprintMetrics)
        )
      ]
    };
  };

  andDottedLine = (data, dottedLineData) => {
    return [
      data,
      {
        ...data,
        label: `${data.label} ${localize[this.props.lang].END_SPRINT}`,
        data: dottedLineData,
        borderDash: [10, 5]
      }
    ];
  };

  setChartRef = node => {
    this.setState({
      chartRef: node
    });
  };

  render() {
    const { lang } = this.props;
    return (
      <ChartWrapper chartRef={this.state.chartRef} className={css.ClosingFeaturesChart}>
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
