import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Comments.scss';
import { Link } from 'react-router';
import cn from 'classnames';
import moment from 'moment';
import { IconDeleteAnimate } from '../../../components/Icons';

const UPDATE_EXPIRATION_TIMEOUT = 10 * 60 * 1000;//10 минут

export default class Comment extends Component {
  static propTypes = {
    comment: PropTypes.object,
    editComment: PropTypes.func,
    lightened: PropTypes.bool,
    ownedByMe: PropTypes.bool,
    removeComment: PropTypes.func
  };

  static getNames = (person) => {//унификация имени
    const { firstNameRu, lastNameRu, lastNameEn, firstNameEn } = person;
    const firstName = firstNameRu ? firstNameRu : firstNameEn;
    const lastName = lastNameRu ? lastNameRu : lastNameEn;
    const fullName = `${firstName} ${lastName}`;

    return { firstName, lastName, fullName };
  };

  static isExpiredForUpdate = (date) => {
    return Comment.getLifeTime(date) > UPDATE_EXPIRATION_TIMEOUT;
  };

  static getLifeTime = (date) => {
    return Date.now() - (new Date(date)).getTime();
  };

  constructor (props) {
    super(props);
    const { comment: { createdAt }, ownedByMe} = this.props;
    const lifeTime = Comment.getLifeTime(createdAt);
    const canBeUpdated = ownedByMe && !Comment.isExpiredForUpdate(createdAt);
    this.state = {
      canBeUpdated,
      timeoutId: canBeUpdated
        ? setTimeout(
          () => this.setState({ canBeUpdated: false, timeoutId: null }),
          UPDATE_EXPIRATION_TIMEOUT - lifeTime
        )
        : null
    };
  }

  componentDidMount () {
    if (this.props.lightened) {
      this.refs.comment.scrollIntoView();
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.lightened && !prevProps.lightened) {
      this.refs.comment.scrollIntoView();
    }
  }

  render () {
    const { comment: { author, parentComment }, comment } = this.props;
    let typoAvatar = '';
    const {firstName, lastName, fullName} = Comment.getNames(author);
    if (!author.photo) {
      typoAvatar = firstName.slice(0, 1) + lastName.slice(0, 1);
      typoAvatar.toLocaleUpperCase();
    }
    return (
      <li ref="comment"
        className={cn(css.commentContainer, {
          [css.selected]: this.props.lightened
        })}
      >
        <div className={css.comment}>
          <div className={css.ava}>
            {
              comment.deleting
                ? <IconDeleteAnimate/>
                : author.photo
                ? <img src={author.photo}/>
                : typoAvatar
            }
          </div>
          <div className={css.commentBody}>
            <div className={css.commentMeta}>
              <Link to={`#${comment.id}`}>{fullName}</Link>,&nbsp;
              {moment(comment.updatedAt).format('DD.MM.YY HH:mm')},&nbsp;
              <a onClick={() => this.selectComment(comment.id)} href={`#comment-${comment.id}`}>{`#${comment.id}`}</a>
            </div>
            {
              parentComment
                ? <div className={css.commentQuote} onClick={() => this.selectComment(parentComment.id)}>
                  <a className={css.commentQuoteAutor}>
                    {Comment.getNames(parentComment.author).fullName},
                  </a>&nbsp;
                  <span className={css.commentQuoteDate}>
                    {moment(parentComment.updatedAt).format('DD.MM.YY HH:mm')}:
                  </span>
                  «{parentComment.text}»
                </div>
                : null
            }
            <div className={css.commentText}>{comment.text}</div>
            <div className={css.commentAction}>
              {
                !comment.deleting
                  ? <a onClick={() => this.selectQuote(comment.id)} href={'#reply'}>Ответить</a>
                  : null
              }
              {
                this.state.canBeUpdated
                && !comment.deleting
                  ? [
                    <a onClick={() => this.props.editComment(comment)} key={0}>Редактировать</a>,
                    <a onClick={() => this.props.removeComment(comment.id)} key={1}>Удалить</a>
                  ]
                  : null
              }
            </div>
          </div>
        </div>
      </li>
    );
  }
}
