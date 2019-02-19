import React from 'react';
import { Value } from 'react-select';
import '../SelectDropdown.css';

export default props => (
  <div title={props.value.label} className="Select-custom-value">
    <Value {...props} />
  </div>
);
