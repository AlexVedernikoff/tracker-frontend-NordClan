import React, { Component } from 'react';
import * as css from './ExternalUsersTableRow.scss';
import PropTypes from 'prop-types';
import ExternalUserName from './ExternalUserName';
import ReactTooltip from 'react-tooltip';

class ExternalUsersTableRow extends Component {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    ReactTooltip.rebuild();
  }
  render() {
    return (
      <div className={css.TableHeader}>
        <div className={css.TableCell}>
          <ExternalUserName name={this.props.exUser.name} />
        </div>
        <div className={css.TableCell}>{this.props.exUser.email}</div>
        <div className={css.TableCell}>{this.props.exUser.isActive}</div>
        <div className={css.TableCell}>{this.props.exUser.expiredDate}</div>
      </div>
    );
  }
}
ExternalUsersTableRow.propTypes = {
  exUser: PropTypes.object
};
export default ExternalUsersTableRow;
