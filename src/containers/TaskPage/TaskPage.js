import React, {Component, PropTypes} from 'react';
import ReactDom from 'react-dom';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setCurrentTask, isCurrentTaskLoaded} from 'redux/modules/current_task';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import IconButton from 'material-ui/IconButton';
import Avatar from 'material-ui/Avatar';
import Tabs from 'material-ui/Tabs/Tabs';
import Tab from 'material-ui/Tabs/Tab';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { asyncConnect } from 'redux-async-connect';
import AppHead from '../../components/AppHead/AppHead';
import Typography from 'material-ui/styles/typography';
import { Link } from 'react-router';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

// Images
// import Slider from 'react-slick';

// Upload Files
import DropZone from '../../components/DropZone/DropZone';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import IconFrozen from 'material-ui/svg-icons/av/pause-circle-filled';
import IconRejected from 'material-ui/svg-icons/alert/error';
import IconAccepted from 'material-ui/svg-icons/action/check-circle';

import Helmet from 'react-helmet';
import DeadlineDate from '../../components/DeadlineDate/DeadlineDate';
import TaskProgressBar from '../../components/TaskProgressBar/TaskProgressBar';

import AttachFile from 'material-ui/svg-icons/editor/attach-file';
import DownloadFile from 'material-ui/svg-icons/file/file-download';
import CloudDownload from 'material-ui/svg-icons/file/cloud-download';
import NavCancel from 'material-ui/svg-icons/navigation/cancel';

import IconInProcess from 'material-ui/svg-icons/av/play-circle-filled';
import IconPaused from 'material-ui/svg-icons/toggle/radio-button-checked';
import IconCompleted from 'material-ui/svg-icons/action/check-circle';
import IconSeparatorDown from 'material-ui/svg-icons/navigation/expand-more';
import IconSeparatorUp from 'material-ui/svg-icons/navigation/expand-less';

// Animation
// import CSSTransitionGroup from 'react-addons-css-transition-group';

// import {FormattedDate} from 'react-intl';

@asyncConnect([{
  deferred: true,
  promise: ({store: {dispatch, getState}, params}) => {
    if (!isCurrentTaskLoaded(getState())) {
      return dispatch(setCurrentTask(params.taskId));
    }
  }
}])

@connect(
  state => ({task: state.currentTask.data})
)

export default class TaskPage extends Component {

