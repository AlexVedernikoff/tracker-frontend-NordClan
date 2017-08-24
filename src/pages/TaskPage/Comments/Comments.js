import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import moment from 'moment';
import { IconDeleteAnimate } from '../../../components/Icons';
import onClickOutside from 'react-onclickoutside';
import PropTypes from 'prop-types';
import TextArea from '../../../components/TextArea';
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

import { history } from '../../../App';

const ENTER = 13;

class Comments extends Component {

  constructor (props) {
    super(props);
  }

  componentWillMount () {
    this.props.getCommentsByTask(this.props.params.taskId);
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

  handleClickOutside = evt => {
    if (this.props.location.hash) {
      this.props.setHighLighted({});
      history.push({...this.props.location, hash: ''});
    }
  };

  selectComment = (id) => {
    const selectedComment = this.props.comments.find((element) => {
      return element.id === id;
    });
    this.props.setHighLighted(selectedComment);
  };

  selectQuote = (id) => {
    this.props.selectParentCommentForReply(id);
  };

  typeComment = (evt) => {
    this.props.updateCurrentCommentText(evt.target.value);
  };

  publishComment = (evt) => {
    const { ctrlKey, keyCode } = evt;

    if (ctrlKey && keyCode === ENTER) {
      if (this.props.currentComment.id) {
        if (!Comments.isExpired(this.props.currentComment.createdAt)) {
          this.props.editComment(this.props.taskId, this.props.currentComment.id, this.props.currentComment.text);
        } else {
          this.props.setCurrentCommentExpired();
        }
      } else {
        this.props.publishComment(this.props.taskId, this.props.currentComment);
      }
    }
  };

  reply = null;

  componentWillReceiveProps (nextProps) {
  }

  static getNames = (person) => {
    const { firstNameRu, lastNameRu, lastNameEn, firstNameEn } = person;
    const firstName = firstNameRu ? firstNameRu : firstNameEn;
    const lastName = lastNameRu ? lastNameRu : lastNameEn;
    const fullName = `${firstName} ${lastName}`;

    return { firstName, lastName, fullName };
  };

  static isExpired = (date) => {
    const EXPIRATION_TIMEOUT = 10 * 60 * 1000;
    return (Date.now() - (new Date(date)).getTime()) > EXPIRATION_TIMEOUT;
  };

  editComment = (comment) => {
    if (!Comments.isExpired(comment.createdAt)) {
      this.props.setCommentForEdit(comment);
    }
  };

  render () {
    const commentsList = this.props.comments.map((element) => {
      const { author } = element;
      let typoAvatar = '';
      const { firstName, lastName, fullName } = Comments.getNames(author);
      if (!author.photo) {
        typoAvatar = firstName.slice(0, 1) + lastName.slice(0, 1);
        typoAvatar.toLocaleUpperCase();
      }
      return (
        <li
          id={`comment-${element.id}`}
          className={classnames({
            [css.commentContainer]: true,
            [css.selected]: element.id === this.props.highlighted.id
          })}
          key={element.id}>
          <div className={css.comment}>
            <div className={css.ava}>
              {
                element.deleting
                  ? <IconDeleteAnimate />
                  : author.photo
                    ? <img src={author.photo}/>
                    : typoAvatar
              }
            </div>
            <div className={css.commentBody}>
              <div className={css.commentMeta}>
                <Link to={`#${element.id}`}>{fullName}</Link>,&nbsp;
                {moment(element.updatedAt).format('DD.MM.YY HH:mm')},&nbsp;
                <a onClick={() => this.selectComment(element.id)} href={`#comment-${element.id}`}>{`#${element.id}`}</a>
              </div>
              {
                element.parentComment
                ? <div className={css.commentQuote} onClick={() => this.selectComment(element.parentComment.id)}>
                  <a className={css.commentQuoteAutor}>
                    {Comments.getNames(element.parentComment.author).fullName},
                  </a>&nbsp;
                  <span className={css.commentQuoteDate}>
                    {moment(element.parentComment.updatedAt).format('DD.MM.YY HH:mm')}:
                  </span>
                  «{element.parentComment.text}»
                </div>
                : null
              }
              <div className={css.commentText}>{element.text}</div>
              <div className={css.commentAction}>
                {
                  !element.deleting
                    ? <a onClick={() => this.selectQuote(element.id)} href={'#reply'}>Ответить</a>
                    : null
                }
                {
                  element.authorId === this.props.userId
                    && !element.deleting
                    && !Comments.isExpired(element.createdAt)
                    ? [
                      <a onClick={() => this.editComment(element)} key={0}>Редактировать</a>,
                      <a onClick={() => !Comments.isExpired(element.createdAt) && this.props.removeComment(this.props.taskId, element.id)} key={1}>Удалить</a>
                    ]
                    : null
                }
              </div>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div className="css.comments" id="reply">
        <ul className={css.commentList}>
          <div className={css.answerLine}>
            <TextArea
              disabled={this.props.currentComment.disabled || this.props.currentComment.expired}
              placeholder="Введите текст комментария"
              onInput={this.typeComment}
              onKeyDown={this.publishComment}
              ref={(ref) => (this.reply = ref ? ref.refs.input : null)}
              value={this.props.currentComment.text}/>
            {/*<Button type="green" icon="IconSend" />*/}
            <div className={css.answerUnderline}>
              {
                this.props.currentComment.id
                  ? <div className={css.answerInfo}>
                    Редактирование комментария&nbsp;
                    {
                      this.props.currentComment.expired
                        ? <span className={css.outDatedToolTip}>&nbsp;истекло&nbsp;</span>
                        : null
                    }
                    <a onClick={() => this.selectComment(this.props.currentComment.id)}>
                      {`#${this.props.currentComment.id}`}
                    </a>&nbsp;
                    <span className={css.quoteCancel} onClick={() => this.props.resetCurrentEditingComment()}>
                      (Отмена)
                    </span>
                  </div>
                  : null
              }
              {
                this.props.currentComment.parentId && !this.props.currentComment.id
                  ? <div className={css.answerInfo}>
                    В ответ на комментарий&nbsp;
                    <a onClick={() => this.selectComment(this.props.currentComment.parentId)}>
                      {`#${this.props.currentComment.parentId}`}
                    </a>&nbsp;
                    <span className={css.quoteCancel} onClick={() => this.selectQuote(null)}>(Отмена)</span>
                  </div>
                  : null
              }
              <div className={css.answerSendTooltip}>отправить по Ctrl+Enter</div>
            </div>
          </div>
          {
            commentsList.length
              ? commentsList
              : <div className={css.noCommentsYet} >
                Комментариев еще нет!
                <br/>
                Вы можете стать первым
              </div>
          }
        </ul>
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
