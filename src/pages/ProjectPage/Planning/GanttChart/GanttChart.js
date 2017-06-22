import React, { Component } from 'react';
import Toolbar from './Toolbar';
import 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';

const data = {
  data: [
    {
      id: 1,
      text: 'Task #1',
      start_date: '15-04-2017',
      duration: 3,
      progress: 0.6
    },
    {
      id: 2,
      text: 'Task #2',
      start_date: '18-04-2017',
      duration: 9,
      progress: 0.4
    }
  ],
  links: [{ id: 1, source: 1, target: 2, type: '0' }]
};

class GanttChart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tasks: data
    };
  }

  componentDidMount() {
    gantt.init(this.ganttContainer);
    gantt.parse(this.state.tasks);
    this.forceUpdate();
  }

  render() {
    return (
      <div
        ref={ref => {
          this.ganttContainer = ref;
        }}
        style={{width: 1200, height: 550}}
      />
    );
  }
}

export default GanttChart;
