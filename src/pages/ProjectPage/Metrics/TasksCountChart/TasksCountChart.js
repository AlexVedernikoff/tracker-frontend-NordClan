import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TasksCountChart.scss';
import ChartWrapper from '../ChartWrapper';
import { Line } from 'react-chartjs-2';
import getColor from '../../../../utils/Colors';
import localize from './TasksCountChart.json';
import { connect } from 'react-redux';
import moment from 'moment';
import { dataLabelsPlugin } from '../../../../utils/Charts';
import { makeLine, transformMetrics } from '../../../../utils/chartMetrics';

class TasksCountChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    lang: PropTypes.string,
    openedBugsMetrics: PropTypes.array,
    openedCustomerBugsMetrics: PropTypes.array,
    openedFeaturesFromClient: PropTypes.array,
    openedFeaturesMetric: PropTypes.array,
    openedFeaturesWithoutEvaluationMetric: PropTypes.array,
    openedOutOfPlanFeaturesMetric: PropTypes.array
  };

  state = { chartRef: null };

  setChartRef = node => {
    this.setState({
      chartRef: node
    });
  };

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
              labelString: localize[this.props.lang].NUMBER_OF_TASKS
            }
          }
        ],
        xAxes: [
          {
            type: 'time',
            time: {
              displayFormats: {
                day: 'D MMM'
              },
              tooltipFormat: 'DD.MM.YYYY',
              locale: moment.locale(localize[this.props.lang].LANG)
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

  makeChartData() {
    const {
      openedFeaturesMetric,
      openedFeaturesWithoutEvaluationMetric,
      openedOutOfPlanFeaturesMetric,
      openedBugsMetrics,
      openedCustomerBugsMetrics,
      openedFeaturesFromClient
    } = this.props;

    getColor.reset();

    return {
      datasets: [
        ...this.andDottedLine(
          makeLine(openedFeaturesMetric.beforeEndOfSprintMetrics, localize[this.props.lang].NUMBER_OPEN_TASKS),
          transformMetrics(openedFeaturesMetric.afterEndOfSprintMetrics)
        ),
        ...this.andDottedLine(
          makeLine(
            openedFeaturesWithoutEvaluationMetric.beforeEndOfSprintMetrics,
            localize[this.props.lang].WITHOUT_ELEVATION
          ),
          transformMetrics(openedFeaturesWithoutEvaluationMetric.afterEndOfSprintMetrics)
        ),
        ...this.andDottedLine(
          makeLine(openedOutOfPlanFeaturesMetric.beforeEndOfSprintMetrics, localize[this.props.lang].OUTSIDE_PLAN),
          transformMetrics(openedOutOfPlanFeaturesMetric.afterEndOfSprintMetrics)
        ),
        ...this.andDottedLine(
          makeLine(openedBugsMetrics.beforeEndOfSprintMetrics, localize[this.props.lang].NUMBER_BUGS),
          transformMetrics(openedBugsMetrics.afterEndOfSprintMetrics)
        ),
        ...this.andDottedLine(
          makeLine(
            openedFeaturesFromClient.beforeEndOfSprintMetrics,
            localize[this.props.lang].NUMBER_OPEN_TASKS_FROM_CLIENT
          ),
          transformMetrics(openedFeaturesFromClient.afterEndOfSprintMetrics)
        ),
        ...this.andDottedLine(
          makeLine(
            openedCustomerBugsMetrics.beforeEndOfSprintMetrics,
            localize[this.props.lang].NUMBER_BUGS_FROM_CLIENT
          ),
          transformMetrics(openedCustomerBugsMetrics.afterEndOfSprintMetrics)
        )
      ]
    };
  }

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

  render() {
    const { lang } = this.props;
    return (
      <ChartWrapper chartRef={this.state.chartRef} className={css.BugsChart}>
        <h3>{localize[lang].NUMBER_OF_TASKS}</h3>
        <Line ref={this.setChartRef} data={this.makeChartData()} options={this.getGraphicOptions()} redraw />
      </ChartWrapper>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(TasksCountChart);
