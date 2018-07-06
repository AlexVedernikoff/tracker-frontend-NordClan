import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BugsChart.scss';
import ChartWrapper from '../ChartWrapper';
import { Line } from 'react-chartjs-2';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';
import getColor from '../../../../utils/Colors';
import localize from './BugsChart.json';
import { connect } from 'react-redux';

class BugsChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    openedBugsMetrics: PropTypes.array,
    openedCustomerBugsMetrics: PropTypes.array,
    openedRegressBugsMetrics: PropTypes.array
  };

  constructor(props) {
    super(props);

    this.state = {
      chartRef: null
    };

    this.chartOptions = {
      ...props.chartDefaultOptions,
      scales: {
        ...props.chartDefaultOptions.scales,
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            },
            display: true,
            scaleLabel: {
              display: true,
              labelString: 'Количество багов'
            }
          }
        ]
      }
    };
  }

  componentDidMount() {
    this.setState({ chartRef: this.refs.chart });
  }

  makeChartData = () => {
    const { openedBugsMetrics, openedCustomerBugsMetrics, openedRegressBugsMetrics, lang } = this.props;

    getColor.reset();

    return {
      datasets: [
        this.makeBugsLine(openedBugsMetrics, localize[lang].BUGS_NUMBER),
        this.makeBugsLine(openedCustomerBugsMetrics, localize[lang].BUGS_NUMBER_FROM_CLIENT),
        this.makeBugsLine(openedRegressBugsMetrics, localize[lang].BUGS_REGRESSION)
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

  render() {
    return (
      <ChartWrapper chartRef={this.state.chartRef} className={css.BugsChart}>
        <Line ref="chart" data={this.makeChartData()} options={this.chartOptions} redraw />
      </ChartWrapper>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(BugsChart);
