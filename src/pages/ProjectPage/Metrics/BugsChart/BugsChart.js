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
import moment from 'moment';
// import datalabels from 'chartjs-plugin-datalabels';

class BugsChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    getBasicLineSettings: PropTypes.func,
    lang: PropTypes.string,
    openedBugsMetrics: PropTypes.array,
    openedCustomerBugsMetrics: PropTypes.array,
    openedRegressBugsMetrics: PropTypes.array
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
              labelString: localize[this.props.lang].BUGS_NUM
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

  setChartRef = node => {
    this.setState({
      chartRef: node
    });
  };

  render() {
    return (
      <ChartWrapper chartRef={this.state.chartRef} className={css.BugsChart}>
        <Line ref={this.setChartRef} data={this.makeChartData()} options={this.getGraphicOptions()} redraw />
      </ChartWrapper>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(BugsChart);
