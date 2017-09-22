import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Link } from 'react-router';
import _ from 'lodash';
import moment from 'moment';
import SingleComment from './SingleComment';
import TotalComment from './TotalComment';
import * as css from '../Timesheets.scss';
import { IconClose } from '../../../components/Icons';

class ActivityRow extends React.Component {
  static propTypes = {
    item: PropTypes.object,
    ma: PropTypes.bool,
    statuses: PropTypes.array,
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

    const { item, task, ma, statuses } = this.props;
    const status = _.find(statuses, { 'id': item.statusId });
    const totalTime = _.sumBy(item.taskTimeSheets, tsh => { return +tsh.spentTime; });
    const timeCells = item.taskTimeSheets.map((tsh, i) => {
      if (tsh.id) {
        return (
          <td key={i} className={cn({
            [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
            [css.weekend]: i === 5 || i === 6
          })}>
            <div>
              <div className={cn({
                [css.timeCell]: true,
                [css.filled]: tsh.spentTime
              })}>
                <input type="text" defaultValue={
                  tsh.spentTime - Math.floor(tsh.spentTime)
                  ? Math.round(tsh.spentTime * 100) / 100
                  : Math.floor(tsh.spentTime)
                }/>
                <span className={css.toggleComment}>
                  <SingleComment comment={tsh.comment}/>
                </span>
              </div>
            </div>
          </td>
        );
      } else {
        return (
          <td key={i} className={cn({
            [css.today]: moment().format('YYYY-MM-DD') === moment(tsh.onDate).format('YYYY-MM-DD'),
            [css.weekend]: i === 5 || i === 6
          })}>
            <div>
              <div className={css.timeCell}>
                <input type="text" defaultValue="0"/>
                <span className={css.toggleComment}>
                  <SingleComment/>
                </span>
              </div>
            </div>
          </td>
        );
      }
    });

    return (
      <tr className={css.taskRow}>
        <td>
          <div className={css.taskCard}>
            <div className={css.meta}>
              <span>{item.projectName}</span>
              {status ? <span>{status.name}</span> : null}
            </div>
            <div>
              { task && <Link to={`/projects/${item.projectId}/tasks/${item.id}`}>{item.name}</Link>}
            </div>
          </div>
        </td>
        {timeCells}
        <td className={cn(css.total, css.totalRow)}>
          <div>
            <div>
             {totalTime}
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

const mapStateToProps = state => ({
  statuses: state.Dictionaries.taskStatuses
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ActivityRow);
