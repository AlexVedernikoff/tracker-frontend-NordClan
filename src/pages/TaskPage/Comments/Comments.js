import React, { Component } from 'react';
import classnames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import shortId from 'shortid';
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
  setHighLighted
} from '../../../actions/Task';
import { connect } from 'react-redux';
import UserCard from '../../../components/UserCard/UserCard';
import * as css from './Comments.scss';
import Comment from './Comment';
import { history } from '../../../History';
import { IconSend, IconComments } from '../../../components/Icons';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import localize from './Comments.json';
import Mentions from './Mentions/Mentions';
import { getFullName } from '../../../utils/NameLocalisation';

const ENTER = 13;

class Comments extends Component {
  static propTypes = {
    comments: PropTypes.array,
    currentComment: PropTypes.object,
    editComment: PropTypes.func,
    externalUsers: PropTypes.array,
    getCommentsByTask: PropTypes.func,
    highlighted: PropTypes.object,
    lang: PropTypes.string,
    location: PropTypes.object,
    params: PropTypes.object,
    projectUsers: PropTypes.array,
    publishComment: PropTypes.func,
    removeComment: PropTypes.func,
    resetCurrentEditingComment: PropTypes.func,
    selectParentCommentForReply: PropTypes.func,
    setCommentForEdit: PropTypes.func,
    setCurrentCommentExpired: PropTypes.func,
    setHighLighted: PropTypes.func,
    taskId: PropTypes.number,
    updateCurrentCommentText: PropTypes.func,
    userId: PropTypes.number,
    users: PropTypes.array
  };

  static defaultProps = {
    projectUsers: [],
    externalUsers: []
  };

  constructor(props) {
    super(props);
    this.state = {
      commentToDelete: null,
      disabledBtn: true,
      resizeKey: shortId(),
      mentions: []
    };
  }

  componentWillMount() {
    this.props.getCommentsByTask(this.props.params.taskId);
  }

  componentDidMount = () => {
    if (this.props.location.hash === '#reply') {
      setTimeout(() => this.reply.focus());
    }
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
  };

  handleClickOutside = () => {
    if (this.props.location.hash) {
      history.replace({ ...this.props.location, hash: '' });
    }
  };

  selectComment = id => {
    Comment.selectComment(id, this.props.location);
  };

  setCommentForEdit = comment => {
    this.props.setCommentForEdit(this.props.comments.find(c => c.id === comment.id)).then(() => {
      this.setState({ resizeKey: shortId() });
    });
  };

  toggleBtn = evt => {
    this.setState({ disabledBtn: !evt.target.value || evt.target.value.trim() === '' });
  };

  publishComment = evt => {
    const newComment = { ...this.props.currentComment };
    const mentions = this.state.mentions;
    if (mentions && mentions.length) {
      newComment.text = this.replaceMentionWithId(newComment.text, mentions);
    }
    const { ctrlKey, keyCode } = evt;
    if (((ctrlKey && keyCode === ENTER) || evt.button === 0) && this.state.disabledBtn === false) {
      if (newComment.id) {
        if (!Comment.isExpiredForUpdate(newComment.createdAt)) {
          this.props.editComment(this.props.taskId, newComment.id, newComment.text);
        } else {
          this.props.setCurrentCommentExpired();
        }
      } else {
        this.props.publishComment(this.props.taskId, newComment);
      }
      this.state.disabledBtn = true;
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

  get users() {
    return [
      { id: 'all', fullNameEn: localize.en.ALL, fullNameRu: localize.ru.ALL },
      ...this.props.projectUsers.map(u => u.user),
      ...this.props.externalUsers.map(u => u.user)
    ];
  }

  getCommentList = () =>
    this.props.comments.map(comment => {
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
        />
      );
    });

  render() {
    const { lang } = this.props;
    return (
      <div className={css.comments}>
        <ul className={css.commentList}>
          <form className={css.answerLine}>
            <div className={css.answerLineText}>
              <Mentions
                resizeKey={this.state.resizeKey}
                style={{ minHeight: 32 }}
                className={css.resizeTrue}
                disabled={this.props.currentComment.disabled || this.props.currentComment.expired}
                placeholder={localize[lang].ENTER_COMMENT}
                onKeyDown={this.publishComment}
                ref={ref => (this.reply = ref ? ref.textarea : null)}
                value={this.props.currentComment.text}
                updateCurrentCommentText={this.props.updateCurrentCommentText}
                suggestions={this.users}
                toggleBtn={this.toggleBtn}
                onInput={this.typeComment}
                setMentions={this.setMentions}
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
                onClick={!this.state.disabledBtn ? this.publishComment : null}
                data-tip={localize[lang].SEND}
                className={classnames({
                  [css.sendIcon]: true,
                  [css.disabled]: this.state.disabledBtn
                })}
              >
                <IconSend />
              </span>
            </div>
          </form>
          {this.props.comments.length && this.props.users.length ? (
            this.getCommentList()
          ) : (
            <div className={css.noCommentsYet}>
              <div className={css.noCommentsIcon}>
                <IconComments />
              </div>
              {localize[lang].COMMENTS_IS_EXISTS}
              <br />
              {localize[lang].BE_FIRST}
            </div>
          )}
        </ul>
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
    task: { id: taskId },
    comments,
    currentComment,
    highlighted
  },
  Auth: {
    user: { id: userId }
  },
  Project: {
    project: { users, projectUsers, externalUsers }
  },
  Localize: { lang }
}) => ({
  taskId,
  comments,
  userId,
  currentComment,
  highlighted,
  lang,
  users,
  projectUsers,
  externalUsers
});

const mapDispatchToProps = {
  getCommentsByTask,
  publishComment,
  editComment,
  removeComment,
  updateCurrentCommentText,
  selectParentCommentForReply,
  setCommentForEdit,
  resetCurrentEditingComment,
  setCurrentCommentExpired,
  setHighLighted
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(onClickOutside(Comments));