  static propTypes = {
    task: PropTypes.shape({
      id: PropTypes.string.isRequired,
      idProj: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      creator: PropTypes.string.isRequired,
      owner: PropTypes.string.isRequired,
      // TODO не возвращается сервером
      isActive: PropTypes.bool,
      about: PropTypes.string,
      deadline: PropTypes.string,
      // TODO не используется
      attachments: PropTypes.array.isRequired,
      beginDate: PropTypes.number.isRequired,
      currentTime: PropTypes.number.isRequired,
      gainTime: PropTypes.number.isRequired,
      plannedTime: PropTypes.number.isRequired,
      priority: PropTypes.number.isRequired,
      type: PropTypes.string.isRequired,
      updateDate: PropTypes.number.isRequired
    }),
    params: PropTypes.object.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  }
  static defaultProps = {
    isActive: true,
    about: 'No about',
    deadline: 'No deadline',
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      slideIndex: 0,
      dropDownIndex: 1,

      // Executors component
      executorsExpand: true
    };
  }

  getStyles() {
    const theme = this.context.muiTheme;
    console.log(theme);
    const styles = {
      root: {
        // backgroundColor: theme.rawTheme.palette.backgroundColor,
        overflow: 'hidden',
      },
      wrapper: {
        marginTop: '120px'
      },
      main: {
        paddingRight: '5%'
      },
      sidebar: {

      },
      title: {
        color: theme.rawTheme.palette.primary1Color,
        fontWeight: Typography.fontWeightMedium,
        fontSize: '34px',
        paddingTop: 20,
        margin: 0
      },
      description: {
        fontSize: '14px',
        lineHeight: '1.6',
        margin: '0 0 80px'
      },
      info: {
        fontSize: '12px',
        color: theme.rawTheme.palette.accent3Color,
        marginBottom: '30px'
      },
      header: {
        fontSize: '16px',
        lineHeight: '48px',
        marginBottom: '14px',
        marginTop: '-1px'
      },
      nowrap: {
        whiteSpace: 'nowrap',
      },
      taglineWhenLarge: {
        marginTop: 32,
      },
      h1WhenLarge: {
        fontSize: 56,
      },
      tabsLabel: {
        backgroundColor: theme.rawTheme.palette.canvasColor
      },
      tabsLabelText: {
        color: Typography.textDarkBlack
      },
      tabInkBar: {
        backgroundColor: theme.rawTheme.palette.primary1Color
      },
      icon: {
        color: theme.rawTheme.palette.primary1Color
      },
      a: {
        color: theme.rawTheme.palette.primary1Color,
        textDecoration: 'none'
      },
      documents: {
        color: theme.rawTheme.palette.primary1Color,
        fontSize: '12px',
        lineHeight: '20px',
        textDecoration: 'none'
      },
      documentsExtensions: {
        color: theme.rawTheme.palette.primary3Color,
        fontSize: '12px',
        lineHeight: '20px'
      },
      documentsIcon: {
        fontSize: '12px',
        lineHeight: '20px',
        color: theme.rawTheme.palette.primary3ColorbackgroundColor
      },
      documentsIconContainer: {
        display: 'inline-block',
        width: '20%',
        height: '100%',
        verticalAlign: 'top',
        marginTop: '10'
      },
      documentsLabelContainer: {
        display: 'inline-block',
        width: '80%',
        height: '100%',
        verticalAlign: 'top'
      },
      documentsContainer: {
        marginBottom: '20'
      },
      FAB: {
        position: 'fixed',
        bottom: 35,
        right: 60
      },


      // Slider
      slider: {
        marginBottom: '40px'
      },
      sliderItem: {
        position: 'relative'
      },
      sliderItemImg: {
        height: '100%',
        width: '100%'
      },
      sliderRemoveBtn: {
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        fill: '#a5a5a5'
      },
      sliderRemoveIco: {
        cursor: 'pointer',
        fill: '#a5a5a5',
        border: '2px solid transparent',
        borderColor: theme.rawTheme.palette.backgroundColor,
        borderRadius: '50%',
        background: theme.rawTheme.palette.backgroundColor
      },

      // Upload
      uploadBlock: {

      },

      // Details
      detailsBlock: {
        marginBottom: '42px'
      },
      detailsList: {},
      detailsText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: theme.rawTheme.palette.accent3Color
      },
      detailsTextRigth: {
        color: theme.rawTheme.palette.textColor,
        display: 'flex',
        alignItems: 'center'
      },
      detailsPriorityIco: {
        marginRight: '-10px',
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
      detailsStatusIco: {
        marginRight: '-10px',
        fill: theme.rawTheme.palette.activeIcon
      },
      detailsMenuIco: {
        fill: theme.rawTheme.palette.accent3Color
      },
      detailsRight: {
        marginRight: '-10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      },
      detailsDD: {
        top: '-4px'
      },

      // Time block
      timeBlock: {
        marginBottom: '42px'
      },
      timeHeader: {
        color: 'rgba(0, 0, 0, 0.54)',
        fontSize: '14px',
        fontWeight: '500',
        lineHeight: '48px',
        paddingLeft: '16px'
      },
      timeDeadlineBlock: {
        padding: '0 16px',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
        marginTop: 15
      },
      timeDeadlineTitle: {
        color: theme.rawTheme.palette.primary3Color,
        fontSize: '14px',
        marginBottom: '20px'
      },

      // Document items styles
      docItem: {
        // lineHeight: '24px',
        // marginLeft: '-23px;',
        // marginRight: '-17px',
        // background: '#f5f5f5'
      },
      testStyle: {
        textDecoration: 'underline'
      },
      docItemLeftIco: {
        // fill: Typography.textDarkBlack
      },
      docItemRightIco: {
        fill: theme.rawTheme.palette.accent3Color
      },
      docItemWrap: {
        // overflow: 'hidden'
      },

      // Executors styles
      execBlock: {
        position: 'relative'
      },
      execWrap: {
        maxHeight: '560px',
        overflowY: 'hidden',
        transition: 'all 800ms cubic-bezier(0, 1, 0.5, 1)'
      },
      execWrapExpand: {
        maxHeight: '248px'
      },
      execLine: {
        position: 'absolute',
        top: '-16px',
        left: '27px',
        height: '32px',
        width: '1px',
        backgroundColor: theme.rawTheme.palette.borderColor
      },
      execList: {
        // marginBottom: 42
      },
      execItem: {
        position: 'relative',
        backgroundColor: theme.rawTheme.palette.backgroundColor
      },
      execPrimaryText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      execIconActive: {
        fill: theme.rawTheme.palette.activeIcon
      },
      execDate: {
        textAlign: 'right'
      },
      execSeparator: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        position: 'relative',
        paddingTop: '24px',
        marginBottom: '42px'
      },
      execSeparatorLine: {
        height: '1px',
        width: '100%',
        backgroundColor: theme.rawTheme.palette.borderColor
      },
      execSeparatorBtn: {
        position: 'absolute',
        top: 0,
        left: '50%',
        marginLeft: '-24px',
        backgroundColor: theme.rawTheme.palette.backgroundColor
      }
    };
    return styles;
  }

  handleChangeTabs = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
  handleChangeDropDown = (event, index, value) => {
    this.setState({
      dropDownIndex: value,
    });
  };
  handleSliderRemoveItem = () => {
    console.log('Remove slider item');
  };
  handleMouseEnter = () => {};
  handleMouseLeave = () => {};
  handleTouchTap = (event) => {
    console.log('event.target', event.target);
    console.log('DOWNLOAD attached file', event.target.id);
  };
  handleRemoveDocItem = (event) => {
    console.log('REMOVE attached file', event.target.id);
  };
  handleExecutorsExpand = () => {
    this.setState({
      executorsExpand: !this.state.executorsExpand
    });
    console.log('Expand', this.state.executorsExpand);
  };

  render() {
    const styles = this.getStyles();

    const {task} = this.props;

    const grid = require('./TaskPage.scss');

    const listItemRemoveIcon = (
      <IconButton tooltip="Удалить" tooltipPosition="bottom-right" onClick={this.handleRemoveDocItem}>
        <NavCancel style={styles.docItemRightIco}/>
      </IconButton>
    );

    // const sliderSettings = {
    //   dots: true,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: 3,
    //   slidesToScroll: 1,
    //
    //   arrows: true,
    //   adaptiveHeight: true,
    //   draggable: true,
    //   lazyLoad: true,
    // };

    return (
      <div id="task-page">
        <AppHead/>
        <Helmet title="Task"/>
        <Grid fluid className={grid.layout}>
          <div style={styles.wrapper}>
            <Row>
              <Col xs={12}>
                <h1 style={styles.title}>{task.id} {task.name}</h1>
                <p style={styles.info}>
                  <Link to="#" style={styles.a}> {task.idProj}</Link>, создал(а)
                  <Link to="#" style={styles.a}> {task.creator}</Link> 28 мая 2016, выполнит -
                  <Link to="#" style={styles.a}> {task.owner}</Link>
                </p>
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <main style={styles.main}>
                  <div style={styles.header}>Описание</div>
                  <p style={styles.description}>{task.about}</p>
                  <div style={styles.header}>Изображения</div>

                  {/*
                  <Slider {...sliderSettings}>
                    <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                    <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                    <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                    <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                    <img style={styles.sliderItemImg} src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                  </Slider>
                  */}
                  <div style={styles.slider}>
                    <Row between="sm">
                      <Col sm={3}>
                        <div style={styles.sliderItem}>
                          <img style={styles.sliderItemImg}
                               src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                          <div style={styles.sliderRemoveBtn}>
                            <NavCancel style={styles.sliderRemoveIco}
                              onClick={this.handleSliderRemoveItem}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div style={styles.sliderItem}>
                          <img style={styles.sliderItemImg}
                               src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                          <div style={styles.sliderRemoveBtn}>
                            <NavCancel style={styles.sliderRemoveIco}
                              onClick={this.handleSliderRemoveItem}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div style={styles.sliderItem}>
                          <img style={styles.sliderItemImg}
                               src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                          <div style={styles.sliderRemoveBtn}>
                            <NavCancel style={styles.sliderRemoveIco}
                              onClick={this.handleSliderRemoveItem}
                            />
                          </div>
                        </div>
                      </Col>
                      <Col sm={3}>
                        <div style={styles.sliderItem}>
                          <img style={styles.sliderItemImg}
                               src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                          <div style={styles.sliderRemoveBtn}>
                            <NavCancel style={styles.sliderRemoveIco}
                              onClick={this.handleSliderRemoveItem}
                            />
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </div>
                  <div style={styles.uploadBlock}>
                    <DropZone />
                  </div>

                  <Row>
                    <Tabs
                      onChange={this.handleChangeTabs}
                      value={this.state.slideIndex}
                      tabItemContainerStyle={styles.tabsLabel}
                      inkBarStyle={styles.tabInkBar}
                    >
                      <Tab label="Комментарии" value={0} style={styles.tabsLabelText}>
                        <List>
                          <ListItem
                            leftAvatar={<Avatar src="" />}
                            primaryText="Brendan Lim"
                            secondaryText={
                          <p>
                            I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                          </p>
                        }
                            secondaryTextLines={2}
                            key={1}
                          />
                          <ListItem
                            leftAvatar={<Avatar src="" />}
                            primaryText="Scott Jennifer"
                            secondaryText={
                          <p>Wish I could come, but I&apos;m out of town this weekend.</p>
                        }
                            secondaryTextLines={2}
                            initiallyOpen
                            key={2}
                            nestedItems={[
                              <ListItem
                                leftAvatar={<Avatar src="" />}
                                primaryText="Brendan Lim"
                                secondaryText={
                                  <p>
                                    I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                                  </p>
                                }
                                secondaryTextLines={2}
                              />,
                              <ListItem
                                leftAvatar={<Avatar src="" />}
                                primaryText="Scott Jennifer"
                                secondaryText={
                                  <p>Wish I could come, but I&apos;m out of town this weekend.</p>
                                }
                                secondaryTextLines={2}
                                key={1}
                                nestedItems={[
                                  <ListItem
                                    leftAvatar={<Avatar src="" />}
                                    primaryText="Brendan Lim"
                                    secondaryText={
                                      <p>
                                        I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
                                      </p>
                                    }
                                    secondaryTextLines={2}
                                  />,
                                  <ListItem
                                    leftAvatar={<Avatar src="" />}
                                    primaryText="Scott Jennifer"
                                    key={2}
                                    secondaryText={
                                      <p>Wish I could come, but I&apos;m out of town this weekend.</p>
                                    }
                                    secondaryTextLines={2}
                                  />
                                ]}
                              />
                            ]}
                          />
                        </List>
                      </Tab>
                      <Tab label="История" value={1} style={styles.tabsLabelText}/>
                    </Tabs>
                  </Row>
                </main>
              </Col>
              <Col xs={4}>
                <aside style={styles.sidebar}>
                  <Row>
                    <Col xs>
                      <div style={styles.detailsBlock}>
                        <List subheader="Детали" style={styles.detailsList}>
                          <ListItem
                            disabled
                            primaryText={
                              <div style={styles.detailsText}>Статус
                                {/* <span style={styles.detailsTextRigth}>
                                  <IconInProcess style={styles.detailsStatusIco}/>
                                  в процессе
                                </span> */}
                              </div>
                            }
                            rightIconButton={
                              <div style={styles.detailsRight}>
                                <IconInProcess style={styles.detailsStatusIco}/>
                                <DropDownMenu style={styles.detailsDD} value={this.state.dropDownIndex} onChange={this.handleChangeDropDown} underlineStyle={{display: 'none'}}>
                                  <MenuItem value={1} primaryText="Новый" leftIcon={<IconInProcess style={styles.detailsMenuIco}/>} />
                                  <MenuItem value={2} primaryText="Назначен" leftIcon={<IconInProcess style={styles.detailsMenuIco}/>} />
                                  <MenuItem value={3} primaryText="В процессе" leftIcon={<IconInProcess style={styles.detailsMenuIco}/>} />
                                  <MenuItem value={4} primaryText="Готов" leftIcon={<IconAccepted style={styles.detailsMenuIco}/>} />
                                  <MenuItem value={5} primaryText="Остановлен" leftIcon={<IconFrozen style={styles.detailsMenuIco}/>} />
                                  <MenuItem value={6} primaryText="Отменен" leftIcon={<IconRejected style={styles.detailsMenuIco}/>} />
                                </DropDownMenu>
                              </div>
                            }
                          />
                          <ListItem
                            disabled
                            primaryText={
                              <div style={styles.detailsText}>Тип задачи
                                {/* <span style={styles.detailsTextRigth}>Фича/Задача</span> */}
                              </div>
                            }
                            rightIconButton={
                              <div style={styles.detailsRight}>
                                <DropDownMenu style={styles.detailsDD} value={this.state.dropDownIndex} onChange={this.handleChangeDropDown} underlineStyle={{display: 'none'}}>
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
                            primaryText={
                              <div style={styles.detailsText}>Приоритет
                                {/* <span style={styles.detailsTextRigth}>
                                  <span style={styles.detailsPriorityIco}>3</span>
                                  Avierage
                                </span> */}
                              </div>
                            }
                            rightIconButton={
                              <div style={styles.detailsRight}>
                                <span style={styles.detailsPriorityIco}>{this.state.dropDownIndex}</span>
                                <DropDownMenu style={styles.detailsDD} value={this.state.dropDownIndex} onChange={this.handleChangeDropDown} underlineStyle={{display: 'none'}}>
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
                        {/* <Divider/> */}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs>
                      <div style={styles.timeBlock}>
                        <div style={styles.timeHeader}>Сроки</div>
                        <div style={styles.timeDeadlineBlock}>

                          <div style={{}}>
                            <div style={styles.timeDeadlineTitle}>Потрачено/Запланировано</div>
                            <TaskProgressBar spent={1000} planned={100} spentLabel={'Потрачено'} plannedLabel={'Планируемое'}/>
                          </div>

                          <div style={{}}>
                            <div style={styles.timeDeadlineTitle}>Релиз</div>
                            <DeadlineDate date={0}/>

                          </div>

                        </div>
                        <List style={styles.execList}>
                          <ListItem
                            disabled
                            primaryText={<div style={styles.execPrimaryText}>Спринт 1 <span style={styles.execDate}>11 марта</span></div>}
                          />
                          <ListItem
                            disabled
                            primaryText={<div style={styles.execPrimaryText}>Спринт 2 <span style={styles.execDate}>25 марта</span></div>}
                          />
                          <ListItem
                            disabled
                            primaryText={<div style={styles.execPrimaryText}>Спринт 3 <span style={styles.execDate}>8 апреля</span></div>}
                          />
                        </List>
                        {/* <Divider/> */}
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs>
                      <div style={styles.execBlock}>
                        <div style={
                          this.state.executorsExpand ?
                          Object.assign({}, styles.execWrap, styles.execWrapExpand) :
                          Object.assign({}, styles.execWrap, {maxHeight: ReactDom.findDOMNode(this.refs.executorsList).offsetHeight})
                        }>
                          <List ref="executorsList" subheader="Исполнители" style={styles.execList}>
                            <ListItem
                              // disabled={true}
                              disabled
                              style={styles.execItem}
                              primaryText={<div style={styles.execPrimaryText}>Иватина Ирина <span style={styles.execDate}>12 апреля</span></div>}
                              secondaryText={<div><span>js - разработчик</span></div>}
                              secondaryTextLines={1}
                              leftIcon={<IconInProcess style={styles.execIconActive}/>}
                              onMouseEnter={this.handleMouseEnter}
                              onMouseLeave={this.handleMouseLeave}
                              onTouchTap={this.handleTouchTap}
                            />
                            <ListItem
                              disabled
                              style={styles.execItem}
                              primaryText={<div style={styles.execPrimaryText}>Иватина Ирина <span style={styles.execDate}>10 апреля</span></div>}
                              secondaryText={<div><span style={styles.execLine}></span><span>js - разработчик</span></div>}
                              secondaryTextLines={1}
                              leftIcon={<IconPaused style={styles.docItemLeftIco}/>}
                              onMouseEnter={this.handleMouseEnter}
                              onMouseLeave={this.handleMouseLeave}
                              onTouchTap={this.handleTouchTap}
                            />
                            <ListItem
                              disabled
                              style={styles.execItem}
                              primaryText={<div style={styles.execPrimaryText}>Иватина Ирина <span style={styles.execDate}>24 марта</span></div>}
                              secondaryText={<div><span style={styles.execLine}></span><span>js - разработчик</span></div>}
                              secondaryTextLines={1}
                              leftIcon={<IconPaused style={styles.docItemLeftIco}/>}
                              onMouseEnter={this.handleMouseEnter}
                              onMouseLeave={this.handleMouseLeave}
                              onTouchTap={this.handleTouchTap}
                            />
                            <ListItem
                              disabled
                              style={styles.execItem}
                              primaryText={<div style={styles.execPrimaryText}>Иватина Ирина <span style={styles.execDate}>21 марта</span></div>}
                              secondaryText={<div><span style={styles.execLine}></span><span>js - разработчик</span></div>}
                              secondaryTextLines={1}
                              leftIcon={<IconPaused style={styles.docItemLeftIco}/>}
                              onMouseEnter={this.handleMouseEnter}
                              onMouseLeave={this.handleMouseLeave}
                              onTouchTap={this.handleTouchTap}
                            />
                            <ListItem
                              disabled
                              style={styles.execItem}
                              primaryText={<div style={styles.execPrimaryText}>Иватина Ирина <span style={styles.execDate}>21 марта</span></div>}
                              secondaryText={<div><span style={styles.execLine}></span><span>js - разработчик</span></div>}
                              secondaryTextLines={1}
                              leftIcon={<IconPaused style={styles.docItemLeftIco}/>}
                              onMouseEnter={this.handleMouseEnter}
                              onMouseLeave={this.handleMouseLeave}
                              onTouchTap={this.handleTouchTap}
                            />
                            <ListItem
                              disabled
                              style={styles.execItem}
                              primaryText={<div style={styles.execPrimaryText}>Иватина Ирина <span style={styles.execDate}>21 марта</span></div>}
                              secondaryText={<div><span style={styles.execLine}></span><span>js - разработчик</span></div>}
                              secondaryTextLines={1}
                              leftIcon={<IconPaused style={styles.docItemLeftIco}/>}
                              onMouseEnter={this.handleMouseEnter}
                              onMouseLeave={this.handleMouseLeave}
                              onTouchTap={this.handleTouchTap}
                            />
                            <ListItem
                              disabled
                              style={styles.execItem}
                              primaryText={<div style={styles.execPrimaryText}>Иватина Ирина <span style={styles.execDate}>8 марта</span></div>}
                              secondaryText={<div><span style={styles.execLine}></span><span>js - разработчик</span></div>}
                              secondaryTextLines={1}
                              leftIcon={<IconCompleted style={styles.docItemLeftIco}/>}
                              onMouseEnter={this.handleMouseEnter}
                              onMouseLeave={this.handleMouseLeave}
                              onTouchTap={this.handleTouchTap}
                            />
                          </List>
                        </div>
                        <div style={styles.execSeparator}>
                          <IconButton tooltip={this.state.executorsExpand ? 'Развернуть' : 'Свернуть'} style={styles.execSeparatorBtn} onClick={this.handleExecutorsExpand}>
                            {this.state.executorsExpand ? <IconSeparatorDown/> : <IconSeparatorUp/>}
                          </IconButton>
                          <div style={styles.execSeparatorLine}></div>
                        </div>
                      </div>
                      {/* <Divider/> */}
                    </Col>
                  </Row>
                  <Row>
                    <Col xs>
                      {/* <p style={styles.header}>Документы</p> */}
                      <List subheader="Документы" style={styles.docItemWrap}>
                        <ListItem
                          style={styles.docItem}
                          disabled
                          primaryText={<span>Сводная таблица технических требований</span>}
                          secondaryText="XLS" secondaryTextLines={1}
                          leftIcon={<DownloadFile style={styles.docItemLeftIco}/>}
                          rightIconButton={listItemRemoveIcon}
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}
                          onTouchTap={this.handleTouchTap}
                        />
                        <ListItem
                          style={styles.docItem}
                          primaryText={<span>Технические требования по использованию предоставленных материалов</span>}
                          secondaryText="PDF" secondaryTextLines={1}
                          leftIcon={<DownloadFile style={styles.docItemLeftIco}/>}
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}
                          onTouchTap={this.handleTouchTap}
                        />
                        <ListItem
                          style={styles.docItem}
                          primaryText={<span>Сводная таблица технических требований</span>}
                          secondaryText="(.xls)" secondaryTextLines={1}
                          leftIcon={<CloudDownload style={styles.docItemLeftIco}/>}
                          rightIconButton={listItemRemoveIcon}
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}
                          onTouchTap={this.handleTouchTap}
                        />
                        <ListItem
                          style={styles.docItem}
                          primaryText={<span>Сводная таблица технических требований</span>}
                          secondaryText="(.xls)" secondaryTextLines={1}
                          leftIcon={<AttachFile style={styles.docItemLeftIco}/>}
                          rightIconButton={listItemRemoveIcon}
                          nestedListStyle={styles.testStyle}
                          onMouseEnter={this.handleMouseEnter}
                          onMouseLeave={this.handleMouseLeave}
                          onTouchTap={this.handleTouchTap}
                        />
                      </List>
                    </Col>
                  </Row>
                </aside>
              </Col>
            </Row>
          </div>
        </Grid>
        <FloatingActionButton style={styles.FAB}>
          <EditorModeEdit />
        </FloatingActionButton>
      </div>
    );
  }
}
