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
    this.setState({visible: false});
  }

  showCard = () => {
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
                {user.fullNameRu &&
                <div className={css.name}>
                  {user.fullNameRu}
                </div>}
                {user.name && 
                <div className={css.meta}>
                  <span><IconSkype/></span>
                  <span><a href={`skype:${user.skype}?add`}>{user.skype}</a></span>
                </div>}
                {user.emailPrimary && 
                <div className={css.meta}>
                  <span><IconMail/></span>
                  <span><a href={`mailto:${user.emailPrimary}`}>{user.emailPrimary}</a></span>
                </div>}
                {user.mobile && 
                <div className={css.meta}>
                  <span><IconPhone/></span>
                  <span><a href={`tel:${user.mobile}`}>{user.mobile}</a></span>
                </div>}
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
