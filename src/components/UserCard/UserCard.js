import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './UserCard.scss';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { IconSkype, IconMail, IconPhone } from '../Icons';

const user = {
  1: {
    pic: 'http://lorempixel.com/200/200/people/',
    name: 'Анастасия Горшкова',
    skype: 'woody.just@gmail.com',
    email: 'woody.just@gmail.com',
    phone: '+79041862212'
  },
  2: {
    pic: 'http://lorempixel.com/200/200/people/',
    name: 'Максим Слепухов',
    skype: 'maxim.slepuchov',
    email: 'maxim.slepuchov@gmail.com',
    phone: '+7 904 186 22 12'
  },
  3: {
    pic: 'http://lorempixel.com/200/200/people/',
    name: 'Виктор Сычев ',
    skype: 'sychev.victor',
    email: 'victor.sychev@simbirsoft.com',
    phone: '+7 960 377 90 27'
  }
};

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

    return (
      <div className={css.wrapper}>
        {childrenWithProps}
        <ReactCSSTransitionGroup transitionName="animatedElement" transitionEnterTimeout={300} transitionLeaveTimeout={300}>
          {
            this.state.visible
            ? <div className={css.userCard}>
              <div className={css.photoWrapper}>
                <img src={user[this.props.id].pic} alt=""/>
              </div>
              <div className={css.name}>
                {user[this.props.id].name}
              </div>
              <div className={css.meta}>
                <span><IconSkype/></span>
                <span><a href={`skype:${user[this.props.id].skype}?add`}>{user[this.props.id].skype}</a></span>
              </div>
              <div className={css.meta}>
                <span><IconMail/></span>
                <span><a href={`mailto:${user[this.props.id].email}`}>{user[this.props.id].email}</a></span>
              </div>
              <div className={css.meta}>
                <span><IconPhone/></span>
                <span><a href={`tel:${user[this.props.id].phone}`}>{user[this.props.id].phone}</a></span>
              </div>
            </div>
            : null
          }
        </ReactCSSTransitionGroup>
      </div>
    );
  }
};

UserCard.propTypes = {
  children: PropTypes.object,
  id: PropTypes.number
};

export default onClickOutside(UserCard);
// export default UserCard;
