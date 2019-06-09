import React, { Component } from 'react';
import classnames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import shortId from 'shortid';
import { connect } from 'react-redux';
import {
  getCommentsByTask,
  publishComment,
  editComment,
  removeComment,
  updateCurrentCommentText,
  selectParentCommentForReply,
  setCommentForEdit,
  resetCurrentEditingComment,
  setCurrentCommentExpired,
  setHighLighted,
  uploadAttachments,
  removeAttachment
} from '../../../actions/Task';
import * as css from './Comments.scss';
import Comment from './Comment';
import { history } from '../../../History';
import { IconSend, IconComments, IconClose } from '../../../components/Icons';
import ConfirmModal from '../../../components/ConfirmModal';
import localize from './Comments.json';
import Mentions from './Mentions/Mentions';
import FileUpload from '../../../components/FileUpload';
import InlineHolder from '../../../components/InlineHolder';
import { IconPreloader } from '../../../components/Icons';
import { getFullName } from '../../../utils/NameLocalisation';
import { isImage } from '../../../components/Attachments/Attachments';

import {
  prepairCommentForEdit,
  stringifyCommentForSend,
  replaceEnterSymbol
} from '../Comments/Mentions/mentionService';
import { routerPropTypes, withRouter } from 'react-router';
const ENTER = 13;

class Comments extends Component {
  static propTypes = {
    attachments: PropTypes.array,
    comments: PropTypes.array,
    currentComment: PropTypes.object,
    editComment: PropTypes.func,
    externalUsers: PropTypes.array,
    getCommentsByTask: PropTypes.func,
    highlighted: PropTypes.object,
    isCommentsReceived: PropTypes.bool,
    isProjectInfoReceiving: PropTypes.bool,
    isUploadingAttachment: PropTypes.bool,
    lang: PropTypes.string,
    location: PropTypes.object,
    params: PropTypes.object,
    projectUsers: PropTypes.array,
    publishComment: PropTypes.func,
    removeAttachment: PropTypes.func,
    removeComment: PropTypes.func,
    resetCurrentEditingComment: PropTypes.func,
    ...routerPropTypes,
    selectParentCommentForReply: PropTypes.func,
    setCommentForEdit: PropTypes.func,
    setCurrentCommentExpired: PropTypes.func,
    setHighLighted: PropTypes.func,
    taskId: PropTypes.number,
    updateCurrentCommentText: PropTypes.func,
    uploadAttachments: PropTypes.func,
    userId: PropTypes.number,
    users: PropTypes.array
  };

