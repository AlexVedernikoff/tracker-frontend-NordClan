import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as css from './ExternalUsersTableHeader.scss';
import classnames from 'classnames';
import { connect } from 'react-redux';
import localize from './ExternalUsersTableHeader.json';

class ExternalUsersTableHeader extends Component {
  static propTypes = {
    lang: PropTypes.string
  };

  render() {
    const { lang } = this.props;
    return (
      <div className={css.TableHeader}>
        <div className={classnames(css.TableCell, css.TableCellName)}>{localize[lang].USERNAME}</div>
        <div className={classnames(css.TableCell, css.TableCellLogin)}>E-mail</div>
        <div className={classnames(css.TableCell, css.TableCellDesc)}>{localize[lang].DESCRIPTION}</div>
        <div className={classnames(css.TableCell, css.TableCellActivity)}>{localize[lang].ACTIVITY}</div>
        <div className={classnames(css.TableCell, css.TableCellDate)}>{localize[lang].ACTIVE_TO}</div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

export default connect(
  mapStateToProps,
  null
)(ExternalUsersTableHeader);
