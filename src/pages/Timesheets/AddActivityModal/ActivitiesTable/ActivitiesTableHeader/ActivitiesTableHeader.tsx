import React from 'react';
import classnames from 'classnames';
import { string } from 'prop-types';
import * as css from '../ActivitiesTable.scss';
import localize from './ActivitiesTableHeader.json';

const ActivitiesTableHeader = ({ lang }) => {
  return (
    <thead className={css.thead}>
      <tr className={css.tr}>
        <th className={classnames(css.th, css.index)}>№</th>
        <th className={classnames(css.th, css.name)}>{localize[lang].NAME}</th>
        <th className={classnames(css.th, css.project)}>{localize[lang].PROJECT}</th>
        <th className={classnames(css.th, css.sprint)}>{localize[lang].SPRINT}</th>
        <th className={classnames(css.th, css.small)}>{localize[lang].TAG}</th>
        <th className={classnames(css.th, css.status)}>{localize[lang].STATUS}</th>
      </tr>
    </thead>
  );
};

ActivitiesTableHeader.propTypes = {
  lang: string
};

export default ActivitiesTableHeader;
