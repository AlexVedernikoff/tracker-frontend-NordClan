import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './CostByRoleChart.scss';
import { Line } from 'react-chartjs-2';
import ChartWrapper from '../ChartWrapper';
import Button from '../../../../components/Button';
import sortChartLineByDates from '../../../../utils/sortChartLineByDates';
import roundNum from '../../../../utils/roundNum';
import getColor from '../../../../utils/Colors';
import localize from './CostByRoleChart.json';
import { connect } from 'react-redux';
import moment from 'moment';
import { dataLabelsPlugin } from '../../../../utils/Charts';

class CostByRoleChart extends Component {
  static propTypes = {
    chartDefaultOptions: PropTypes.object,
    costByRoleMetrics: PropTypes.array,
    costByRolePercentMetrics: PropTypes.array,
    getBasicLineSettings: PropTypes.func,
    lang: PropTypes.string
  };

  constructor(props) {
    super(props);

    this.state = {
      displayPercent: true,
      chartRef: null
    };
  }

  setChartRef = node => {
    this.setState({
      chartRef: node
    });
  };

  makeChartData() {
    const { costByRoleMetrics, costByRolePercentMetrics } = this.props;
    const { displayPercent } = this.state;

    getColor.reset();

    return {
      datasets: [...this.makeRoleMetricsLine(displayPercent ? costByRolePercentMetrics : costByRoleMetrics)]
    };
  }

  getChartOptions = () => {
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
              labelString: this.state.displayPercent ? localize[this.props.lang].PER_OF_H : localize[this.props.lang].H
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
  };

  makeRoleMetricsLine(roleMetrics) {
    return roleMetrics.map(role => {
      const line = role.metrics
        .map(metric => {
          return {
            x: metric.createdAt,
            y: roundNum(+metric.value, 2)
          };
        })
        .sort(sortChartLineByDates);
      return {
        data: line,
        label: role.name,
        ...this.props.getBasicLineSettings()
      };
    });
  }
  switcherClickHandler = buttonType => {
    return () => {
      if (buttonType === 'percent' && !this.state.displayPercent) {
        this.setState({ displayPercent: true });
      } else if (buttonType === 'hours' && this.state.displayPercent) {
        this.setState({ displayPercent: false });
      }
    };
  };
  render() {
    const { lang } = this.props;

    return (
      <ChartWrapper chartRef={this.state.chartRef} className={css.CostByRoleChart}>
        <div className={css.CostByRoleSwitcher}>
          <Button
            type={this.state.displayPercent ? 'primary' : 'bordered'}
            text={localize[lang].IN_PERCENT}
            onClick={this.switcherClickHandler('percent')}
          />
          <Button
            type={this.state.displayPercent ? 'bordered' : 'primary'}
            text={localize[lang].IN_HOURS}
            onClick={this.switcherClickHandler('hours')}
          />
        </div>
        <Line ref={this.setChartRef} data={this.makeChartData()} options={this.getChartOptions()} redraw />
      </ChartWrapper>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(mapStateToProps)(CostByRoleChart);
