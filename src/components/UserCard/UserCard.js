import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './UserCard.scss';
import onClickOutside from 'react-onclickoutside';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const user = {
  pic: 'http://lorempixel.com/200/200/people/',
  name: 'Андрей',
  surname: 'Юдин',
  skype: 'woody.just@gmail.com',
  email: 'woody.just@gmail.com',
  phone: '+79041862212'
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
            ? <div className={css.userCard}>{this.props.id}</div>
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
