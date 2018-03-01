import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tag.scss';
import { IconPlus, IconClose } from '../Icons';
import { deleteTag } from '../../actions/Tags';
import { connect } from 'react-redux';

class Tag extends React.Component {
  deleteTag = () => {
    if (this.props.deleteHandler) {
      this.props.deleteHandler();
    } else {
      this.props.deleteTag(this.props.name, this.props.taggable, this.props.taggableId);
    }
  };

  render() {
    const { name, create, blocked, taggable, taggableId, deleteHandler, deleteTag, ...other } = this.props;

    return (
      <span
        {...other}
        className={classnames({ [css.tag]: true, [css.create]: create })}
        onClick={() => {
          if (this.props.onClick) this.props.onClick(name);
        }}
      >
        <span className={classnames({ [css.tagPart]: true, [css.tagCreate]: create })}>
          {create ? <IconPlus /> : name}
        </span>
        {create ? null : (
          <span className={classnames(css.tagPart, css.tagClose)}>
            {blocked ? null : <IconClose onClick={this.deleteTag} />}
          </span>
        )}
      </span>
    );
  }
}

Tag.propTypes = {
  blocked: PropTypes.bool,
  create: PropTypes.bool,
  deleteHandler: PropTypes.func,
  deleteTag: PropTypes.func.isRequired,
  name: PropTypes.string,
  onClick: PropTypes.func,
  taggable: PropTypes.string,
  taggableId: PropTypes.number
};

const mapDispatchToProps = {
  deleteTag
};

export default connect(null, mapDispatchToProps)(Tag);
