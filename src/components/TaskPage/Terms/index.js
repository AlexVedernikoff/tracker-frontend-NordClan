import React, { Component, PropTypes } from 'react';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import { Col } from 'react-flexbox-grid/lib/index';
import DeadlineDate from '../../DeadlineDate/DeadlineDate';
import TaskProgressBar from '../../TaskProgressBar/TaskProgressBar';

export default class Terms extends Component {
  static propTypes = {
    css: PropTypes.object
  }
  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      timeDeadlineTitle: {
        color: theme.rawTheme.palette.primary3Color
      }
    };
    return styles;
  }
  render() {
    const { css } = this.props;
    const styles = this.getStyles();

    return (
      <Col xs>
        <div className={css.timeBlock}>
          <div className={css.timeHeader}>Сроки</div>
          <div className={css.timeDeadlineBlock}>
            <div>
              <div
                className={css.timeDeadlineTitle}
                style={styles.timeDeadlineTitle}
              >
                Потрачено/Запланировано
              </div>
              <TaskProgressBar spent={1000} planned={100} spentLabel={'Потрачено'} plannedLabel={'Планируемое'} />
            </div>
            <div>
              <div className={css.timeDeadlineTitle} style={styles.timeDeadlineTitle}>Релиз</div>
              <DeadlineDate date={0} />
            </div>
          </div>
          <List>
            <ListItem
              disabled
              primaryText={
                <div className={css.execPrimaryText}>
                  Спринт 1 <span className={css.execDate}>11 марта</span>
                </div>}
            />
            <ListItem
              disabled
              primaryText={
                <div className={css.execPrimaryText}>
                  Спринт 2 <span className={css.execDate}>25 марта</span>
                </div>}
            />
            <ListItem
              disabled
              primaryText={
                <div className={css.execPrimaryText}>
                  Спринт 3 <span className={css.execDate}>8 апреля</span>
                </div>}
            />
          </List>
        </div>
      </Col>
    );
  }
}
Terms.defaultProps = {
  css: require('./terms.scss')
};
