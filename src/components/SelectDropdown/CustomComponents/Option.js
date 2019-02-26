import React from 'react';
import { Option } from 'react-select';
import '../SelectDropdown.css';

export default props => (
  <div title={props.option.label}>
    <Option {...props} />
  </div>
);
