import React, { FC } from 'react';
import ReactJoyride, { Props } from 'react-joyride';

/**
 * @description Дефолтный Pluggable-компонент для отображения шагов гайда
 */
const GuideStepper: FC<Props> = (props) => {
  return (
    <ReactJoyride
      {...props}
    />
  );
};

export default GuideStepper;
