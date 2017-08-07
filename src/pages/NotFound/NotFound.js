import React, { Component } from 'react';
import InnerContainer from '../InnerContainer';
import HttpError from '../../components/HttpError';

class NotFound extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return (
      <InnerContainer>
        <HttpError error={{status: 404, name: 'NotFoundError', message: 'Page Not Found'}}/>
      </InnerContainer>
    );
  }
}


export default NotFound;
