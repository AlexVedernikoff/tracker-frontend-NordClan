import React, { ReactElement } from 'react';
import styles from './Tooltip.module.scss';

interface Props {
  title: string;
  className?: string;
  children: ReactElement;
}

export const Tooltip = (data: Props) => (
  <div className={styles.tooltip + ' ' + data.className} data-title={data.title}>
    {data.children}
  </div>
);
