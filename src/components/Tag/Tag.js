import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Tag.scss';
import { IconPlus, IconClose } from '../Icons';
import { deleteTag } from '../../actions/Tags';
import { connect } from 'react-redux';
import ReactTooltip from 'react-tooltip';

class Tag extends React.Component {
  static propTypes = {
    blocked: PropTypes.bool,
    create: PropTypes.bool,
    dataTip: PropTypes.string,
    deleteHandler: PropTypes.func,
    deleteTag: PropTypes.func.isRequired,
    deleteTagModal: PropTypes.func,
    name: PropTypes.string,
    noRequest: PropTypes.bool,
    onClick: PropTypes.func,
    taggable: PropTypes.string,
    taggableId: PropTypes.number,
    unclickable: PropTypes.bool,
    user: PropTypes.object
  };

  componentDidMount = () => {
    ReactTooltip.rebuild();
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

  isExternalUser = () => this.props.user.globalRole === 'EXTERNAL_USER';

  clickOnTag = () => {
    if (this.props.onClick) this.props.onClick(this.props.name);
  };

  render() {
    const { name, create, blocked, unclickable, dataTip } = this.props;
    const isExternal = this.isExternalUser();
    return (
      <span
        className={classnames({
          [css.tag]: true,
          [css.create]: create,
          [css.unclickable]: unclickable
        })}
        data-tip={dataTip}
        onClick={this.clickOnTag}
      >
        <span className={classnames({ [css.tagPart]: true, [css.tagCreate]: create, [css.noClosable]: isExternal })}>
          {create ? <IconPlus /> : name}
        </span>
        {create || isExternal ? null : (
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

const mapStateToProps = state => ({
  user: state.Auth.user
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tag);
