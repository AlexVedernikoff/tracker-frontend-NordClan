import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import TextareaAutosize from 'react-autosize-textarea';

import css from '../../Timesheets.scss';
import { IconComment, IconCheck } from '../../../../components/Icons';
import localize from './SingleComment.json';

class SingleComment extends React.Component<any, any> {
  static propTypes = {
    approved: PropTypes.bool,
    comment: PropTypes.string,
    disabled: PropTypes.bool,
    lang: PropTypes.string,
    onChange: PropTypes.func,
    rejected: PropTypes.bool,
    visible: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
      text: this.props.comment || ''
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ text: newProps.comment });
  }

  handleClickOutside = () => {
    this.setState({
      isOpen: false
    });
  };

  changeText = e => {
    this.setState({ text: e.target.value });
  };

  save = () => {
    this.props.onChange(this.state.text.trim());
    this.toggle();
  };

  saveWithEnter = evt => {
    const { ctrlKey, keyCode } = evt;
    if (ctrlKey && keyCode === 13) {
      this.props.onChange(this.state.text);
      this.toggle();
    }
  };

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  };

  render() {
    const { comment, disabled, rejected, approved, lang, visible } = this.props;

    return (
      <div>
        {visible ? (
          <IconComment
            className={cn({
              [css.filledComment]: comment,
              [css.rejected]: rejected,
              [css.approved]: approved
            })}
            onClick={this.toggle}
          />
        ) : null}

        <ReactCSSTransitionGroup
          transitionName="animatedElement"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.state.isOpen ? (
            <div className={cn({ [css.commentDropdown]: true, [css.singleComment]: true, [css.disabled]: disabled })}>
              {!disabled ? (
                <TextareaAutosize
                  autoFocus
                  placeholder={localize[lang].ENTER_COMMENT_TEXT}
                  onChange={this.changeText}
                  onKeyDown={this.saveWithEnter}
                  value={this.state.text || ''}
                />
              ) : (
                <TextareaAutosize
                  readOnly
                  value={comment}
                />
              )}
              {!disabled ? (
                <div onClick={this.save} className={css.saveBtn}>
                  <IconCheck />
                </div>
              ) : null}
            </div>
          ) : null}
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

export default onClickOutside(SingleComment);
