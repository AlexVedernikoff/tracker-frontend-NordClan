import React, { Component } from 'react';
import { Link } from 'react-router';
import classnames from 'classnames';
import onClickOutside from 'react-onclickoutside';

import TextArea from '../../../components/TextArea';
import Button from '../../../components/Button';
import {IconClose} from '../../../components/Icons';
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
  },
  {
    id: 5,
    parent: null,
    autorName: 'Андрей Юдин',
    autorId: 1,
    autorPic: null,
    date: '17.03.2016',
    text: 'Давно выяснено, что при оценке дизайна и композиции читаемый текст мешает сосредоточиться. Lorem Ipsum используют потому, что тот обеспечивает более или менее стандартное заполнение шаблона, а также реальное распределение букв и пробелов в абзацах, которое не получается при простой дубликации "Здесь ваш текст.. Здесь ваш текст.. Здесь ваш текст.." Многие программы электронной вёрстки и редакторы HTML используют Lorem Ipsum в качестве текста по умолчанию, так что поиск по ключевым словам "lorem ipsum" сразу показывает, как много веб-страниц всё ещё дожидаются своего настоящего рождения. За прошедшие годы текст Lorem Ipsum получил много версий. Некоторые версии появились по ошибке, некоторые - намеренно (например, юмористические варианты).'
  }
];

class Comments extends Component {

  constructor (props) {
    super(props);
    this.state = {selectedComment: {}, selectedQuote: null};
  }

  handleClickOutside = evt => {
    this.setState({selectedComment: {}});
  }

  selectComment = (id) => {
    const selectedComment = comments.filter((element) => {
      return element.id === id;
    });
    this.setState({selectedComment: selectedComment[0]});
  }

  selectQuote = (id) => {
    this.setState({selectedQuote: id});
    console.log(id);
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
              <div className={css.commentMeta}><Link to={`#${element.id}`}>{element.autorName}</Link>, {element.date}, <a onClick={() => this.selectComment(element.id)}>{`#${element.id}`}</a></div>
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
                <a onClick={() => this.selectQuote(element.id)}>Ответить</a>
              </div>
            </div>
          </div>
        </li>
      );
    });

    return (
      <div className="css.comments">
        <ul className={css.commentList}>
          <div className={css.answerLine}>
            <TextArea placeholder="Введите текст комментария"/>
            {/*<Button type="green" icon="IconSend" />*/}
            {
              this.state.selectedQuote
              ? <div className={css.answerInfo}>В ответ на комментарий <a onClick={() => this.selectComment(this.state.selectedQuote)}>{`#${this.state.selectedQuote}`}</a> <span className={css.quoteCancel} onClick={() => this.selectQuote(null)}>(Отмена)</span></div>
              : null
            }
          </div>
          {commentsList}
        </ul>
      </div>
    );
  }
}

export default onClickOutside(Comments);
