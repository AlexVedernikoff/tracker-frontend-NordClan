import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tag.scss';
import {IconPlus, IconClose} from '../Icons';
import {DeleteTag} from '../../actions/Tags';
import {connect} from 'react-redux';

class Tag extends React.Component {
  tagDelete = () => {
    this.props.DeleteTag(
      this.props.name,
      this.props.taggable,
      this.props.taggableId
    );
  };

  render () {
    const {
      name,
      create,
      blocked,
      ...other
    } = this.props;

    return (
      <span {...other} className={classnames({[css.tag]: true, [css.create]: create})}>
      <span className={classnames({[css.tagPart]: true, [css.tagCreate]: create})}>{create ? <IconPlus/> : name}</span>
        { create ? null : <span className={classnames(css.tagPart, css.tagClose)}>
          { blocked ? null : <IconClose onClick={this.tagDelete}/> }
        </span>
        }
    </span>
    );
  }
}

Tag.propTypes = {
  DeleteTag: PropTypes.func.isRequired,
  blocked: PropTypes.bool,
  create: PropTypes.bool,
  name: PropTypes.string,
  taggable: PropTypes.string,
  taggableId: PropTypes.number
};

const mapDispatchToProps = {
  DeleteTag
};

export default connect(null, mapDispatchToProps)(Tag);
