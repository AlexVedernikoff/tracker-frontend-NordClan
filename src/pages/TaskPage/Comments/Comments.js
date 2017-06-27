import React, { Component } from 'react';
import { Link } from 'react-router';

export default class Comments extends Component {

  render () {
    const css = require('./Comments.scss');
    return (
      <div className="css.comments">
        <ul className={css.commentList}>
          <li className={css.commentContainer}>
            <div className={css.comment}>
              <div className={css.ava}>
                <img src="http://lorempixel.com/56/56/people/" alt=""/>
              </div>
              <div className={css.commentBody}>
                <div className={css.commentMeta}><Link to="#">Автор Автор</Link>, 17.03.2016</div>
                <div className={css.commentText}>Лучше бы вложить их в один контейнер</div>
                <div className={css.commentAction}>
                  <Link to="#">Ответить</Link>
                </div>
              </div>
            </div>
          </li>
          <li className={css.commentContainer}>
            <div className={css.commentContainer}>
              <div className={css.comment}>
                <div className={css.ava}>
                  АЮ
                </div>
                <div className={css.commentBody}>
                  <div className={css.commentMeta}><Link to="#">Андрей Юдин</Link>, 17.03.2016</div>
                  <div className={css.commentText}>А вот в этом комментарии можно посмотреть как круто выглядит аватара с буквами вместо лица. Вот бы в жизни так было.</div>
                  <div className={css.commentAction}>
                    <Link to="#">Ответить</Link>
                  </div>
                </div>
              </div>
            </div>
            <ul className={css.commentList}>
              <li className={css.commentContainer}>
                <div className={css.comment}>
                  <div className={css.ava}>
                    МШ
                  </div>
                  <div className={css.commentBody}>
                    <div className={css.commentMeta}><Link to="#">Максим Шотландский</Link>, 17.03.2016</div>
                    <div className={css.commentText}>Это начало ветки комментариев. И вовь вы можете лицезреть аватарку из букв, в этот раз для примера я использовал другую пару символов</div>
                    <div className={css.commentAction}>
                      <Link to="#">Ответить</Link>
                    </div>
                  </div>
                </div>
              </li>
              <li className={css.commentContainer}>
                <div className={css.commentContainer}>
                  <div className={css.comment}>
                    <div className={css.ava}>
                      АЮ
                    </div>
                    <div className={css.commentBody}>
                      <div className={css.commentMeta}><Link to="#">Андрей Юдин</Link>, 17.03.2016</div>
                      <div className={css.commentText}>Просто комментарий</div>
                      <div className={css.commentAction}>
                        <Link to="#">Ответить</Link>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
    );
  }
}
