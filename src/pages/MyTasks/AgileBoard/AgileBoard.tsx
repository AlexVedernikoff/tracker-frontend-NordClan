import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';
import { Row } from 'react-flexbox-grid/lib';
import Button from '../../../components/Button';
import ButtonGroup from '../../../components/ButtonGroup';

import localize from "./AgileBoard.json"

import css from './AgileBoard.scss';
import PhaseColumn from './PhaseColumn';
import { getNewStatus, getNewStatusOnClick } from './helpers';
import { sortTasksAndCreateCard } from './TaskList';
import { phaseColumnNameById } from './constants';

import PerformerModal from '../../../components/PerformerModal';

import { getFullName } from '../../../utils/NameLocalisation';

import { EXTERNAL_USER } from '../../../constants/Roles';

import { TASK_STATUSES } from '../../../constants/TaskStatuses';
import AgileBoardFilter from '../AgileBoardFilter';
import { storageType } from '~/components/FiltrersManager/helpers';
import { showNotification } from '~/actions/Notifications';
import { connect } from 'react-redux';
import uniqWith from 'lodash/uniqWith';
import isEqual from 'lodash/isEqual';

type AgileBoardProps = {
  changeTask: Function,
  filters: {
    prioritiesId: number,
    authorId: number,
    typeId: Array<number>,
    name: string,
    performerId: number,
    projectIds: number
  },
  getProjectUsers: Function,
  getTasks: Function,
  globalRole: string,
  lang: string,
  localizationDictionary: {
    CHANGE_PERFORMER: string,
    CLEAR_ALL: string,
    CLEAR_FILTERS: string,
    CREATE_TASK: string,
    MY_TASKS: string,
    NO_RESULTS: string,
    PRIORITY: string,
    SELECT_AUTHOR: string,
    SELECT_PROJECT: string,
    SELECT_SPRINT: string,
    TAG_NAME: string,
    TASK_NAME: string,
    TASK_TYPE: string,
    TYPE_IS_MISS: string,
    WITHOUT_TAG: string
  },
  myTasks: object,
  sprintTasks: Array<{
    id: string,
    performerId: number,
    projectId: number,
    isDevOps: boolean
  }>,
  startTaskEditing: Function,
  tasks: object,
  unsortedUsers: Array<{
    id: number
  }>,
  user: {
    id: number
  },
  users: Array<{
    active: number,
    id: number
  }>,
  projects: Array<{
    name: string,
    id: number
  }>,
  clearFilters: Function,
  getAllUsers: Function,
  initialFilters: object,
  setFilterValue: Function,
  typeOptions: Array<object>,
  showNotification: Function,
};

type AgileBoardState = {
  isOnlyMine: boolean,
  changedTags: Array<any>,
  changedTask: {
    id: number
  } | null,
  changedTaskIsDevOps: boolean,
  fromTaskCore: boolean,
  isCardFocus: boolean,
  isModalOpen: boolean,
  isTshAndCommentsHidden: boolean,
  lightedTaskId: number | null,
  performer: number | null,
  statusId: number | null,
  phase: string,
  selectedCards: any[],
  stages: any[]
};

const storage = storageType === 'local' ? localStorage : sessionStorage;

class AgileBoard extends Component<AgileBoardProps, AgileBoardState> {
  constructor(props) {
    super(props);

    this.state = {
      changedTags: [],
      changedTask: null,
      changedTaskIsDevOps: false,
      fromTaskCore: false,
      isCardFocus: false,
      isModalOpen: false,
      isOnlyMine: props.filters.isOnlyMine,
      isTshAndCommentsHidden: false,
      lightedTaskId: null,
      performer: null,
      statusId: null,
      phase: '',
      selectedCards: [],
      stages: ["New", "Dev", "Code Review", "QA", "Done"]
    };
  }
  componentDidMount() {
    this.getTasks();
  }

  componentWillReceiveProps(nextProps) {
    ReactTooltip.hide();

    if (nextProps.filters.isOnlyMine !== this.state.isOnlyMine) {
      this.setState({ isOnlyMine: nextProps.filters.isOnlyMine });
    }
  }

  changeOnlyMineState = isOnlyMine => {
    this.setState({ isOnlyMine });
  };

  dropTask = (task, phase) => {
    if (phaseColumnNameById[task.statusId] === phase) {
      return;
    }

    if (phase !== 'New') {
      const taskProps = this.props.sprintTasks.find(sprintTask => task.id === sprintTask.id);
      const performerId = taskProps?.performerId ?? null;
      const projectId = taskProps?.projectId ?? null;
      const isTshAndCommentsHidden = task.statusId === TASK_STATUSES.NEW;

      const { getProjectUsers } = this.props;
      
      getProjectUsers(projectId, true);
      getProjectUsers(projectId);

      this.openPerformerModal(
        task,
        performerId,
        projectId,
        task.statusId,
        phase,
        undefined,
        taskProps?.isDevOps,
        isTshAndCommentsHidden
      );
    } else {
      this.changeStatus(task.id, task.statusId, phase, undefined);
    }
  };

