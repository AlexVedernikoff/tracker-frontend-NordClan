import React, { Component, PropTypes } from 'react';
import { Col } from 'react-flexbox-grid/lib/index';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader/Subheader';
import ButtonChangeStatus from '../../ButtonChangeStatus/ButtonChangeStatus';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';


const priorityBgColor = {
  5: '#E0E0E0', // grey300
  4: '#BDBDBD', // grey400
  3: '#0097A7', // cyan700
  2: '#F06292', // pink300
  1: '#C2185B', // pink700
}

export default class Details extends Component {
  static propTypes = {
    status: PropTypes.string,
    priority: PropTypes.number,
    type: PropTypes.number,
    handleChangeType: PropTypes.func,
    handleChangePriority: PropTypes.func,
    handleChangeStatus: PropTypes.func
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      detailsText: {
        color: theme.rawTheme.palette.accent3Color
      }
    };
    return styles;
  }

  render() {
    const { status, priority, type } = this.props;
    const { handleChangeType, handleChangePriority, handleChangeStatus } = this.props;
    const styles = this.getStyles();
    const css = require('./details.scss');

    return (
      <Col xs>
        <div className={css.detailsBlock}>
          <List>
            <Subheader>Детали</Subheader>
            <ListItem
              disabled
              primaryText={
                <div style={styles.detailsText}>Статус</div>
              }
              rightIconButton={
                  <ButtonChangeStatus status={status} handleChangeStatus={handleChangeStatus}/>
              }
            />
            <ListItem
              disabled
              primaryText={<div style={styles.detailsText}>Тип задачи</div>}
              rightIconButton={
                <div className={css.detailsRight}>
                  <DropDownMenu className={css.detailsDD} value={type} onChange={handleChangeType} underlineStyle={{display: 'none'}}>
                    <MenuItem value={1} primaryText="Фича/Задача"/>
                    <MenuItem value={2} primaryText="Баг"/>
                    <MenuItem value={3} primaryText="Изменение ТЗ"/>
                    <MenuItem value={4} primaryText="Неучтенная задача"/>
                  </DropDownMenu>
                </div>
              }
            />
            <ListItem
              disabled
              primaryText={<div style={styles.detailsText}>Приоритет</div>}
              rightIconButton={
                <div className={css.detailsRight}>
                  <span className={css.detailsPriorityIco} style={{backgroundColor: priorityBgColor[priority]}}>{priority}</span>
                  <DropDownMenu className={css.detailsDD} value={priority} onChange={handleChangePriority} underlineStyle={{display: 'none'}}>
                    <MenuItem value={1} primaryText="Срочный"/>
                    <MenuItem value={2} primaryText="Высокий"/>
                    <MenuItem value={3} primaryText="Нормальный"/>
                    <MenuItem value={4} primaryText="Низкий"/>
                    <MenuItem value={5} primaryText="Незначительный"/>
                  </DropDownMenu>
                </div>
              }
            />
          </List>
        </div>
      </Col>
    );
  }
}
