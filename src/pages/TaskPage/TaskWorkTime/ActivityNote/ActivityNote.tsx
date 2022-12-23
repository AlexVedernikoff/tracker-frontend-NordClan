import React, {FC} from 'react';
import {connect} from 'react-redux';
import moment from 'moment';

import css from './ActivityNote.scss';
import localize from './ActivityNote.json';
import PropTypes from 'prop-types';
import {Photo} from '~/components/Photo';
import { Row, Col } from 'react-flexbox-grid/lib/index';

interface IActivityNoteProps {
  timesheet: any;
  lang: string;
  editActivity: (comment: any) => void;
  deleteActivity: (comment: any) => void;
  user: any
}

const ActivityNote: FC<IActivityNoteProps> = ({ timesheet, user, lang, editActivity, deleteActivity }) => {
  return (
    <div className={css.activityNote}>
      <Row middle='xs' className={css.row}>
        <Col xs={12} className={css.label}>
          <div className={css.avatar}>
            <Photo className={css.photoWrapper} user={timesheet.user} />
          </div>
          <div><b>{timesheet.user.full_name_ru}</b>{' ' + localize[lang].LABEL + ' - ' + moment(timesheet.onDate).format('DD.MM.YYYY')}</div>
        </Col>
      </Row>
      <Row className={css.row}>
        <Col xs={3}>{localize[lang].TIME_SPENT}</Col>
        <Col xs={7}>{timesheet.spentTime}</Col>
      </Row>
      <Row className={css.row}>
        <Col xs={3}>{localize[lang].COMMENT}</Col>
        <Col xs={7}>{timesheet.comment || '—'}</Col>
      </Row>
      {(user.id === timesheet.userId) && <Row className={css.row}>
        <Col xs={7} xsOffset={3}>
          <a className={css.action} onClick={() => editActivity(timesheet)}>Редактировать</a>
          <a className={css.action} onClick={() => deleteActivity(timesheet)}>Удалить</a>
        </Col>
      </Row>}
    </div>
  );
};

ActivityNote.propTypes = {
  deleteActivity: PropTypes.func.isRequired,
  editActivity: PropTypes.func.isRequired,
  lang: PropTypes.string.isRequired,
  timesheet: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  lang: state.Localize.lang,
  user: state.Auth.user
});

export default connect(mapStateToProps, null)(ActivityNote);
