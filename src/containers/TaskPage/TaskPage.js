import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {setCurrentTask, isCurrentTaskLoaded} from '../../actions/currentTask';
// import {bindActionCreators} from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import EditorModeEdit from 'material-ui/svg-icons/editor/mode-edit';

import TaskCardHeader from '../../components/TaskCard/TaskCardHeader';
import DropZone from '../../components/DropZone/DropZone';
import ExecutorsList from '../../components/TaskPage/ExecutorsList';
import DocumentList from '../../components/TaskPage/DocumentList';
import Terms from '../../components/TaskPage/Terms';
import Details from '../../components/TaskPage/Details';
import Comments from '../../components/TaskPage/Comments';
import Slider from '../../components/TaskPage/Slider';

@connect(
  state => ({task: state.currentTask.data}),
  dispatch => bindActionCreators({setCurrentTask}, dispatch)
)
export default class TaskPage extends Component {
  static propTypes = {
    task: PropTypes.shape({
      // id: PropTypes.string.isRequired,
      idProj: PropTypes.string.isRequired,
      projectName: PropTypes.string.isRequired,
      status: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      creator: PropTypes.object.isRequired,
      owner: PropTypes.object.isRequired,
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
    setCurrentTask: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired
  }
  static contextTypes = {
    store: PropTypes.object.isRequired,
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
    };
  }

  componentDidMount() {
    const {taskId} = this.props.params;
    const {store} = this.context;
    if (!isCurrentTaskLoaded(store.getState(), taskId)) {
      this.props.setCurrentTask(taskId);
    }
  }

  render() {
    const {task} = this.props;

    const grid = require('./TaskPage.scss');
    const css = require('./TaskPage.scss');

    const dataExecutors = {
      0: {
        name: 'Иватина Ирина',
        date: '10 апреля',
        status: 'iconPaused'
      },
      1: {
        name: 'Иватина Ирина',
        date: '12 апреля',
        status: 'iconPaused'
      },
      2: {
        name: 'Иватина Ирина',
        date: '20 апреля',
        status: 'iconInProcess'
      },
      3: {
        name: 'Иватина Ирина',
        date: '10 марта',
        status: 'iconPaused'
      },
      4: {
        name: 'Иватина Ирина',
        date: '27 марта',
        status: 'iconPaused'
      },
      5: {
        name: 'Иватина Ирина',
        date: '10 мая',
        status: 'iconPaused'
      },
      6: {
        name: 'Иватина Ирина',
        date: '6 апреля',
        status: 'iconCompleted'
      },
      7: {
        name: 'Иватина Ирина',
        date: '10 марта',
        status: 'iconCompleted'
      }
    };
    const dataDocuments = {
      0: {
        title: 'Сводная таблица технических требований',
        format: 'XLS',
        type: 'DownloadFile'
      },
      1: {
        title: 'Технические требования по использованию предоставленных материалов',
        format: 'PDF',
        type: 'DownloadFile'
      },
      2: {
        title: 'Сводная таблица технических требований',
        format: '(.xls)',
        type: 'CloudDownload'
      },
      3: {
        title: 'Сводная таблица технических требований',
        format: '(.xls)',
        type: 'AttachFile'
      },
    };
    return (
      <div id="task-page">
        <Helmet title={task.name} />
        <Grid fluid className={grid.layout}>
        {
          task &&
          <div className={css.wrapper}>
            <Row>
              <Col xs={12}>
                <TaskCardHeader task={task}/>
              </Col>
            </Row>
            <Row>
              <Col xs={8}>
                <main className={css.main}>
                  <div className={css.header}>Описание</div>
                  <p className={css.description}>{task.about}</p>
                  <div className={css.header}>Изображения</div>
                  <div className={css.slider}>
                    <Row between="sm">
                      <Slider />
                      <Slider />
                      <Slider />
                      <Slider />
                    </Row>
                  </div>
                  <div>
                    <DropZone />
                  </div>
                  <Row>
                    <Comments />
                  </Row>
                </main>
              </Col>
              <Col xs={4}>
                <aside>
                  <Row>
                    <Details status={task.status} />
                  </Row>
                  <Row>
                    <Terms />
                  </Row>
                  <Row>
                    <ExecutorsList data={dataExecutors} />
                  </Row>
                  <Row>
                    <DocumentList data={dataDocuments} />
                  </Row>
                </aside>
              </Col>
            </Row>
          </div>
        }
        </Grid>
        <FloatingActionButton className={css.taskPage_actionButton}>
          <EditorModeEdit />
        </FloatingActionButton>
      </div>
    );
  }
}
