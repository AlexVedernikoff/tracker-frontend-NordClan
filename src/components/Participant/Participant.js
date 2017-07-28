import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import * as css from './Participant.scss';
import {IconClose} from '../Icons';
import { Row, Col } from 'react-flexbox-grid/lib/index';
import Checkbox from '../../components/Checkbox';
import {connect} from 'react-redux';
import { unbindUserToProject } from '../../actions/Project';

class Participant extends React.Component {
  unbindUser = () => {
    this.props.unbindUserToProject(
      this.props.projectId,
      this.props.user.id
    );
  };
  render () {
    const {
      user,
      ...other
    } = this.props;

    return (
      <Row className={css.memberRow}>
        <Col xs={3}>
          <div className={classnames(css.cell, css.memberColumn)}>
            {user.fullNameRu}
          </div>
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
              onClick={this.unbindUser}
            />
          </Row>
        </Col>
      </Row>
    );
  }
}

Participant.propTypes = {
  projectId: PropTypes.number,
  unbindUserToProject: PropTypes.func.isRequired,
  user: PropTypes.object
};

const mapDispatchToProps = {
  unbindUserToProject
};

export default connect(null, mapDispatchToProps)(Participant);
