import React, { Component, PropTypes } from 'react';
import { Col } from 'react-flexbox-grid/lib/index';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import Subheader from 'material-ui/Subheader/Subheader';
import ButtonChangeStatus from '../../ButtonChangeStatus/ButtonChangeStatus';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

export default class Details extends Component {
  static propTypes = {
    status: PropTypes.string
  }

  static contextTypes = {
    muiTheme: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      dropDownIndex: 1
    };
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      detailsText: {
        color: theme.rawTheme.palette.accent3Color
      },
      detailsPriorityIco: {
        marginRight: '-10px',
        marginTop: '7px',
        borderRadius: '50%',
        color: theme.rawTheme.palette.canvasColor,
        backgroundColor: theme.rawTheme.palette.primary2Color,
        textShadow: '1px 1px 1px rgba(0, 0, 0, 0.15)',
        width: '20px',
        height: '20px',
        fontSize: '12px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      },
      detailsRight: {
        marginRight: '-10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }
    };
    return styles;
  }

  handleChangeDropDown = (event, index, value) => {
    this.setState({
      dropDownIndex: value,
    });
  };

  render() {
    const { status } = this.props;
    const styles = this.getStyles();
    const css = require('./details.scss');

    console.log('status', status);
    return (
      <Col xs>
        <div className={css.detailsBlock}>
          <List>
            <Subheader>Детали</Subheader>
            <ListItem
              disabled
              primaryText={
                <div className={css.detailsText} style={styles.detailsText}>Статус</div>
              }
              rightIconButton={
                  <ButtonChangeStatus className={css.detailsRight} status={status} />
              }
            />
            <ListItem
              disabled
              primaryText={<div style={styles.detailsText}>Тип задачи</div>}
              rightIconButton={
                <div style={styles.detailsRight}>
                  <DropDownMenu className={css.detailsDD} value={this.state.dropDownIndex} onChange={this.handleChangeDropDown} underlineStyle={{display: 'none'}}>
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
                <div style={styles.detailsRight}>
                  <span style={styles.detailsPriorityIco}>{this.state.dropDownIndex}</span>
                  <DropDownMenu className={css.detailsDD} value={this.state.dropDownIndex} onChange={this.handleChangeDropDown} underlineStyle={{display: 'none'}}>
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
