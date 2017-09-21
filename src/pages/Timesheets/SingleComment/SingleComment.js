import React from 'react';
import cn from 'classnames';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from '../Timesheets.scss';
import { IconComment, IconCheck } from '../../../components/Icons';

class SingleComment extends React.Component {
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
        <IconComment onClick={this.toggle}/>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.isOpen
            ? <div className={cn(css.commentDropdown, css.singleComment)}>
                <textarea autoFocus placeholder="Введите текст комментария" />
                <div onClick={this.toggle} className={css.saveBtn}>
                  <IconCheck/>
                </div>
              </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default SingleComment = onClickOutside(SingleComment);