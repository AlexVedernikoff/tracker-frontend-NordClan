import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import Tag from '../../../components/Tag';
import Tags from '../../../components/Tags';
import * as css from './Details.scss';

export default class Details extends React.Component {

  render () {
    const tags = this.props.task.tags.map((tag, i) => {
      return (
        <Tag key={i} name={tag}/>
      );
    });

    return (
      <div className={css.detailsBlock}>
        <table className={css.detailTable}>
          <tbody>
            <tr>
              <td>Проект:</td>
              <td>
                <Link to={'/projects/' + this.props.task.projectId}>{this.props.task.projectName}</Link>
              </td>
            </tr>
            <tr>
              <td>Спринт:</td>
              <td>
                <Link to="#">{this.props.task.sprint}</Link>
              </td>
            </tr>
            <tr>
              <td>Теги:</td>
              <td className={css.tags}>
                <Tags>{tags}</Tags>
              </td>
            </tr>
            <tr>
              <td>Автор:</td>
              <td>
                <Link to="#">{this.props.task.creator ? this.props.task.creator.name : ''}</Link>
              </td>
            </tr>
            <tr>
              <td>Исполнитель:</td>
              <td>
                <Link to="#">{this.props.task.owner ? this.props.task.owner.name : ''}</Link>
              </td>
            </tr>
            <tr>
              <td>Дата создания:</td>
              <td>
                28 мая 2016
              </td>
            </tr>
            <tr>
              <td>Запланировано:</td>
              <td>
                10 ч.
              </td>
            </tr>
            <tr>
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
