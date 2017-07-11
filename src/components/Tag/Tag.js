import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tag.scss';
import {IconPlus, IconClose} from '../Icons';
import {deleteTag} from '../../actions/Tags';
import {connect} from 'react-redux';

class Tag extends React.Component {
  render () {
    const {
      name,
      create,
      blocked,
      taggable,
      taggableId,
      deleteTag: dT,
      ...other
    } = this.props;

    return (
      <span {...other} className={classnames({[css.tag]: true, [css.create]: create})}>
      <span className={classnames({[css.tagPart]: true, [css.tagCreate]: create})}>{create ? <IconPlus/> : name}</span>
        { create ? null : <span className={classnames(css.tagPart, css.tagClose)}>
          { blocked ? null : <IconClose onClick={() => dT(name, taggable, taggableId)}/> }
        </span>
        }
    </span>
    );
  }
}

Tag.propTypes = {
  deleteTag: PropTypes.func.isRequired,
  blocked: PropTypes.bool,
  create: PropTypes.bool,
  name: PropTypes.string,
  taggable: PropTypes.string,
  taggableId: PropTypes.number
};

const mapDispatchToProps = {
  deleteTag
};

export default connect(null, mapDispatchToProps)(Tag);
