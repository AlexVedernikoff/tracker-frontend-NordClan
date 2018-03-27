import React from 'react';
import * as css from './ExternalUsersTableHeader.scss';

const ExternalUsersTableHeader = () => (
  <div className={css.TableHeader}>
    <div className={css.TableCell}>Имя пользователя</div>
    <div className={css.TableCell}>E-mail</div>
    <div className={css.TableCell}>Активность</div>
    <div className={css.TableCell}>expiredDate</div>
  </div>
);
export default ExternalUsersTableHeader;
