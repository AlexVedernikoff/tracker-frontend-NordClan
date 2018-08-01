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

class TasksCountChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    openedBugsMetrics: PropTypes.array,
    openedCustomerBugsMetrics: PropTypes.array,
    openedFeaturesMetric: PropTypes.array,
    openedFeaturesWithoutEvaluationMetric: PropTypes.array,
    openedOutOfPlanFeaturesMetric: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      chartRef: null
    };
  }

  componentDidMount() {
    this.setState({ chartRef: this.refs.chart });
  }

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
        ]
      }
    };
  }

  makeChartData() {
    const {
      openedFeaturesMetric,
      openedFeaturesWithoutEvaluationMetric,
      openedOutOfPlanFeaturesMetric,
      openedBugsMetrics,
      openedCustomerBugsMetrics
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
        this.makeTaskCountMetricsLine(openedCustomerBugsMetrics, localize[this.props.lang].NUMBER_BUGS_FROM_CLIENT)
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
      <ChartWrapper chartRef={this.chartRef} className={css.BugsChart}>
        <h3>{localize[lang].NUMBER_OF_TASKS}</h3>
        <Line
          ref={element => {
            this.chartRef = element;
          }}
          data={this.makeChartData()}
          options={this.getGraphicOptions()}
          redraw
        />
      </ChartWrapper>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(TasksCountChart);
