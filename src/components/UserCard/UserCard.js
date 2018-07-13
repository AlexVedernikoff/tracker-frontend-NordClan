import React from 'react';
import PropTypes from 'prop-types';
import * as css from './UserCard.scss';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { IconSkype, IconMail, IconPhone } from '../Icons';
import { IconUser } from '../Icons';
import { getFullName } from '../../utils/NameLocalisation';

class UserCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: false };
  }

  handleClickOutside = () => {
    this.setState({ visible: false });
  };

  showCard = () => {
    this.setState({ visible: true });
  };

  render() {
    const childrenWithProps = React.Children.map(this.props.children, child =>
      React.cloneElement(child, {
        onClick: () => this.showCard()
      })
    );

    const { user } = this.props;

    const iconUserStyles = {
      width: 112,
      height: 112
    };

    return (
      <div className={css.wrapper}>
        {childrenWithProps}
        <ReactCSSTransitionGroup
          transitionName="animatedElement"
          transitionEnterTimeout={300}
          transitionLeaveTimeout={300}
        >
          {this.state.visible ? (
            <div className={css.userCard}>
              <div className={css.photoWrapper}>
                {user.photo ? <img src={user.photo} alt="" /> : <IconUser style={iconUserStyles} />}
              </div>
              {getFullName(user) && <div className={css.name}>{getFullName(user)}</div>}
              {user.skype && (
                <div className={css.meta}>
                  <span>
                    <IconSkype />
                  </span>
                  <span>
                    <a href={`skype:${user.skype}?add`}>{user.skype}</a>
                  </span>
                </div>
              )}
              {user.emailPrimary && (
                <div className={css.meta}>
                  <span>
                    <IconMail />
                  </span>
                  <span>
                    <a href={`mailto:${user.emailPrimary}`}>{user.emailPrimary}</a>
                  </span>
                </div>
              )}
              {user.mobile && (
                <div className={css.meta}>
                  <span>
                    <IconPhone />
                  </span>
                  <span>
                    <a href={`tel:${user.mobile}`}>{user.mobile}</a>
                  </span>
                </div>
              )}
            </div>
          ) : null}
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
