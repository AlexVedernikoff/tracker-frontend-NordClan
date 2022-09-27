import React from 'react';
import { Option } from '../../Select';

export default props => (
  <div title={props.option.label}>
    <Option {...props} />
  </div>
);
