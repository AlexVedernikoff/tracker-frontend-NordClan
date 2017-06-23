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
      tasks: data,
      zoom: 'Days'
    };
  }

  componentDidMount() {
    gantt.init(this.ganttContainer);
    gantt.parse(this.state.tasks);

    gantt.attachEvent('onAfterTaskAdd', (id, task) => {
      if (this.props.onTaskUpdated) {
        this.props.onTaskUpdated(id, 'inserted', task);
      }
    });

    gantt.attachEvent('onAfterTaskUpdate', (id, task) => {
      if (this.props.onTaskUpdated) {
        this.props.onTaskUpdated(id, 'updated', task);
      }
    });

    gantt.attachEvent('onAfterTaskDelete', id => {
      if (this.props.onTaskUpdated) {
        this.props.onTaskUpdated(id, 'deleted');
      }
    });

    gantt.attachEvent('onAfterLinkAdd', (id, link) => {
      if (this.props.onLinkUpdated) {
        this.props.onLinkUpdated(id, 'inserted', link);
      }
    });

    gantt.attachEvent('onAfterLinkUpdate', (id, link) => {
      if (this.props.onLinkUpdated) {
        this.props.onLinkUpdated(id, 'updated', link);
      }
    });

    gantt.attachEvent('onAfterLinkDelete', (id, link) => {
      if (this.props.onLinkUpdated) {
        this.props.onLinkUpdated(id, 'deleted');
      }
    });
  }

  setZoom(value) {
    switch (value) {
      case 'Hours':
        gantt.config.scale_unit = 'day';
        gantt.config.date_scale = '%d %M';

        gantt.config.scale_height = 60;
        gantt.config.min_column_width = 30;
        gantt.config.subscales = [{ unit: 'hour', step: 1, date: '%H' }];
        break;
      case 'Days':
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = 'week';
        gantt.config.date_scale = '#%W';
        gantt.config.subscales = [{ unit: 'day', step: 1, date: '%d %M' }];
        gantt.config.scale_height = 60;
        break;
      case 'Months':
        gantt.config.min_column_width = 70;
        gantt.config.scale_unit = 'month';
        gantt.config.date_scale = '%F';
        gantt.config.scale_height = 60;
        gantt.config.subscales = [{ unit: 'week', step: 1, date: '#%W' }];
        break;
      default:
        break;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.zoom !== nextState.zoom;
  }

  componentDidUpdate() {
    gantt.render();
  }

  handleZoomChange = zoom => {
    console.log(zoom);
    this.setState({
      zoom: zoom
    });
  };

  render() {
    console.log(this.props);
    this.setZoom(this.state.zoom);
    return (
      <div>
        <Toolbar
          zoom={this.state.zoom}
          onZoomChange={this.handleZoomChange}
        />
        <div
          ref={ref => {
            this.ganttContainer = ref;
          }}
          style={{ width: 1200, height: 550 }}
        />
      </div>
    );
  }
}

export default GanttChart;
