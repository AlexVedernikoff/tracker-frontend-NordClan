import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import TextArea from '../../../components/TextArea';
import TextareaAutosize from 'react-autosize-textarea';
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
import Button from '../../../components/Button';
import * as Icons from '../../../components/Icons';
import ConfirmModal from '../../../components/ConfirmModal/ConfirmModal';

const ENTER = 13;

class Comments extends Component {
  constructor (props) {
    super(props);
    this.state = {
      commentToDelete: null,
      disabledBtn: true
    };
  }

  componentWillMount () {
    this.props.getCommentsByTask(this.props.params.taskId);
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.params.taskId !== this.props.params.taskId) {
      this.props.getCommentsByTask(nextProps.params.taskId);
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.location.hash === '#reply' && prevProps.location.hash === '#reply') {
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
    const commentHash = (/\d+$/).exec(this.props.location.hash);
    if (commentHash) {
      const [commentId] = commentHash;

      if (this.props.highlighted.id !== +commentId && prevProps.highlighted.id !== +commentId) {
        const comment = this.props.comments.find((c) => c.id === +commentId);
        if (comment) {
          return this.props.setHighLighted(comment);
        }
      } else if (
        this.props.highlighted.id
        && this.props.highlighted.id !== +commentId
        && prevProps.highlighted.id === +commentId
      ) {
        this.selectComment(this.props.highlighted.id);
      }
    }
  }
  componentDidMount () {
    if (this.props.location.hash === '#reply') {
      setTimeout(() => this.reply.focus());
    }
  }

  static defaultProps = {
    comments: []
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
    userId: PropTypes.number
  };

  handleClickOutside = (evt) => {
    if (this.props.location.hash) {
      history.replace({ ...this.props.location, hash: '' });
    }
  };

  selectComment = (id) => {
    Comment.selectComment(id, this.props.location);
  };

  typeComment = (evt) => {
    this.props.updateCurrentCommentText(evt.target.value);
    if (evt.target.value && evt.target.value.trim() !== '') {
      this.state.disabledBtn = false;
    } else {
      this.state.disabledBtn = true;
    }
  };

  publishComment = (evt) => {
    const { ctrlKey, keyCode } = evt;
    if ((ctrlKey && keyCode === ENTER) || (shiftKey && keyCode === ENTER)) {
      return this.props.updateCurrentCommentText(evt.target.value + '\n');
      console.log('true');
    }
    if ((evt.which === ENTER || evt.button === 0) && this.state.disabledBtn === false) {
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
  reply = null;

  removeComment = (commentId) => {
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
    this.props.comments.map((c) => (
      <Comment
        key={c.id} /*используются id чтобы правильно работал маунт и анмаунт*/
        lightened={c.id === this.props.highlighted.id}
        editComment={this.props.setCommentForEdit}
        removeComment={this.removeComment}
        reply={this.props.selectParentCommentForReply}
        ownedByMe={c.author.id === this.props.userId}
        comment={c}
      />
    ));

  render () {
    return (
      <div className="css.comments">
        <ul className={css.commentList}>
          <form className={css.answerLine}>
            <TextareaAutosize
              style={{ minHeight: 32 }}
              className={css.resizeTrue}
              disabled={this.props.currentComment.disabled || this.props.currentComment.expired}
              placeholder="Введите текст комментария"
              onInput={this.typeComment}
              onKeyDown={this.publishComment}
              ref={(ref) => (this.reply = ref ? ref.refs.input : null)}
              value={this.props.currentComment.text}
            />
            <div className={css.answerUnderline}>
              <button onClick={this.publishComment} disabled={this.state.disabledBtn}>
                <Icons.IconSend />
              </button>
              {this.props.currentComment.id ? (
                <div className={css.answerInfo}>
                  Редактирование комментария&nbsp;
                  {this.props.currentComment.expired ? (
                    <span className={css.outDatedToolTip}>&nbsp;истекло&nbsp;</span>
                  ) : null}
                  <a onClick={() => this.selectComment(this.props.currentComment.id)}>
                    {`#${this.props.currentComment.id}`}
                  </a>&nbsp;
                  <span className={css.quoteCancel} onClick={() => this.props.resetCurrentEditingComment()}>
                    (Отмена)
                  </span>
                </div>
              ) : null}
              {this.props.currentComment.parentId && !this.props.currentComment.id ? (
                <div className={css.answerInfo}>
                  В ответ на комментарий&nbsp;
                  <a onClick={() => this.selectComment(this.props.currentComment.parentId)}>
                    {`#${this.props.currentComment.parentId}`}
                  </a>&nbsp;
                  <span className={css.quoteCancel} onClick={() => this.props.selectParentCommentForReply(null)}>
                    (Отмена)
                  </span>
                </div>
              ) : null}
            </div>
            <div className={css.answerSendTooltip}>или Enter</div>
          </form>
          {this.props.comments.length ? (
            this.getCommentList()
          ) : (
            <div className={css.noCommentsYet}>Комментариев еще нет, Вы можете стать первым!</div>
          )}
        </ul>
        {this.state.commentToDelete ? (
          <ConfirmModal
            isOpen
            contentLabel="modal"
            text="Вы действительно хотите удалить комментарий?"
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
  Auth: { user: { id: userId } }
}) => ({
  taskId,
  comments,
  userId,
  currentComment,
  highlighted
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
