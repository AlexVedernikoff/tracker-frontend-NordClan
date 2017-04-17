import React, { PropTypes } from 'react';
import List from 'material-ui/List/List';
import Subheader from 'material-ui/Subheader/Subheader';
import { Col } from 'react-flexbox-grid/lib/index';
import DocumentListItem from './DocumentListItem';

const DocumentList = (props) => {
  const { data } = props;
  return (
    <Col xs>
      <List>
        <Subheader>Документы</Subheader>
        {Object.keys(data).map(key => (
          <DocumentListItem
            key={key}
            title={data[key].title}
            format={data[key].format}
            type={data[key].type}
          />
        ))}
      </List>
    </Col>
  );
};

DocumentList.propTypes = {
  data: PropTypes.object.isRequired
};

export default DocumentList;
