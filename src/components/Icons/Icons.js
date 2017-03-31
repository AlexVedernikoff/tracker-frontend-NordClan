import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';

const AccountSwitch = (props) => (
  <SvgIcon {...props}>
    <path d="M16,9C18.33,9 23,10.17 23,12.5V15H17V12.5C17,11 16.19,9.89 15.04,9.05L16,9M8,9C10.33,9 15,10.17 15,12.5V15H1V12.5C1,10.17 5.67,9 8,9M8,7A3,3 0 0,1 5,4A3,3 0 0,1 8,1A3,3 0 0,1 11,4A3,3 0 0,1 8,7M16,7A3,3 0 0,1 13,4A3,3 0 0,1 16,1A3,3 0 0,1 19,4A3,3 0 0,1 16,7M9,16.75V19H15V16.75L18.25,20L15,23.25V21H9V23.25L5.75,20L9,16.75Z" />
  </SvgIcon>
);

const IconExitApp = (props) => (
  <SvgIcon {...props}>
    <path d="M0 0h24v24H0z" fill="none"/>
    <path d="M10.09 15.59L11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"/>
  </SvgIcon>
);

const IconPlus = (props) => (
  <SvgIcon {...props}>
    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
    <path d="M0 0h24v24H0z" fill="none"/>
  </SvgIcon>
);

export {AccountSwitch};
export {IconExitApp};
export {IconPlus};
