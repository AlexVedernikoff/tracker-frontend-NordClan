import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './TasksCountChart.scss';
import ChartWrapper from '../ChartWrapper';
import { Line } from 'react-chartjs-2';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import getColor from '../../../../utils/Colors';
import roundNum from '../../../../utils/roundNum';
import localize from './TasksCountChart.json';
import { connect } from 'react-redux';
import moment from 'moment';
// import datalabels from 'chartjs-plugin-datalabels';

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
      plugins: {
        datalabels: {
          formatter: function(value) {
            return value.y;
          },
          align: 'end'
        }
      }
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
        this.makeTaskCountMetricsLine(openedFeaturesMetric, localize[this.props.lang].NUMBER_OPEN_TASKS),
        this.makeTaskCountMetricsLine(
          openedFeaturesWithoutEvaluationMetric,
          localize[this.props.lang].WITHOUT_ELEVATION
        ),
        this.makeTaskCountMetricsLine(openedOutOfPlanFeaturesMetric, localize[this.props.lang].OUTSIDE_PLAN),
        this.makeTaskCountMetricsLine(openedBugsMetrics, localize[this.props.lang].NUMBER_BUGS),
        this.makeTaskCountMetricsLine(openedCustomerBugsMetrics, localize[this.props.lang].NUMBER_BUGS_FROM_CLIENT),
        this.makeTaskCountMetricsLine(openedFeaturesFromClient, localize[this.props.lang].NUMBER_OPEN_TASKS_FROM_CLIENT)
      ]
    };
  }

  makeTaskCountMetricsLine = (metrics, label) => {
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