  static defaultProps = {
    projectUsers: [],
    externalUsers: []
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      commentToDelete: null,
      disabledBtn: true,
      resizeKey: shortId(),
      mentions: [],
      attachments: props.attachments,
      isAttachedToComment: false,
      isLeaveConfirmModalOpen: false
    };
  }

  componentWillMount() {
    this.props.getCommentsByTask(this.props.params.taskId);
  }

  componentDidMount = () => {
    if (this.props.location.hash === '#reply') {
      setTimeout(() => this.reply.focus());
    }

    this.context.router.setRouteLeaveHook(this.props.route, this.routerWillLeave);
    this.onBeforeUnload();
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.params.taskId !== this.props.params.taskId) {
      this.props.getCommentsByTask(nextProps.params.taskId);
    }
  }

  componentDidUpdate = prevProps => {
    if (this.props.location.hash === '#reply' && prevProps.location.hash !== '#reply') {
      setTimeout(() => {
        this.reply.focus();
        Comment.conditionalScroll(this.reply);
      });
      if (this.props.highlighted.id) {
        this.props.setHighLighted({});
      }
      return;
    }
    if (this.props.location.hash === '' && this.props.highlighted.id) {
      return this.props.setHighLighted({});
    }
    const commentHash = /\d+$/.exec(this.props.location.hash);
    if (commentHash) {
      const [commentId] = commentHash;

      if (this.props.highlighted.id !== +commentId && prevProps.highlighted.id !== +commentId) {
        const comment = this.props.comments.find(c => c.id === +commentId);
        if (comment) {
          return this.props.setHighLighted(comment);
        }
      } else if (
        this.props.highlighted.id &&
        this.props.highlighted.id !== +commentId &&
        prevProps.highlighted.id === +commentId
      ) {
        this.selectComment(this.props.highlighted.id);
      }
    }
    if (prevProps.attachments.length !== this.props.attachments.length && this.state.isAttachedToComment) {
      const attachments = this.props.attachments.map(item => {
        return { ...item, display: item.display ? item.display : false };
      });
      Object.keys(this.addedAttachments).forEach(key => {
        if (key) {
          attachments[key].display = true;
        }
      });
      let length = this.props.attachments.length;
      const prevLength = prevProps.attachments.length;
      while (length > prevLength) {
        attachments[length - 1].display = true;
        this.addedAttachments[length - 1] = { file: attachments[length - 1] };
        length--;
      }
      this.setState({ attachments: attachments, isAttachedToComment: false });
    }
    this.onBeforeUnload();
  };

  onBeforeUnload = () => {
    const cb = () => localize[this.props.lang].CONFIRM_LEAVE_PAGE;
    window.onbeforeunload = !this.state.disabledBtn ? cb : null;
  };

  routerWillLeave = nextLocation => {
    if (this.state.disabledBtn) {
      return true;
    }

    if (this.state.leaveConfirmed) {
      return true;
    }

    this.setState({
      isLeaveConfirmModalOpen: true,
      nextLocation: nextLocation.pathname,
      currentLocation: this.props.location.pathname
    });
    return false;
  };

  handleCloseLeaveConfirmModal = () => {
    this.setState({ isLeaveConfirmModalOpen: false }, () => {
      if (window.location.pathname !== this.state.currentLocation) {
        history.replace(this.state.currentLocation);
      }
    });
  };

  leaveConfirm = () => {
    this.setState({ leaveConfirmed: true, isLeaveConfirmModalOpen: false }, () => {
      history.push(this.state.nextLocation);
    });
  };

  handleClickOutside = () => {
    if (this.props.location.hash) {
      history.replace({ ...this.props.location, hash: '' });
    }
  };

  selectComment = id => {
    Comment.selectComment(id, this.props.location);
  };

  addedAttachments = [];

  prepareAttachmentsForEdit = ids => {
    const attachments = this.props.attachments.map(attachment => {
      return ids.indexOf(attachment.id) !== -1 ? { ...attachment, display: true } : { ...attachment, display: false };
    });
    this.setState({ attachments: attachments });
  };

  setCommentForEdit = (comment, attachmentIds) => {
    const editedComment = this.props.comments.find(c => c.id === comment.id);
    editedComment.text = this.replaceHTMLCharacters(editedComment.text);
    this.props.setCommentForEdit(editedComment).then(() => {
      this.setState({ resizeKey: shortId() });
    });
    if (attachmentIds) {
      this.prepareAttachmentsForEdit(attachmentIds);
    }
  };

  replaceHTMLCharacters = text => {
    const newText = text.replace(/<br>/g, '\n');
    return newText;
  };

  toggleBtn = evt => {
    this.setState({ disabledBtn: !evt.target.value || evt.target.value.trim() === '' });
  };

  getAttachmentIds = () => {
    const { attachments } = this.props;
    const attachmentIds = attachments.filter((item, key) => this.state.attachments[key].display).map(item => item.id);
    return attachmentIds.length ? JSON.stringify(attachmentIds) : null;
  };

  stashAttachments = () => {
    const { attachments } = this.state;
    const attachmentsToHide = attachments.map(item => {
      return { ...item, display: false };
    });
    this.setState({ attachments: attachmentsToHide });
  };

  publishComment = evt => {
    const newComment = { ...this.props.currentComment };
    newComment.text = stringifyCommentForSend(newComment.text, this.users);
    newComment.attachmentIds = this.state.attachments.length ? this.getAttachmentIds() : null;
    const { ctrlKey, keyCode } = evt;
    if (
      ((ctrlKey && keyCode === ENTER) || evt.button === 0) &&
      this.state.disabledBtn === false &&
      !this.props.isUploadingAttachment
    ) {
      if (newComment.id) {
        if (!Comment.isExpiredForUpdate(newComment.createdAt)) {
          this.props.editComment(this.props.taskId, newComment.id, newComment.text, newComment.attachmentIds);
        } else {
          this.props.setCurrentCommentExpired();
        }
      } else {
        newComment.text = replaceEnterSymbol(newComment.text);
        this.props.publishComment(this.props.taskId, newComment);
      }
      this.stashAttachments();
      this.setState({ disabledBtn: true });
    }
  };

  removeComment = commentId => {
    this.setState({ commentToDelete: commentId });
  };

  cancelRemoveComment = () => {
    this.setState({ commentToDelete: null });
  };

  confirmRemoveComment = () => {
    const commentId = this.state.commentToDelete;
    this.setState({ commentToDelete: null }, () => this.props.removeComment(this.props.taskId, commentId));
  };

  hanldeAttachedFiles = files => {
    this.setState({ isAttachedToComment: true, disabledBtn: false });
    this.props.uploadAttachments(this.props.taskId, files);
  };

  handleRemoveAttachment = (index, id) => {
    const attachments = this.state.attachments.map((item, key) => {
      if (index === key && this.addedAttachments[key]) {
        delete this.addedAttachments[key];
      }
      return index === key ? { ...item, display: false } : item;
    });
    this.props.removeAttachment(this.props.taskId, id);
    this.setState({ attachments: attachments, disabledBtn: !this.addedAttachments.filter(i => !!i).length });
  };

  getAttachment = (index, file) => {
    const attachment = this.props.attachments[index];
    if (attachment && !attachment.uploading && !attachment.deleting) {
      return (
        <li key={index} className={css.attachmentsItemWrap}>
          <a target="_blank" href={`/${attachment.path}`} onClick={e => this.handleAttachmentLinksClick(e, file)}>
            {attachment.fileName}
          </a>
          <IconClose
            className={css.removeAttachIcon}
            onClick={() => this.handleRemoveAttachment(index, attachment.id ? attachment.id : null)}
          />
        </li>
      );
    }
  };

  handleAttachmentLinksClick = (e, file) => {
    const { type, id } = file;
    if (!id || !isImage(type)) return;
    e.preventDefault();
    try {
      const attachment = document.querySelector(`[data-attachment-id='${id}']`);
      if (attachment) {
        attachment.click();
      }
    } catch (error) {
      console.log(error);
    }
  };

  get users() {
    return [
      { id: 'all', fullNameEn: localize.en.ALL, fullNameRu: localize.ru.ALL },
      ...this.props.projectUsers.map(u => u.user),
      ...this.props.externalUsers.map(u => u.user)
    ];
  }

  getTextAreaNode = node => {
    this.reply = node;
  };

  getCommentList = () => {
    return this.props.comments.map(comment => {
      return (
        <Comment
          key={comment.id} /*используются id чтобы правильно работал маунт и анмаунт*/
          lightened={comment.id === this.props.highlighted.id}
          editComment={this.setCommentForEdit}
          removeComment={this.removeComment}
          reply={this.props.selectParentCommentForReply}
          ownedByMe={comment.author.id === this.props.userId}
          comment={comment}
          users={this.users}
          attachments={this.props.attachments}
          prepareAttachmentsForEdit={this.prepareAttachmentsForEdit}
        />
      );
    });
  };

  allCommentsAreEmpty = () => {
    const allEmpty = this.props.comments.every(comment => {
      if (comment.text) {
        return false;
      }

      if (!comment.attachmentIds) {
        return true;
      }

      return !this.props.attachments.find(attachment => {
        return comment.attachmentIds.indexOf(attachment.id) !== -1;
      });
    });
    return allEmpty;
  };

  render() {
    const { lang, isCommentsReceived, isProjectInfoReceiving, isUploadingAttachment } = this.props;
    const withoutComments =
      isCommentsReceived && !isProjectInfoReceiving ? (
        <div className={css.noCommentsYet}>
          <div className={css.noCommentsIcon}>
            <IconComments />
          </div>
          {localize[lang].COMMENTS_IS_EXISTS}
          <br />
          {localize[lang].BE_FIRST}
        </div>
      ) : (
        <div className={css.commentPreloader}>
          <IconPreloader style={{ color: 'silver', fontSize: '4rem', marginRight: 10, float: 'left' }} />
          <InlineHolder length="40%" />
          <InlineHolder length="80%" />
          <InlineHolder length="30%" />
        </div>
      );
    const users = this.users.map(u => ({ id: u.id, display: getFullName(u) }));
    const isSendButtonDisabled = this.state.disabledBtn || isUploadingAttachment;
    return (
      <div className={css.comments}>
        <ul className={css.commentList}>
          <form className={css.answerLine}>
            <div className={css.answerLineText}>
              <Mentions
                suggestions={users}
                resizeKey={this.state.resizeKey}
                className={css.commentMentionsInput}
                disabled={this.props.currentComment.disabled || this.props.currentComment.expired}
                placeholder={localize[lang].ENTER_COMMENT}
                onKeyDown={this.publishComment}
                value={prepairCommentForEdit(this.props.currentComment.text, this.users)}
                updateCurrentCommentText={this.props.updateCurrentCommentText}
                toggleBtn={this.toggleBtn}
                onInput={this.typeComment}
                setMentions={this.setMentions}
                getTextAreaNode={this.getTextAreaNode}
              />
              {this.props.currentComment.id ? (
                <div className={css.answerInfo}>
                  {localize[lang].EDIT_COMMENT}
                  &nbsp;
                  {this.props.currentComment.expired ? (
                    <span className={css.outDatedToolTip}>
                      &nbsp;
                      {localize[lang].EXPIRED}
                      &nbsp;
                    </span>
                  ) : null}
                  <a onClick={() => this.selectComment(this.props.currentComment.id)}>
                    {`#${this.props.currentComment.id}`}
                  </a>
                  &nbsp;
                  <span className={css.quoteCancel} onClick={() => this.props.resetCurrentEditingComment()}>
                    {localize[lang].CANCEL}
                  </span>
                </div>
              ) : null}
              {this.props.currentComment.parentId && !this.props.currentComment.id ? (
                <div className={css.answerInfo}>
                  {localize[lang].ANSWER}
                  &nbsp;
                  <a onClick={() => this.selectComment(this.props.currentComment.parentId)}>
                    {`#${this.props.currentComment.parentId}`}
                  </a>
                  &nbsp;
                  <span className={css.quoteCancel} onClick={() => this.props.selectParentCommentForReply(null)}>
                    {localize[lang].CANCEL}
                  </span>
                </div>
              ) : null}
              <span
                data-tip={localize[lang].ATTACH}
                className={classnames({
                  [css.attachIcon]: true
                })}
              >
                <FileUpload onDrop={this.hanldeAttachedFiles} isMinimal />
              </span>
              <span
                onClick={!isSendButtonDisabled ? this.publishComment : null}
                data-tip={localize[lang].SEND}
                className={classnames({
                  [css.sendIcon]: true,
                  [css.disabled]: isSendButtonDisabled
                })}
              >
                <IconSend />
              </span>
            </div>
          </form>
          <div className={css.attachmentWrap}>
            {this.state.attachments.length ? (
              <ul>
                {this.state.attachments.map((item, index) => {
                  return item.display ? this.getAttachment(index, this.props.attachments[index]) : null;
                })}
              </ul>
            ) : null}
          </div>
          {this.props.comments.length && !this.allCommentsAreEmpty() ? this.getCommentList() : withoutComments}
        </ul>
        {this.state.isLeaveConfirmModalOpen ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].CONFIRM_LEAVE_PAGE}
            onCancel={this.handleCloseLeaveConfirmModal}
            onConfirm={this.leaveConfirm}
          />
        ) : null}
        {this.state.commentToDelete ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text={localize[lang].REMOVE_COMMENT}
            onCancel={this.cancelRemoveComment}
            onConfirm={this.confirmRemoveComment}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = ({
  Task: {
    task: { id: taskId, attachments },
    comments,
    currentComment,
    highlighted,
    isCommentsReceived,
    isUploadingAttachment
  },
  Auth: {
    user: { id: userId }
  },
  Project: {
    project: { users, projectUsers, externalUsers },
    isProjectInfoReceiving
  },
  Localize: { lang }
}) => ({
  taskId,
  attachments,
  comments,
  userId,
  currentComment,
  highlighted,
  lang,
  users,
  projectUsers,
  externalUsers,
  isCommentsReceived,
  isProjectInfoReceiving,
  isUploadingAttachment
});

const mapDispatchToProps = {
  getCommentsByTask,
  publishComment,
  editComment,
  removeComment,
  updateCurrentCommentText,
  selectParentCommentForReply,
  setCommentForEdit,
  removeAttachment,
  resetCurrentEditingComment,
  setCurrentCommentExpired,
  setHighLighted,
  uploadAttachments
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(onClickOutside(Comments)));
