import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './Comments.scss';
import { Link } from 'react-router';
import cn from 'classnames';
import moment from 'moment';
import { IconDeleteAnimate } from '../../../components/Icons';
import CopyThis from '../../../components/CopyThis';
import { history } from '../../../App';
import { connect } from 'react-redux';
import UserCard from '../../../components/UserCard';

const UPDATE_EXPIRATION_TIMEOUT = 10 * 60 * 1000;//10 минут

class Comment extends Component {
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

  static selectComment = (id, location) => {
    history.push(Comment.getHashedPath(id, location));
  };

  static getHashedPath = (id, location) => {
    return {...location, hash: Comment.getHash(id) };
  };

  static getHash = (id) => {
    return `#comment-${id}`;
  };

  static getDirectionToScroll = (elem) => {
    if (!elem) return;

    const rect = elem.getBoundingClientRect();

    if (rect.top < 50) {
      return true;
    }

    if (rect.bottom > ((window.innerHeight || document.documentElement.clientHeight) - 50)) {
      return false;
    }

    return null;
  };

  static propTypes = {
    comment: PropTypes.object,
    editComment: PropTypes.func,
    lightened: PropTypes.bool,
    location: PropTypes.object,
    ownedByMe: PropTypes.bool,
    removeComment: PropTypes.func,
    reply: PropTypes.func,
    selectComment: PropTypes.func
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

  static conditionalScroll = (elem) => {
    if (!elem) return;
    const direction = Comment.getDirectionToScroll(elem);
    if (direction !== null) {
      elem.scrollIntoView(direction);
    }
  };

  componentDidMount () {
    if (this.props.lightened) {
      Comment.conditionalScroll(this.refs.comment);
    }
  }

  componentDidUpdate () {
    if (this.props.lightened) {
      Comment.conditionalScroll(this.refs.comment);
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
              <UserCard user={author}>
                <Link>{fullName}</Link>
              </UserCard>,&nbsp;
              {moment(comment.updatedAt).format('DD.MM.YY HH:mm')},&nbsp;

              <CopyThis
                wrapThisInto={'a'}
                textToCopy={
                  `${location.origin}${history.createHref(Comment.getHashedPath(comment.id, this.props.location))}`
                }
              >
                {`#${comment.id}`}&nbsp;
              </CopyThis>
            </div>
            {
              parentComment
                ? <div
                    className={css.commentQuote}
                    onClick={() => Comment.selectComment(parentComment.id, this.props.location)}>
                  <a className={css.commentQuoteAutor}>
                    {Comment.getNames(parentComment.author).fullName},
                  </a>&nbsp;
                  <span className={css.commentQuoteDate}>
                    {moment(parentComment.updatedAt).format('DD.MM.YY HH:mm')}:
                  </span>
                  «<div className={css.quoteText}>{parentComment.text}</div>»
                </div>
                : null
            }
            <div className={css.commentText} onClick={() => Comment.selectComment(comment.id, this.props.location)}>
              {comment.text}
            </div>
            <div className={css.commentAction}>
              {
                !comment.deleting
                  ? <a onClick={() => this.props.reply(comment.id)} href="#reply">Ответить</a>
                  : null
              }
              {
                this.state.canBeUpdated
                && !comment.deleting
                  ? [
                    <a onClick={() => this.props.editComment(comment)} href="#reply" key={0}>Редактировать</a>,
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

const mapState = ({ routing: { locationBeforeTransitions: location } }) => ({
  location
});

export default connect(mapState)(Comment);
