import React from 'react';
import { IconArrowLeft } from '../Icons';
import * as css from './GoBackHead.scss';

export default function(props) {
  const { text, action } = props;
  return (
    <div onClick={action} className={css.wrapper}>
      <IconArrowLeft />
      <span className={css.text}>{text}</span>
    </div>
  );
}
