import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { Link } from 'react-router';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import { IconPlay, IconPause, IconTime } from '../Icons';
import Tags from '../Tags';
import Tag from '../Tag';
import * as css from './TaskRow.scss';

export default class TaskRow extends React.Component {

  constructor (props) {
    super(props);
    this.state = {
      cutTags: props.task.tags.length > 6
    };
  }

  render () {
    const {
      task,
      shortcut,
      card,
      ...other
    } = this.props;

    const classPriority = 'priority-' + task.priority;
    const tags = task.tags.map((element, i) => <Tag key={i} name={element}/>);
    const sliceTags = tags.slice(0, 6);
    const { cutTags } = this.state;

    return (
      <div className={classnames({[css.taskCard]: true, [css[classPriority]]: true, [css.card]: card})} {...other}>
        <Row>
          <Col xs={shortcut ? 12 : 6}>
            <div className={css.header}>
              <div>
                <div className={css.priorityMarker} data-tip={`Приоритет: ${task.priority}`}>{task.priority}</div>
              </div>
              <div className={css.prefix}>{task.prefix}</div>
              <div className={css.type}>{task.type}</div>
              <div className={css.type}>
                На стадии:
                {
                  task.stage === 'NEW'
                  ? ' New'
                  : task.stage === 'DEVELOP'
                  ? ' Develop'
                  : task.stage === 'CODE_REVIEW'
                  ? ' Code Review'
                  : task.stage === 'QA'
                  ? ' QA'
                  : task.stage === 'DONE'
                  ? ' Done'
                  : null
                }
              </div>
              <div>
                {
                  task.status === 'INPROGRESS'
                  ? <span className={css.greenText}>В процессе</span>
                  : 'Приостановлено'
                }
              </div>
            </div>
            <Link to={`/projects/5/tasks/${task.id}`} className={css.taskName}>
              <h4>
                {task.name}
              </h4>
            </Link>
          </Col>
          {
            !shortcut
            ? <Col xs={3}>
              <div className={css.metabox}>
                <p className={css.taskMeta}>
                  <span>Спринт:</span><span><Link to="/projects/1">{task.sprint}</Link></span>
                </p>
                <p className={css.taskMeta}>
                  <span>Исполнитель:</span><span><Link to={`users/${5}`}>{task.executor}</Link></span>
                </p>
                <p className={css.taskMeta}>
                  {
                    task.stage !== 'NEW'
                    ? <span className={css.time}>
                      <span>Время: </span>
                      <span className={classnames({[css.redText]: task.plannedTime < task.factTime, [css.greenText]: task.plannedTime > task.factTime})}>{task.factTime} ч. из {task.plannedTime}</span>
                    </span>
                    : null
                  }
                </p>
              </div>
            </Col>
            : null
          }

          {
            !shortcut
            ? <Col xs>
              <div className={css.tagbox}>
                <Tags>{
                  !cutTags
                  ? tags
                  : sliceTags
                }</Tags>
                {
                  cutTags
                  ? <span className={css.loadMore} onClick={() => this.setState({cutTags: false})}>Показать все {task.tags.length}</span>
                  : null
                }
              </div>
            </Col>
            : null
          }

        </Row>
        {/*<div className={css.progressBar}>
          <div
            style={{width: (task.stage === 'NEW') ? 0 : ((task.factTime / task.plannedTime) < 1) ? (task.factTime / task.plannedTime) * 100 + '%' : '100%'}}
            className={classnames({
              [css.green]: (task.factTime / task.plannedTime) <= 1,
              [css.red]: (task.factTime / task.plannedTime) > 1
            })}
            />
        </div>*/}
      </div>
    );
  }
};

TaskRow.propTypes = {
  card: PropTypes.bool,
  shortcut: PropTypes.bool,
  task: PropTypes.object
};
