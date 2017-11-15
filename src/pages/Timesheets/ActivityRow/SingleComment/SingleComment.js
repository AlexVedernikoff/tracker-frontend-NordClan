import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import * as css from '../../Timesheets.scss';
import { IconComment, IconCheck } from '../../../../components/Icons';

class SingleComment extends React.Component {
  static propTypes = {
    comment: PropTypes.string,
    onChange: PropTypes.func
  }

  constructor (props) {
    super(props);
    this.state = {
      isOpen: false,
      text: this.props.comment || ''
    };
  }

  componentWillReceiveProps (newProps) {
    this.setState({text: newProps.comment});
  }

  handleClickOutside = () => {
    this.setState({
      isOpen: false,
      text: this.props.comment || ''
    });
  }

  changeText = (e) => {
    this.setState({text: e.target.value});
  }

  save = () => {
    this.props.onChange(this.state.text);
    this.toggle();
  }

  saveWithEnter = (evt) => {
    const { ctrlKey, keyCode } = evt;
    if (ctrlKey && keyCode === 13) {
      this.props.onChange(this.state.text);
      this.toggle();
    }
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    const { comment } = this.props;

    return (
      <div>
        <IconComment className={cn({[css.filledComment]: comment})} onClick={this.toggle}/>
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.isOpen
            ? <div className={cn(css.commentDropdown, css.singleComment)}>
                <textarea
                autoFocus
                placeholder="Введите текст комментария"
                onChange={this.changeText}
                onKeyDown={this.saveWithEnter}
                value={this.state.text}
              />
                <div onClick={this.save} className={css.saveBtn}>
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

SingleComment = onClickOutside(SingleComment);

export default SingleComment;

