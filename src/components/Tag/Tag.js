import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tag.scss';
import { IconPlus, IconClose } from '../Icons';
import { deleteTag } from '../../actions/Tags';
import { connect } from 'react-redux';

class Tag extends React.Component {
  static propTypes = {
    blocked: PropTypes.bool,
    create: PropTypes.bool,
    deleteHandler: PropTypes.func,
    deleteTag: PropTypes.func.isRequired,
    deleteTagModal: PropTypes.func,
    name: PropTypes.string,
    noRequest: PropTypes.bool,
    onClick: PropTypes.func,
    taggable: PropTypes.string,
    taggableId: PropTypes.number,
    unclickable: PropTypes.bool
  };

  deleteTag = () => {
    if (this.props.deleteHandler) {
      this.props.deleteHandler();
    } else if (this.props.noRequest) {
      this.props.deleteTagModal();
    } else {
      this.props.deleteTag(this.props.name, this.props.taggable, this.props.taggableId);
    }
  };

  clickOnTag = () => {
    if (this.props.onClick) this.props.onClick(this.props.name);
  };

  render() {
    const { name, create, blocked, unclickable } = this.props;

    return (
      <span
        className={classnames({
          [css.tag]: true,
          [css.create]: create,
          [css.unclickable]: unclickable
        })}
        onClick={this.clickOnTag}
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

const mapDispatchToProps = {
  deleteTag
};

export default connect(
  null,
  mapDispatchToProps
)(Tag);
