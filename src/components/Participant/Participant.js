import React from 'react';
import { Link } from 'react-router';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Participant.scss';
import {IconClose} from '../Icons';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Checkbox from '../../components/Checkbox';
import {deleteTag} from '../../actions/Tags';
import {connect} from 'react-redux';

class Participant extends React.Component {
  render () {
    const {
      user,
      ...other
    } = this.props;

    return (
      <Row className={css.memberRow}>
        <Col xs={3}>
          <Link to="/users/123">
            <div className={classnames(css.cell, css.memberColumn)}>
              {user.fullNameRu}
            </div>
          </Link>
        </Col>
        <Col xs={9}>
          <Row>
            <Col xs>
              <label className={css.cell}>
                <Checkbox />
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox />
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox />
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox />
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox />
              </label>
            </Col>
            <Col xs>
              <label className={css.cell}>
                <Checkbox />
              </label>
            </Col>
            <IconClose
              className={css.iconClose}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}

Participant.propTypes = {
  user: PropTypes.object
  // deleteTag: PropTypes.func.isRequired
};

const mapDispatchToProps = {
  deleteTag
};

export default connect(null, mapDispatchToProps)(Participant);
