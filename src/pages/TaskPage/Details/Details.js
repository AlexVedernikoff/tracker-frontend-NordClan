import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import ReactTooltip from 'react-tooltip';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import * as css from './Details.scss';
import moment from 'moment';

export default class Details extends React.Component {
  constructor (props) {
    super(props);
  }

  render () {
    const tags = this.props.task.tags.map((tag, i) => {
      return <Tag key={i} name={tag} />;
    });

    return (
      <div className={css.detailsBlock}>
        <table className={css.detailTable}>
          <tbody>
            <tr>
              <td>Проект:</td>
              <td>
                <Link to={'/projects/' + this.props.task.projectId}>
                  {this.props.task.projectName}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Спринт:</td>
              <td>
                <Link to="#">
                  {this.props.task.sprint}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Теги:</td>
              <td className={css.tags}>
                <Tags>
                  {tags}
                </Tags>
              </td>
            </tr>
            <tr>
              <td>Автор:</td>
              <td>
                <Link to="#">
                  {this.props.task.creator ? this.props.task.creator.name : ''}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Исполнитель:</td>
              <td>
                <Link to="#">
                  {this.props.task.owner ? this.props.task.owner.name : ''}
                </Link>
              </td>
            </tr>
            <tr>
              <td>Дата создания:</td>
              <td>
                {moment(this.props.task.createdAt).format('DD.MM.YYYY')}
              </td>
            </tr>
            {this.props.task.PlannedExecutionTime
              ? <tr>
                  <td>Запланировано:</td>
                  <td>
                    {`${this.props.task.PlannedExecutionTime} ч.`}
                  </td>
                </tr>
              : null}
            <tr>
              <td>Потрачено:</td>
              <td>
                <span
                  data-tip
                  data-place="right"
                  data-for="time"
                  className={classnames({
                    [css.alert]: true,
                    [css.factTime]: true
                  })}
                >
                  100 ч.
                </span>
              </td>
            </tr>
          </tbody>
        </table>
        <ReactTooltip id="time" aria-haspopup="true" className="tooltip">
          <div className={css.timeString}>
            <span>Develop:</span>
            <span>1 ч.</span>
          </div>
          <div className={css.timeString}>
            <span>Code Review:</span>27 ч.
          </div>
          <div className={css.timeString}>
            <span>QA:</span>59 ч.
          </div>
        </ReactTooltip>
      </div>
    );
  }
}

Details.propTypes = {
  task: PropTypes.object.isRequired
};
