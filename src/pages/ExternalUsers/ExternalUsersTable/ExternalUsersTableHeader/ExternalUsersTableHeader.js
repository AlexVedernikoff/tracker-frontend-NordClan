import React from 'react';
import * as css from './ExternalUsersTableHeader.scss';
import classnames from 'classnames';

const ExternalUsersTableHeader = () => (
  <div className={css.TableHeader}>
    <div className={classnames(css.TableCell, css.TableCellName)}>Имя пользователя</div>
    <div className={classnames(css.TableCell, css.TableCellLogin)}>E-mail</div>
    <div className={classnames(css.TableCell, css.TableCellActivity)}>Активность</div>
    <div className={classnames(css.TableCell, css.TableCellDate)}>Активен до</div>
  </div>
);
export default ExternalUsersTableHeader;
