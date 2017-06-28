import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';

import * as css from './Comments.scss';

// Mocks
const comments = [
  {
    id: 1,
    parent: null,
    autorName: 'Автор Автор',
    autorId: 1,
    autorPic: 'http://lorempixel.com/56/56/people/',
    date: '17.03.2016',
    text: 'Лучше бы вложить их в один контейнер'
  },
  {
    id: 2,
    parent: {
      id: 3,
      parent: null,
      autorName: 'Максим Шотландский',
      autorId: 1,
      autorPic: null,
      date: '17.03.2016',
      text: 'Это начало ветки комментариев. И вовь вы можете лицезреть аватарку из букв, в этот раз для примера я использовал другую пару символов'
    },
    autorName: 'Андрей Юдин',
    autorId: 1,
    autorPic: null,
    date: '17.03.2016',
    text: 'А вот в этом комментарии можно посмотреть как круто выглядит аватара с буквами вместо лица. Вот бы в жизни так было.'
  },
  {
    id: 3,
    parent: null,
    autorName: 'Максим Шотландский',
    autorId: 1,
    autorPic: null,
    date: '17.03.2016',
    text: 'Это начало ветки комментариев. И вовь вы можете лицезреть аватарку из букв, в этот раз для примера я использовал другую пару символов'
  },
  {
    id: 4,
    parent: null,
    autorName: 'Андрей Юдин',
    autorId: 1,
    autorPic: null,
    date: '17.03.2016',
    text: 'Просто комментарий'
  }
];

export default class Comments extends Component {

  constructor (props) {
    super(props);
    this.state = {selectedComment: {}};
  }

  selectComment = (id) => {
    const selectedComment = comments.filter((element) => {
      return element.id === id;
    });
    this.setState({selectedComment: selectedComment[0]});
    console.log(selectedComment[0].id);
  }

  render () {

    const commentsList = comments.map((element) => {
      let typoAvatar = '';
      if (!element.autorPic) {
        const wordsArr = element.autorName.split(' ');
        wordsArr.forEach((string) => {
          typoAvatar = typoAvatar + string.slice(0, 1);
        });
        typoAvatar.toLocaleUpperCase();
      }
      return (
        <li className={classnames({[css.commentContainer]: true, [css.selected]: element.id === this.state.selectedComment.id})} key={element.id}>
          <div className={css.comment}>
            <div className={css.ava}>
              {
                element.autorPic
                ? <img src={element.autorPic}/>
                : typoAvatar
              }
            </div>
            <div className={css.commentBody}>
              <div className={css.commentMeta}><Link to={`#${element.id}`}>{element.autorName}</Link>, {element.date}</div>
              {
                element.parent
                ? <div className={css.commentQuote} onClick={() => this.selectComment(element.parent.id)}>
                  <a className={css.commentQuoteAutor}>{element.parent.autorName},</a>
                  <span className={css.commentQuoteDate}>{element.parent.date}:</span>
                  «{element.parent.text}»
                </div>
                : null
              }
              <div className={css.commentText}>{element.text}</div>
              <div className={css.commentAction}>
                <Link to="#">Ответить</Link>
              </div>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div className="css.comments">
        <ul className={css.commentList}>
          {commentsList}
        </ul>
      </div>
    );
  }
}
