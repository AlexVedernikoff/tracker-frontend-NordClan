import React, { Component } from 'react';
import classnames from 'classnames';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import TextareaAutosize from 'react-autosize-textarea';
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
import * as css from './Comments.scss';
import Comment from './Comment';
import { history } from '../../../History';
import { IconSend, IconComments } from '../../../components/Icons';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';
import localize from './Comments.json';
import Mentions from './Mentions/Mentions';

const ENTER = 13;

class Comments extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentToDelete: null,
      disabledBtn: true,
      resizeKey: shortId()
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

  static propTypes = {
    comments: PropTypes.array,
    currentComment: PropTypes.object,
    editComment: PropTypes.func,
    getCommentsByTask: PropTypes.func,
    highlighted: PropTypes.object,
    location: PropTypes.object,
    params: PropTypes.object,
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

  handleClickOutside = evt => {
    if (this.props.location.hash) {
      history.replace({ ...this.props.location, hash: '' });
    }
  };

  selectComment = id => {
    Comment.selectComment(id, this.props.location);
  };

  setCommentForEdit = comment => {
    this.props.setCommentForEdit(comment).then(() => {
      this.setState({ resizeKey: shortId() });
    });
  };

  toggleBtn = evt => {
    if (evt.target.value && evt.target.value.trim() !== '') {
      this.setState(prevState => ({ ...prevState.disabledBtn, disabledBtn: false }));
    } else {
      this.setState(prevState => ({ ...prevState.disabledBtn, disabledBtn: true }));
    }
  };

  publishComment = evt => {
    const { ctrlKey, keyCode, shiftKey } = evt;
    if (((ctrlKey && keyCode === ENTER) || evt.button === 0) && this.state.disabledBtn === false) {
      if (this.props.currentComment.id) {
        if (!Comment.isExpiredForUpdate(this.props.currentComment.createdAt)) {
          this.props.editComment(this.props.taskId, this.props.currentComment.id, this.props.currentComment.text);
        } else {
          this.props.setCurrentCommentExpired();
        }
      } else {
        this.props.publishComment(this.props.taskId, this.props.currentComment);
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

  getCommentList = () =>
    this.props.comments.map(c => (
      <Comment
        key={c.id} /*используются id чтобы правильно работал маунт и анмаунт*/
        lightened={c.id === this.props.highlighted.id}
        editComment={this.setCommentForEdit}
        removeComment={this.removeComment}
        reply={this.props.selectParentCommentForReply}
        ownedByMe={c.author.id === this.props.userId}
        comment={c}
      />
    ));

  render() {
    const { lang } = this.props;

    return (
      <div className={css.comments}>
        <ul className={css.commentList}>
          <form className={css.answerLine}>
            <div className={css.answerLineText}>
              <Mentions
                key={this.state.resizeKey}
                style={{ minHeight: 32 }}
                className={css.resizeTrue}
                disabled={this.props.currentComment.disabled || this.props.currentComment.expired}
                placeholder={localize[lang].ENTER_COMMENT}
                onKeyDown={this.publishComment}
                ref={ref => (this.reply = ref ? ref.textarea : null)}
                value={this.props.currentComment.text}
                updateCurrentCommentText={this.props.updateCurrentCommentText}
                suggestions={this.props.users.map(user => user.fullNameEn)}
                toggleBtn={this.toggleBtn}
                onInput={this.typeComment}
              />
              {this.props.currentComment.id ? (
                <div className={css.answerInfo}>
                  {localize[lang].EDIT_COMMENT}&nbsp;
                  {this.props.currentComment.expired ? (
                    <span className={css.outDatedToolTip}>&nbsp;{localize[lang].EXPIRED}&nbsp;</span>
                  ) : null}
                  <a onClick={() => this.selectComment(this.props.currentComment.id)}>
                    {`#${this.props.currentComment.id}`}
                  </a>&nbsp;
                  <span className={css.quoteCancel} onClick={() => this.props.resetCurrentEditingComment()}>
                    {localize[lang].CANCEL}
                  </span>
                </div>
              ) : null}
              {this.props.currentComment.parentId && !this.props.currentComment.id ? (
                <div className={css.answerInfo}>
                  {localize[lang].ANSWER}&nbsp;
                  <a onClick={() => this.selectComment(this.props.currentComment.parentId)}>
                    {`#${this.props.currentComment.parentId}`}
                  </a>&nbsp;
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
          {this.props.comments.length ? (
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
  Task: { task: { id: taskId }, comments, currentComment, highlighted },
  Auth: { user: { id: userId } },
  Project: { project: { users: users } },
  Localize: { lang }
}) => ({
  taskId,
  comments,
  userId,
  currentComment,
  highlighted,
  lang,
  users
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

export default connect(mapStateToProps, mapDispatchToProps)(onClickOutside(Comments));
