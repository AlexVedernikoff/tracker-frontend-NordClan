import React from 'react';
import PropTypes from 'prop-types';
import * as css from '../ProjectTimesheets.scss';
import Fragment from 'react-dot-fragment';

React.Fragment = React.Fragment || Fragment; // TODO: del on 16.4 upgrade

class UserRow extends React.Component {
  static propTypes = {
    items: PropTypes.array,
    user: PropTypes.object
  };

  constructor(props) {
    super(props);

    this.state = {
      isOpen: props.user.isOpen ? props.user.isOpen : false,
      user: props.user,
      activityRows: props.items
    };
  }

  componentWillReceiveProps(nextProps) {}

  render() {
    const { user, activityRows, isOpen } = this.state;

    const toggle = () => {
      this.setState({
        isOpen: !this.state.isOpen
      });
    };

    const rows = [];

    return (
      <React.Fragment>
        <tr className={css.taskRow} onClick={toggle}>
          <td colSpan={10}>
            <div className={css.taskCard}>
              <div className={css.meta}>
                {user.userName} {JSON.stringify(isOpen)}
              </div>
            </div>
          </td>
        </tr>
        {isOpen ? this.props.items : null}
      </React.Fragment>
    );
  }
}

export default UserRow;
