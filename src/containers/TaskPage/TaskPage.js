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
import AvPlayCircleFilled from 'material-ui/lib/svg-icons/av/play-circle-filled';
import Avatar from 'material-ui/lib/avatar';
import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import { asyncConnect } from 'redux-async-connect';
import AppHead from '../../components/AppHead/AppHead';
// import FullWidthsection from '../FullWidthSection/FullWidthSection';
// import muiThemeable from 'material-ui/lib/muiThemeable';
import {Styles} from 'material-ui';
const {Typography} = Styles;

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
    };
  }
  getStyles() {
    const theme = this.context.muiTheme;
    console.log('theme', theme, Typography);
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
      }
    };
    return styles;
  }
  handleChangeTabs = (value) => {
    this.setState({
      slideIndex: value,
    });
  };
  render() {
    // const styles = require('./TaskPage.scss');

    const styles = this.getStyles();

    const {task} = this.props;
    return (
      <div>
        <AppHead/>
        <Grid>
          <Row>
            <Col xs={12}>
              <h1 style={styles.h1}>#42413 Нарисовать макет страницы "О проекте"</h1>
              <p style={styles.p}>Simtrack, создал(а) Татьяна Бабич 28 мая 2016, выполнит - Карандашева Анна, Денис
                Скориков</p>
            </Col>
          </Row>
          <Row between="xs">
            <Col xs={8}>
              <p style={styles.description}>Описание</p>
              <span style={styles.description}>{task.about}</span>
              <p style={styles.description}>Изображения</p>
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
            </Col>
            <Col xs={3}>
              <List subheader="Детали">
                <ListItem
                  secondaryText="Статус"
                  rightIcon={<AvPlayCircleFilled color={styles.icon.color}/>}
                />
                <ListItem
                  secondaryText="Квалификация"
                  rightIcon={<AvPlayCircleFilled />}/>
              </List>
            </Col>
          </Row>
        </Grid>
      </div>
    );
  }
}
