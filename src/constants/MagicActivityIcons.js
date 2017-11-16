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


const getIcon = function (id, style) {
  const maIcons = {
    1: <IconLaptop style={style}/>,
    2: <IconCall style={style}/>,
    3: <IconCheckList style={style}/>,
    4: <IconBook style={style}/>,
    5: <IconPlane style={style}/>,
    6: <IconCase style={style}/>,
    7: <IconHospital style={style}/>,
    8: <IconOrganization style={style}/>
  };

  let icon = maIcons[id];
  if (!icon) icon = <IconLaptop style={style}/>;
  return icon;
};

export default getIcon;
