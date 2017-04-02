import React, {PropTypes} from 'react';
import { Link } from 'react-router';

export default class TaskHistory extends React.Component {

  render() {
    const css = require('./TaskHistory.scss');

    return (
      <div className={css.history}>
        <h3 className={css.historyTitle}>История изменений</h3>
        <div className={css.historyEvent}>
          <span className={css.time}>17.02.2017 13:15</span>
          <div className={css.historyAction}>
            <Link to="#">Анастасия Горшкова</Link> has edit name status from On Track to Off Track.
          </div>
        </div>
        <div className={css.historyEvent}>
          <span className={css.time}>17.02.2017 13:13</span>
          <div className={css.historyAction}>
            <Link to="#">Анастасия Горшкова</Link> has edit name status from Proposed to On Track.
          </div>
        </div>
        <div className={css.historyEvent}>
          <span className={css.time}>17.02.2017 12:18</span>
          <div className={css.historyAction}>
            <Link to="#">Анастасия Горшкова</Link> has edit name status from On Track to Proposed.
          </div>
        </div>
        <div className={css.historyEvent}>
          <span className={css.time}>17.02.2017 12:18</span>
          <div className={css.historyAction}>
            <Link to="#">Анастасия Горшкова</Link> has edit name status from Proposed to On Track.
          </div>
        </div>
        <div className={css.historyEvent}>
          <span className={css.time}>17.02.2017 10:49</span>
          <div className={css.historyAction}>
            <Link to="#">Виктор Сычев</Link> has add task.
          </div>
        </div>
        <div className={css.historyEvent}>
          <span className={css.time}>17.02.2017 10:49</span>
          <div className={css.historyAction}>
            <Link to="#">Виктор Сычев</Link> has posted task to <Link to="#">Фаза проекта Этап 10</Link>.
          </div>
        </div>
      </div>
    );
  }
}

TaskHistory.propTypes = {
  task: PropTypes.object.isRequired
};
