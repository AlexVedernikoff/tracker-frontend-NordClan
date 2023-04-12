import React, { ReactElement } from 'react';

type Props = {
  title: string;
  className: string;
  children: ReactElement;
}

export const InputWrapper = (data: Props) => (
    <div className={data.className} data-title={data.title}>
      {data.children}
    </div>
  );
