import React, { Component, PropTypes } from 'react';
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Col } from 'react-flexbox-grid/lib/index';
import DocumentListItem from './DocumentListItem';

export default class DocumentList extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  };

  render() {
    const { data } = this.props;

    return (
      <Col xs>
        <List>
          <Subheader>Документы</Subheader>
          {Object.keys(data).map(key => {
            return (<DocumentListItem key={key}
              title={data[key].title}
              format={data[key].format}
              type={data[key].type} />);
          })}
        </List>
      </Col>
    );
  }
}
