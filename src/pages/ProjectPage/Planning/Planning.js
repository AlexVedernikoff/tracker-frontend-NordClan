import React, { Component } from 'react';
import GanttChart from "./GanttChart";
import * as css from './Planning.scss';

export default class Planning extends Component {

  render () {
    return (
      <div>
        <section>
          <h2 className={css.testClass}>Планирование</h2>
        </section>
        <GanttChart />
      </div>
    );
  }
};