  handleSelectCard = (payload) => {
    if (payload.checked) {
      this.setState({
        selectedCards: [...this.state.selectedCards, payload.task]
      })
    } else {
      this.setState({
        selectedCards: this.state.selectedCards.filter(task => task.id !== payload.task.id)
      })
    }
  }
  // TODO: Откат функционала c множественным переносом задач TR-25186, скрыл handle функции
  // handleSelectAllColumnCard = ({checked, tasks}) => {
  //   const tasksInfo = tasks.map(el => el.props.task);
  //   if (checked) {
  //     this.setState({
  //       selectedCards: uniqWith([...this.state.selectedCards, ...tasksInfo], isEqual)
  //     })
  //   } else {
  //     this.setState({
  //       selectedCards: this.state.selectedCards.filter(task => !tasksInfo.includes(task))
  //     })
  //   }
  // }
  //
  // isColumnSelected = (type) => {
  //   const {selectedCards} = this.state;
  //   const {tasks} = this.props;
  //   return Boolean(tasks[type]?.every((e) => selectedCards.includes(e)));
  // }

  changeStatus = (taskId, statusId, phase, performerId) => {
    const params = {
      id: taskId,
      statusId: phase ? getNewStatus(phase) : getNewStatusOnClick(statusId),
      performerId: undefined
    };

    if (performerId === 0) {
      params.performerId = performerId;
    }

    const { changeTask, startTaskEditing } = this.props;

    changeTask(params, 'Status');
    startTaskEditing('Status');
  };

  openPerformerModal = (
    task,
    performerId,
    projectId,
    statusId,
    phase,
    fromTaskCore,
    isDevOps,
    isTshAndCommentsHidden
  ) => {
    this.setState({
      isModalOpen: true,
      performer: performerId,
      changedTask: task,
      changedTaskIsDevOps: isDevOps,
      statusId,
      phase,
      fromTaskCore,
      isTshAndCommentsHidden
    });
  };

