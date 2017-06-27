import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './UserCard';
// import onClickOutside from 'react-onclickoutside';

const user = {
  pic: 'http://lorempixel.com/200/200/people/',
  name: 'Андрей',
  surname: 'Юдин',
  skype: 'woody.just@gmail.com',
  email: 'woody.just@gmail.com',
  phone: '+79041862212'
};

class UserCard extends React.Component {

  handleClickOutside = evt => {
    console.log('click');
  }

  render () {
    return (
      <div>
        {this.props.id}
      </div>
    );
  }
};

UserCard.propTypes = {
  id: PropTypes.number
};

// export default onClickOutside(UserCard);
export default UserCard;
