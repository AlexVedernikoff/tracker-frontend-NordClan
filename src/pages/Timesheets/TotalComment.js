import React from 'react';
import cn from 'classnames';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from './Timesheets.scss';
import { IconComments, IconCheckAll } from '../../components/Icons';

class TotalComment extends React.Component {
  static propTypes = {}

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleClickOutside = evt => {
    this.setState({
      isOpen: false
    });
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    return (
      <div>
        <IconComments onClick={this.toggle}/>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.isOpen
            ? <div className={cn(css.totalComment)}>
                <div>
                  <div className={css.totalCommentPart}>
                    <div className={css.commentDay}>
                      Пн.<br/>21.08
                    </div>
                    <textarea placeholder="Введите текст комментария" />
                  </div>
                  <div className={css.totalCommentPart}>
                    <div className={css.commentDay}>
                      Вт.<br/>22.08
                    </div>
                    <textarea placeholder="Введите текст комментария" />
                  </div>
                  <div className={css.totalCommentPart}>
                    <div className={css.commentDay}>
                      Ср.<br/>23.08
                    </div>
                    <textarea placeholder="Введите текст комментария" />
                  </div>
                </div>
                <div className={css.checkAll} onClick={this.toggle}>
                  <IconCheckAll/>
                </div>
              </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default TotalComment = onClickOutside(TotalComment);
