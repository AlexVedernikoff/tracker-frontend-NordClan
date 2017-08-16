import React, { Component } from 'react';
import Redirect from '../Redirect';
import HttpError from '../../components/HttpError';

class NotFound extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <Redirect>
        <HttpError error={{status: 404, name: 'NotFoundError', message: 'Page Not Found'}} whiteCentered/>
      </Redirect>
    );
  }
}


export default NotFound;
