/**
 * Created by ira on 18.02.16.
 */

import React, {Component, PropTypes} from 'react';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {setCurrentTask, isCurrentTaskLoaded} from 'redux/modules/current_task';
// import { Link } from 'react-router';
// import config from '../../config';
// import Helmet from 'react-helmet';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
// import AvPlayCircleFilled from 'material-ui/lib/svg-icons/av/play-circle-filled';
import Avatar from 'material-ui/lib/avatar';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { asyncConnect } from 'redux-async-connect';
import AppHead from '../../components/AppHead/AppHead';
import Divider from 'material-ui/lib/divider';
import {Styles} from 'material-ui';
const {Typography} = Styles;
import { Link } from 'react-router';
import FloatingActionButton from 'material-ui/lib/floating-action-button';
import ContentAdd from 'material-ui/lib/svg-icons/content/add';
import EditorModeEdit from 'material-ui/lib/svg-icons/editor/mode-edit';
import AttachFile from 'material-ui/lib/svg-icons/editor/attach-file';
import LinearProgress from 'material-ui/lib/linear-progress';
import DropDownMenu from 'material-ui/lib/DropDownMenu';
import MenuItem from 'material-ui/lib/menus/menu-item';
import ArrowDropRight from 'material-ui/lib/svg-icons/navigation-arrow-drop-right';

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
      _id: PropTypes.string.isRequired,
      isActive: PropTypes.bool.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      about: PropTypes.string.isRequired,
      deadline: PropTypes.string.isRequired
    }),
    params: PropTypes.object.isRequired,
    muiTheme: React.PropTypes.object.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
    muiTheme: PropTypes.object.isRequired
  }

  constructor(props, context) {
    super(props, context);
    this.state = {
      slideIndex: 0,
      dropDownIndex: 0
    };
  }

  getStyles() {
    const theme = this.context.muiTheme;
    const styles = {
      root: {
        //  backgroundColor: Colors.cyan500,
        overflow: 'hidden',
      },
      h1: {
        color: theme.rawTheme.palette.primary1Color,
        fontWeight: Typography.fontWeightMedium,
        fontSize: '34px',
        paddingTop: 19,
        marginTop: 55,
        WebkitMarginAfter: '0em'
      },
      p: {
        fontSize: '12px',
        lineHeight: '48px',
        // paddingTop: 20,
        // marginBottom: 20,
        letterSpacing: 0,
        WebkitMarginBefore: '0em',
        WebkitMarginAfter: '0em'
      },
      description: {
        fontSize: '14px',
        lineHeight: '24px'
      },
      header: {
        fontSize: '16px',
        lineHeight: '48px',
        letterSpacing: 0,
        WebkitMarginBefore: '0em',
        WebkitMarginAfter: '0em',
        marginTop: '20px'
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
        color: theme.rawTheme.palette.primary3Color
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
      img: {
        width: '100%',
        height: 'auto'
      },
      container: {
        width: 150,
        height: 150,
        overflow: 'hidden'
      },
      progressBar: {
        width: '60%',
        marginBottom: 10
      },
      executor: {
        fontSize: '14px'
        // lineHeight: '48px'
      },
      labelDateOfDeadline: {
        fontSize: '12px',
        color: theme.rawTheme.palette.primary3Color,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
        whiteSpace: 'nowrap'
      },
      labelHoursOfDeadline: {
        fontSize: '20px',
        margin: '10px',
        lineHeight: '14px',
        textAlign: 'center'
      },
      dateDeadlineBar: {
        width: '30%',
        marginBottom: 10,
        textAlign: 'center'
      },
      deadlineContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      box: {
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

  render() {
    const styles = this.getStyles();

    const {task} = this.props;
    return (
      <div>
        <AppHead/>
        <Grid>
          <div style={styles.box}>
            <Row xs={12}>
              <h1 style={styles.h1}>#42413 Нарисовать макет страницы "О проекте"</h1>
              <p style={styles.p}><Link to="#" style={styles.a}>Simtrack</Link>, создал(а) <Link to="#"
                                                                                                 style={styles.a}>Татьяна
                Бабич</Link> 28 мая 2016, выполнит - <Link to="#" style={styles.a}>Карандашева Анна</Link> , <Link
                to="#"
                style={styles.a}>Денис
                Скориков</Link></p>
            </Row>
            <Row between="xs">
              <Col xs={7}>
                <Row>
                  <p style={styles.header}>Описание</p>
                  <span style={styles.description}>{task.about}</span>
                </Row>
                <Row>
                  <p style={styles.header}>Изображения</p>
                </Row>
                <Row between="xs">
                  <Col>
                    <div style={styles.container}>
                      <img style={styles.img}
                           src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                    </div>
                  </Col>
                  <Col>
                    <div style={styles.container}>
                      <img style={styles.img}
                           src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                    </div>
                  </Col>
                  <Col>
                    <div style={styles.container}>
                      <img style={styles.img}
                           src="http://www1-lw.xda-cdn.com/wp-content/uploads/2015/01/Ultimate-Material-Lollipop-Collection-28.jpg"/>
                    </div>
                  </Col>
                </Row>
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
              </Col>
              <Col xs={4}>
                <Row>
                  <Col xs>
                    <p style={styles.header}>Детали</p>
                    <div style={{marginBottom: 20}}>
                      <div style={styles.deadlineContainer}>
                        <div>
                          <p style={{...styles.labelDateOfDeadline, marginTop: 21}}>Статус</p>
                        </div>
                        <div>
                          <DropDownMenu value={this.state.dropDownIndex} onChange={this.handleChangeDropDown}
                                        underlineStyle={{display: 'none'}}>
                            <MenuItem value={0} primaryText="Line spacing" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={2} primaryText="Every Night" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={3} primaryText="Weeknights" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={4} primaryText="Weekends" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={5} primaryText="Weekly" leftIcon={<ArrowDropRight />}/>
                          </DropDownMenu>
                        </div>
                      </div>
                      <div style={styles.deadlineContainer}>
                        <div>
                          <p style={{...styles.labelDateOfDeadline, marginTop: 21}}>Квалификация</p>
                        </div>
                        <div>
                          <DropDownMenu value={this.state.dropDownIndex} onChange={this.handleChangeDropDown}
                                        underlineStyle={{display: 'none'}}>
                            <MenuItem value={0} primaryText="Line spacing" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={2} primaryText="Every Night" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={3} primaryText="Weeknights" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={4} primaryText="Weekends" leftIcon={<ArrowDropRight />}/>
                            <MenuItem value={5} primaryText="Weekly" leftIcon={<ArrowDropRight />}/>
                          </DropDownMenu>
                        </div>
                      </div>
                      <div style={styles.deadlineContainer}>
                        <div>
                          <p style={{...styles.labelDateOfDeadline, marginTop: 21}}>Приоритет</p>
                        </div>
                        <div>
                          <ContentAdd/>
                          <span style={styles.executor}>Среднее</span>
                        </div>
                      </div>
                    </div>
                    <Divider/>
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <p style={styles.header}>Сроки</p>
                    <div style={styles.deadlineContainer}>
                      <div style={styles.progressBar}>
                        <p style={styles.labelDateOfDeadline}>Потрачено / Запланировано</p>
                        <p style={styles.labelHoursOfDeadline}>10/50</p>
                        <LinearProgress mode="determinate" value={50}/>
                      </div>
                      <div style={styles.dateDeadlineBar}>
                        <p style={styles.labelDateOfDeadline}>Релиз</p>
                        <p style={{...styles.labelHoursOfDeadline, margin: '3px'}}>16</p>
                        <p style={{fontSize: '12px', margin: 0}}>сентября</p>
                      </div>
                    </div>
                    <Divider/>
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <p style={styles.header}>Исполнители</p>
                    <div style={{marginBottom: 20}}>
                      <div
                        style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '14'}}>
                        <ContentAdd style={{marginTop: 'auto', marginBottom: 'auto'}}/>
                        <div style={{margin: 'auto 5px', flexGrow: '2', flexShrink: '2'}}>
                          <span style={styles.executor}>Иватина Ирина</span>
                        </div>
                        <div style={{marginTop: 'auto'}}>
                          <span style={styles.executor}>12 апреля</span>
                        </div>
                      </div>
                      <div
                        style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '14'}}>
                        <ContentAdd style={{marginTop: 'auto', marginBottom: 'auto'}}/>
                        <div style={{margin: 'auto 5px', flexGrow: '2', flexShrink: '2'}}>
                          <span style={styles.executor}>Иватина Ирина</span>
                        </div>
                        <div style={{marginTop: 'auto'}}>
                          <span style={styles.executor}>12 апреля</span>
                        </div>
                      </div>
                      <div
                        style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '14'}}>
                        <ContentAdd style={{marginTop: 'auto', marginBottom: 'auto'}}/>
                        <div style={{margin: 'auto 5px', flexGrow: '2', flexShrink: '2'}}>
                          <span style={styles.executor}>Иватина Ирина</span>
                        </div>
                        <div style={{marginTop: 'auto'}}>
                          <span style={styles.executor}>12 апреля</span>
                        </div>
                      </div>
                      <div
                        style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', paddingBottom: '14'}}>
                        <ContentAdd style={{marginTop: 'auto', marginBottom: 'auto'}}/>
                        <div style={{margin: 'auto 5px', flexGrow: '2', flexShrink: '2'}}>
                          <span style={styles.executor}>Иватина Ирина</span>
                        </div>
                        <div style={{marginTop: 'auto'}}>
                          <span style={styles.executor}>12 апреля</span>
                        </div>
                      </div>
                    </div>
                    <Divider/>
                  </Col>
                </Row>
                <Row>
                  <Col xs>
                    <p style={styles.header}>Документы</p>
                    <div style={styles.documentsContainer}>
                      <div style={styles.documentsIconContainer}><AttachFile style={styles.documentsIcon}
                                                                             color={styles.documentsIcon.color}/></div>
                      <div style={styles.documentsLabelContainer}><Link
                        to="#" style={styles.documents}>Сводная таблица технических требований</Link><span
                        style={styles.documentsExtensions}> (.xls)</span></div>
                    </div>
                    <div style={styles.documentsContainer}>
                      <div style={styles.documentsIconContainer}><AttachFile style={styles.documentsIcon}
                                                                             color={styles.documentsIcon.color}/></div>
                      <div style={styles.documentsLabelContainer}><Link
                        to="#" style={styles.documents}>Сводная таблица технических требований</Link><span
                        style={styles.documentsExtensions}> (.xls)</span></div>
                    </div>
                    <div style={styles.documentsContainer}>
                      <div style={styles.documentsIconContainer}><AttachFile style={styles.documentsIcon}
                                                                             color={styles.documentsIcon.color}/></div>
                      <div style={styles.documentsLabelContainer}><Link
                        to="#" style={styles.documents}>Сводная таблица технических требований</Link><span
                        style={styles.documentsExtensions}> (.xls)</span></div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Grid>
        <FloatingActionButton style={styles.FAB}>
          <EditorModeEdit />
        </FloatingActionButton>
      </div>
    )
      ;
  }
}
