import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import Helmet from 'react-helmet';
import {connect} from 'react-redux';
import {setCurrentTask, isCurrentTaskLoaded, setPriority, setTypeTask, setStatus} from '../../actions/currentTask';
// import {bindActionCreators} from 'redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib/index';

import TaskCardHeader from '../../components/TaskCard/TaskCardHeader';
import Details from '../../components/TaskPage/Details';
import RelatedTasks from '../../components/TaskPage/RelatedTasks';
import TaskHistory from '../../components/TaskPage/TaskHistory';
import Attachments from '../../components/TaskPage/Attachments';
// import DropZone from '../../components/DropZone/DropZone';
import Comments from '../../components/TaskPage/Comments';
// import Slider from '../../components/TaskPage/Slider';

@connect(
  state => ({task: state.currentTask.data}),
  dispatch => bindActionCreators({
    setCurrentTask, setPriority, setTypeTask, setStatus
  }, dispatch)
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
    setPriority: PropTypes.func.isRequired,
    setTypeTask: PropTypes.func.isRequired,
    setStatus: PropTypes.func.isRequired,
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

  handleChangeType = (event, index, value) => this.props.setTypeTask(value);
  handleChangePriority = (event, index, value) => this.props.setPriority(value);
  handleChangeStatus = (buttonProps, event, status) => this.props.setStatus(status);

  render() {
    const grid = require('./TaskPage.scss');
    const css = require('./TaskPage.scss');

    const { task } = this.props;
    // const { priority, status } = task;
    let { type } = task;

    if (typeof type === 'string') { // временное приведение типа, пока рест не будет отдавать id
      type = 1;
    }

    // const dataExecutors = {
    //   0: {
    //     name: 'Иватина Ирина',
    //     date: '10 апреля',
    //     status: 'iconPaused'
    //   },
    //   1: {
    //     name: 'Иватина Ирина',
    //     date: '12 апреля',
    //     status: 'iconPaused'
    //   },
    //   2: {
    //     name: 'Иватина Ирина',
    //     date: '20 апреля',
    //     status: 'iconInProcess'
    //   },
    //   3: {
    //     name: 'Иватина Ирина',
    //     date: '10 марта',
    //     status: 'iconPaused'
    //   },
    //   4: {
    //     name: 'Иватина Ирина',
    //     date: '27 марта',
    //     status: 'iconPaused'
    //   },
    //   5: {
    //     name: 'Иватина Ирина',
    //     date: '10 мая',
    //     status: 'iconPaused'
    //   },
    //   6: {
    //     name: 'Иватина Ирина',
    //     date: '6 апреля',
    //     status: 'iconCompleted'
    //   },
    //   7: {
    //     name: 'Иватина Ирина',
    //     date: '10 марта',
    //     status: 'iconCompleted'
    //   }
    // };
    // const dataDocuments = {
    //   0: {
    //     title: 'Сводная таблица технических требований',
    //     format: 'XLS',
    //     type: 'DownloadFile'
    //   },
    //   1: {
    //     title: 'Технические требования по использованию предоставленных материалов',
    //     format: 'PDF',
    //     type: 'DownloadFile'
    //   },
    //   2: {
    //     title: 'Сводная таблица технических требований',
    //     format: '(.xls)',
    //     type: 'CloudDownload'
    //   },
    //   3: {
    //     title: 'Сводная таблица технических требований',
    //     format: '(.xls)',
    //     type: 'AttachFile'
    //   },
    // };
    return (
      <div id="task-page">
        <Helmet title={task.name} />
        <Grid fluid className={grid.layout}>
        {
          task &&
          <div className={css.wrapper}>
            <Row>
              <Col xs={8}>
                <TaskCardHeader task={task}/>
                <main className={css.main}>
                  <div className={css.description}>
                    Описание задачи, которое довольно часто может составлять пару предложений.
                  </div>
                  <hr />
                  <Attachments task={task} />
                  <hr />
                  <Comments />
                </main>
              </Col>
              <Col xs={4}>
                <aside>
                  <Details task={task} />
                  <RelatedTasks task={task} />
                  <TaskHistory task={task} />
                </aside>
              </Col>
            </Row>
          </div>
        }
        </Grid>
      </div>
    );
  }
}