  changePerformer = performerId => {
    this.props.changeTask(
      {
        // Hot fix TODO: fix it
        id: this.state.changedTask?.id ? this.state.changedTask.id : this.state.changedTask,
        performerId: performerId,
        statusId: getNewStatus(this.state.phase)
      },
      'User'
    );
    this.props.startTaskEditing('User');
    this.setState({ isModalOpen: false });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  lightTask = (lightedTaskId, isCardFocus) => {
    this.setState({ lightedTaskId, isCardFocus });
  };

  get isExternal() {
    return this.props.globalRole === EXTERNAL_USER;
  }

  getFilteredTasks = (flag) => {
    const { user, tasks } = this.props;
    let filteredTasks = {};
    if (flag === 'mine') {
      Object.keys(tasks).forEach(key => {
        filteredTasks[key] = tasks[key].filter(task => task.authorId === user.id);
      });
    } else filteredTasks = tasks;
    return filteredTasks;
  }

  getTasksList(flag) {

    const filteredTasks = this.getFilteredTasks(flag);

    return sortTasksAndCreateCard(
      filteredTasks,
      flag,
      this.changeStatus,
      this.openPerformerModal,
      this.isExternal,
      this.lightTask,
      this.state.lightedTaskId,
      this.state.isCardFocus,
      // TODO: Откат функционала c множественным переносом задач TR-25186
      // this.handleSelectCard,
      // this.state.selectedCards
    );
  }

  getAllSortedTasks() {
    return this.getTasksList('all');
  }

  getMineSortedTasks() {
    return this.getTasksList('mine');
  }

  get isOnlyMine() {
    const { isOnlyMine } = this.state;

    return isOnlyMine;
  }

  getTasks = () => {
    const { getTasks } = this.props;
    const storageFilters = storage.filtersData ? JSON.parse(storage.filtersData) : {};
    const options = {
      prioritiesId: storageFilters.prioritiesId ?? null,
      performerId: storageFilters.performerId ?? null,
      authorId: storageFilters.authorId ?? null,
      typeId: storageFilters.typeId ?? null,
      name: storageFilters.name ?? null,
      projectIds: storageFilters.projectIds ?? null
    };

    getTasks(options);
  };

  /* TODO: Откат функционала c множественным переносом задач TR-25186, скрыл функцию с переносом выбранных задач */
  // moveSelectedCards = (stage) => {
  //   const {lang} = this.props;
  //   if (!this.state.selectedCards.length) {
  //     this.props.showNotification({
  //       message: localize[lang].NO_SELECTED_ERROR_MESSAGE,
  //       type: 'error'
  //     });
  //     return false;
  //   }
  //   this.state.selectedCards.forEach(card => {
  //     this.changeStatus(card.id, card.statusId, stage, card.performerId)
  //   })
  //   this.setState({
  //     selectedCards: []
  //   })
  // }

  render() {
    const {
      localizationDictionary,
      users,
      clearFilters,
      filters,
      initialFilters,
      lang,
      setFilterValue,
      typeOptions,
      unsortedUsers,
      projects,
    } = this.props;

    const tasksList = this.isOnlyMine ? this.getMineSortedTasks() : this.getAllSortedTasks();

    const tasksKey = this.isOnlyMine ? 'mine' : 'all';

    const activeUsers = users?.filter(user => user.active === 1) ?? [];

    const usersFullNames = unsortedUsers.map(user => ({ value: user.id, label: getFullName(user) })).sort((a, b) => {
      switch (true) {
        case a.label < b.label:
          return -1;
        case a.label > b.label:
          return 1;
        default:
          return 0;
      }
    });

    return (
      <section className={css.agileBoard}>
        {/* TODO: Откат функционала c множественным переносом задач TR-25186, скрыл отображение кнопок стадий разработки */}
        {/*<div>*/}
          {/*<h2>{localize[lang].STATUS_UPDATE}</h2>*/}
          {/*<ButtonGroup>*/}
          {/*  {this.state.stages.map((stage, i) => (*/}
          {/*    <Button*/}
          {/*      text={stage}*/}
          {/*      key={i}*/}
          {/*      type="primary"*/}
          {/*      data-tip={localize[lang].MOVE_TO + stage}*/}
          {/*      onClick={() => this.moveSelectedCards(stage)}*/}
          {/*      addedClassNames={{ [css.disabledBtn]: !this.state.selectedCards.length }}*/}
          {/*    />))}*/}
          {/*</ButtonGroup>*/}
        {/*</div>*/}
        <AgileBoardFilter
          lang={lang}
          getTasks={this.getTasks}
          initialFilters={initialFilters}
          filters={filters}
          setFilterValue={setFilterValue}
          clearFilters={clearFilters}
          typeOptions={typeOptions}
          users={activeUsers}
          projects={projects}
        />
        <div className={css.boardContainer}>
          <Row>
            <PhaseColumn
                onDrop={this.dropTask}
                section={tasksKey}
                title="New"
                tasks={tasksList.new}
                // TODO: откат функционала с множественным переносом задач TR-25186
                // handleSelectAllColumnCard={this.handleSelectAllColumnCard}
                // isColumnSelected={this.isColumnSelected('new')}
            />
            <PhaseColumn
                onDrop={this.dropTask}
                section={tasksKey}
                title="Dev"
                tasks={tasksList.dev}
                // TODO: откат функционала с множественным переносом задач TR-25186
                // handleSelectAllColumnCard={this.handleSelectAllColumnCard}
                // isColumnSelected={this.isColumnSelected('dev')}
            />
            <PhaseColumn
                onDrop={this.dropTask}
                section={tasksKey}
                title="Code Review"
                tasks={tasksList.codeReview}
                // TODO: откат функционала с множественным переносом задач TR-25186
                // handleSelectAllColumnCard={this.handleSelectAllColumnCard}
                // isColumnSelected={this.isColumnSelected('codeReview')}
            />
            <PhaseColumn
                onDrop={this.dropTask}
                section={tasksKey}
                title="QA"
                tasks={tasksList.qa}
                // TODO: откат функционала с множественным переносом задач TR-25186
                // handleSelectAllColumnCard={this.handleSelectAllColumnCard}
                // isColumnSelected={this.isColumnSelected('qa')}
            />
            <PhaseColumn
                onDrop={this.dropTask}
                section={tasksKey}
                title="Done"
                tasks={tasksList.done}
                // TODO: откат функционала с множественным переносом задач TR-25186
                // handleSelectAllColumnCard={this.handleSelectAllColumnCard}
                // isColumnSelected={this.isColumnSelected('done')}
            />
          </Row>
        </div>

        {this.state.isModalOpen ? (
          <PerformerModal
            defaultUser={this.state.performer}
            onChoose={this.changePerformer}
            onClose={this.closeModal}
            title={localizationDictionary.CHANGE_PERFORMER}
            users={usersFullNames}
            id={this.state.changedTask?.id}
            isTshAndCommentsHidden={this.state.isTshAndCommentsHidden}
          />
        ) : null}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  lang: state.Localize.lang
});

const mapDispatchToProps = {
  showNotification
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AgileBoard);
