import React, { Component } from 'react';
import { Link } from 'react-router';

import * as css from './Comments.scss';

// Mocks
const comments = [
  {
    id: 1,
    parentId: null,
    autorName: 'Автор Автор',
    autorId: 1,
    autorPic: 'http://lorempixel.com/56/56/people/',
    date: '17.03.2016',
    text: 'Лучше бы вложить их в один контейнер'
  },
  {
    id: 2,
    parentId: null,
    autorName: 'Андрей Юдин',
    autorId: 1,
    autorPic: null,
    date: '17.03.2016',
    text: 'А вот в этом комментарии можно посмотреть как круто выглядит аватара с буквами вместо лица. Вот бы в жизни так было.'
  },
  {
    id: 3,
    parentId: null,
    autorName: 'Максим Шотландский',
    autorId: 1,
    autorPic: null,
    date: '17.03.2016',
    text: 'Это начало ветки комментариев. И вовь вы можете лицезреть аватарку из букв, в этот раз для примера я использовал другую пару символов'
  },
  {
    id: 4,
    parentId: null,
    autorName: 'Андрей Юдин',
    autorId: 1,
    autorPic: null,
    date: '17.03.2016',
    text: 'Просто комментарий'
  }
];


export default class Comments extends Component {

  render () {

    const commentsList = comments.map((element) => {
      console.log(element.autorPic);
      let typoAvatar = '';
      if (!element.autorPic) {
        const wordsArr = element.autorName.split(' ');
        wordsArr.forEach((string) => {
          typoAvatar = typoAvatar + string.slice(0, 1);
        });
        typoAvatar.toLocaleUpperCase();
      }
      return (
        <li className={css.commentContainer} key={element.id}>
          <div className={css.commentContainer}>
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
                <div className={css.commentText}>{element.text}</div>
                <div className={css.commentAction}>
                  <Link to="#">Ответить</Link>
                </div>
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
