import React from 'react';

import {
  IconBook,
  IconLaptop,
  IconCall,
  IconPlane,
  IconCase,
  IconHospital,
  IconCheckList,
  IconOrganization
} from '../components/Icons';


const getIcon = function (id) {
  const maIcons = {
    1: <IconLaptop/>,
    2: <IconCall/>,
    3: <IconCheckList/>,
    4: <IconBook/>,
    5: <IconPlane/>,
    6: <IconCase/>,
    7: <IconHospital/>,
    8: <IconOrganization/>
  };

  let icon = maIcons[id];
  if (!icon) icon = <IconLaptop/>;
  return icon;
};

export default getIcon;
