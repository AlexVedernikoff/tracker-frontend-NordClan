import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import * as css from './Details.scss';

export default class Details extends React.Component {

  render () {
    return (
      <div className={css.detailsBlock}>
        <table className={css.detailTable}>
          <tbody>
            <tr className={css.detailProject}>
              <td>Проект:</td>
              <td>
                <Link to="#">{this.props.task.projectName}</Link>
              </td>
            </tr>
            <tr className={css.detailProject}>
              <td>Спринт:</td>
              <td>
                <Link to="#">{this.props.task.sprint}</Link>
              </td>
            </tr>
            <tr className={css.detailProject}>
              <td>Автор:</td>
              <td>
                <Link to="#">{this.props.task.creator ? this.props.task.creator.name : ''}</Link>
              </td>
            </tr>
            <tr className={css.detailProject}>
              <td>Исполнитель:</td>
              <td>
                <Link to="#">{this.props.task.owner ? this.props.task.owner.name : ''}</Link>
              </td>
            </tr>
            <tr className={css.detailProject}>
              <td>Дата создания:</td>
              <td>
                28 мая 2016
              </td>
            </tr>
            <tr className={css.detailProject}>
              <td>Запланировано:</td>
              <td>
                10 ч.
              </td>
            </tr>
            <tr className={css.detailProject}>
              <td>Потрачено:</td>
              <td>
                <span className={css.alert}>100 ч.</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

Details.propTypes = {
  task: PropTypes.object.isRequired
};
