import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import SingleComment from './SingleComment';
import TotalComment from './TotalComment';
import * as css from '../Timesheets.scss';
import { IconClose } from '../../../components/Icons';

class ActivityRow extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    ma: PropTypes.bool,
    task: PropTypes.bool
  }

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  toggle = () => {}

  render () {

    const { item, task, ma } = this.props;
    console.log(item);

    return (
      <tr className={css.taskRow}>
        <td>
          <div className={css.taskCard}>
            <div className={css.meta}>
              <span>{item.projectName}</span>
            </div>
            <div>
              { task && <Link to={`/projects/${item.projectId}/tasks/${item.id}`}>{item.name}</Link>}
            </div>
          </div>
        </td>
        <td>
          <div className={cn(css.timeCell, css.filled)}>
            <input type="text" defaultValue="0.25"/>
            <span className={cn(css.toggleComment, css.checked)}>
              <SingleComment/>
            </span>
          </div>
        </td>
        <td>
          <div className={cn(css.timeCell, css.filled)}>
            <input type="text" defaultValue="0.25"/>
            <span className={css.toggleComment}>
              <SingleComment/>
            </span>
          </div>
        </td>
        <td className={cn(css.today)}>
          <div>
            <div className={cn(css.timeCell, css.filled)}>
              <input type="text" defaultValue="0.25"/>
              <span className={css.toggleComment}>
                <SingleComment/>
              </span>
            </div>
          </div>
        </td>
        <td>
          <div className={cn(css.timeCell)}>
            <input type="text" placeholder="0"/>
            <span className={css.toggleComment}>
              <SingleComment/>
            </span>
          </div>
        </td>
        <td>
          <div className={cn(css.timeCell)}>
            <input type="text" placeholder="0"/>
            <span className={css.toggleComment}>
              <SingleComment/>
            </span>
          </div>
        </td>
        <td className={cn(css.weekend)}>
          <div className={cn(css.timeCell)}>
            <input type="text" placeholder="0"/>
            <span className={css.toggleComment}>
              <SingleComment/>
            </span>
          </div>
        </td>
        <td className={cn(css.weekend)}>
          <div className={cn(css.timeCell)}>
            <input type="text" placeholder="0"/>
            <span className={css.toggleComment}>
              <SingleComment/>
            </span>
          </div>
        </td>
        <td className={cn(css.total, css.totalRow)}>
          <div>
            <div>
              0.75
            </div>
            <div className={css.toggleComment}>
              <TotalComment/>
            </div>
          </div>
        </td>
        <td className={cn(css.actions)}>
          <div className={css.deleteTask} data-tip="Удалить">
            <IconClose/>
          </div>
        </td>
      </tr>
    );
  }
}

export default ActivityRow;
