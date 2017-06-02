import React, {PropTypes} from 'react';
import { Link } from 'react-router';
import { IconPlus, IconLink } from '../../../components/Icons';

export default class RelatedTasks extends React.Component {

  render () {
    const css = require('./RelatedTasks.scss');

    const iconStyles = {
      width: 16,
      height: 16,
      color: 'inherit',
      fill: 'currentColor'
    };

    return (
      <div className={css.relatedTasks}>
        <h3>
          {
            this.props.type === 'related'
            ? 'Связанные задачи'
            : this.props.type === 'children'
            ? 'Подзадачи' : null
          }
        </h3>
        <ul className={css.taskList}>
          <li className={css.task}>
            <span className={css.taskLabel}>PPJ-56321</span>
            <Link to="#">UI: Add to gulp build tasks for css and js minification</Link>
          </li>
          <li className={css.task}>
            <span className={css.taskLabel}>PPJ-56322</span>
            <Link to="#">UI: Implement customisation of post/article header image</Link>
          </li>
          <li className={css.task}>
            <span className={css.taskLabel}>PPJ-56323</span>
            <Link to="#">Bug: Error in console after registering user with long email</Link>
          </li>
          <li className={css.task}>
            <span className={css.taskLabel}>PPJ-56324</span>
            <Link to="#">UI:Enhancements for "ineterests" field on users edit profile</Link>
          </li>
        </ul>
        <Link to="#" className={css.task + ' ' + css.add}>
          {
            this.props.type === 'related'
            ? <IconLink style={iconStyles} />
            : this.props.type === 'children'
            ? <IconPlus style={iconStyles} /> : null
          }
          <div className={css.tooltip}>
            {
              this.props.type === 'related'
              ? 'Связать с другой задачей'
              : this.props.type === 'children'
              ? 'Добавить подзадачу' : null
            }
          </div>
        </Link>
      </div>
    );
  }
}

RelatedTasks.propTypes = {
  task: PropTypes.object.isRequired,
  type: PropTypes.string.isRequired
};
