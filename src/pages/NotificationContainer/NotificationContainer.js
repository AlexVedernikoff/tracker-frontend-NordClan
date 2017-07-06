import React, { Component } from 'react';
import * as css from "./NotificationContainer.scss";
import Notification from "../../components/Notification";

class NotificationContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={css.NotificationContainer}>
        <Notification />
      </div>
    );
  }
}


export default NotificationContainer;
