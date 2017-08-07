import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './UserCard.scss';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { IconSkype, IconMail, IconPhone } from '../Icons';

class UserCard extends React.Component {

  constructor (props) {
    super(props);
    this.state = {visible: false};
  }

  handleClickOutside = evt => {
    // console.log('close');
    this.setState({visible: false});
  }

  showCard = () => {
    // console.log('open', this.state.visible, this.props.id);
    this.setState({visible: true});
  }

  render () {
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       onClick: () => this.showCard()
     })
    );

    const {user} = this.props;

    return (
      <div className={css.wrapper}>
        {childrenWithProps}
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.visible
            ? <div className={css.userCard}>
              <div className={css.photoWrapper}>
                <img src={user.photo} alt=""/>
              </div>
              <div className={css.name}>
                {user.fullNameRu}
              </div>
              <div className={css.meta}>
                <span><IconSkype/></span>
                <span><a href={`skype:${user.skype}?add`}>{user.skype}</a></span>
              </div>
              <div className={css.meta}>
                <span><IconMail/></span>
                <span><a href={`mailto:${user.emailPrimary}`}>{user.emailPrimary}</a></span>
              </div>
              <div className={css.meta}>
                <span><IconPhone/></span>
                <span><a href={`tel:${user.mobile}`}>{user.mobile}</a></span>
              </div>
            </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
}

UserCard.propTypes = {
  children: PropTypes.object,
  user: PropTypes.object
};

export default onClickOutside(UserCard);
