import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './BudgetChart.scss'
import Input from '../../../../components/Input';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      data: [1000, 500, 200]
    }
  ]
};
const chartOptions =  {
  scales: {
    yAxes: [{
        ticks: {
            beginAtZero:true
        }
    }]
  }
}

class BudgetChart extends Component {
  constructor(props) {
    super(props)
  }
  render () {
    return (
      <div className = {css.BudgetChart}>
        <h3>Без рискового бюджета</h3>
        <div className = {css.BudgetChartInfo}>
          Бюджет:
          <Input readOnly value = {this.props.budget ? `${this.props.budget} ч.` : 'Нет данных'}/>
        </div>
        <Line data={data} options = {chartOptions} />
      </div>
    )
  }
}
BudgetChart.propTypes = {
  budget: PropTypes.number
}
export default BudgetChart;