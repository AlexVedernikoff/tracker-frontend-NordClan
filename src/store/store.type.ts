import moment from 'moment';

export interface IAuthStore {
  isLoggedIn: boolean,
  loaded: boolean,
  defaultRedirectPath: string,
  redirectPath: string | null,
  user: {
    id: number,
    firstNameRu: string | null,
    lastNameRu: string | null,
  } | {},
  errorMessage: string | null,
}

export interface ITimeSheetsStatus {
  name: string,
  nameRu: string,
  id: number,
  isBlocked: boolean
}

export interface IDictionariesStore {
  taskTypes: any[],
  taskStatuses: any[],
  magicActivityTypes: any[],
  departments: any[],
  timeSheetsStatus: ITimeSheetsStatus[]
}

export type ExternalUser = any;

export interface IExternalUsersStore {
  users: ExternalUser[]
}

export interface IGitlabStore {
  projects: any[];
  isAddingGitlabProjectStart?: true;
  isAddingGitlabProjectFail?: true;
  isAddingGitlabProjectSuccess?: true;
  gitlabProject?: any[];
  gitlabNamespaces?: Array<{
    id: string | number,
    name: string,
  }>;
}

export interface IJiraStore {
  projects: any[];
  project: object;
  isJiraAuthorizeStart?: boolean;
  isJiraAuthorizeSuccess?: boolean;
  isJiraAuthorizeError?: boolean | null;
  token?: string,
  jiraCaptachaLink?: string,
  isJiraCreateProjectStart?: boolean;
  isJiraCreateProjectSuccess?: boolean;
  isJiraCreateProjectError?: boolean;
  isGetJiraProjectsStart?: boolean;
  isGetJiraProjectsSuccess?: boolean;
  isGetJiraProjectsError?: boolean;
  isGetSimtrackUsersByNameStart?: boolean;
  isGetSimtrackUsersByNameSuccess?: boolean;
  isGetSimtrackUsersByNameError?: boolean;
  simtrackUsers?: any[];
  isSetAssociationStart?: boolean;
  isSetAssociationSuccess?: boolean;
  isSetAssociationError?: boolean;
  associations?: any[];
  isGetProjectAssociationStart?: boolean;
  isGetProjectAssociationSuccess?: boolean;
  isGetProjectAssociationError?: boolean;
}

export interface ILoadingStore {
  loading: number;
}

export interface ILocalizeStore {
  lang: string;
}

export type Notifications = any;

export interface INotificationsStore {
  Notifications: Notifications[]
}


export interface IPlanningTasksStore {
  leftColumnTasks: { data: any[] };
  rightColumnTasks: { data: any[] };
  isReceiving: boolean;
}

export interface IPortfoliosStore {
  portfolios: any[];
}

export interface IPortfolioStore {
  data: any[];
  name: string;
}

export type ProjectDataStore = {
  id?: string | null,
  milestones: any[],
  sprints: any[],
  users: any[],
  externalUsers?: any[],
  history?: {
    events: any[],
    pagesCount?: number
  },
  environment?: any[],
  error: boolean,
  validationError?: any | null,
  metrics?: any[],
  notProcessedGitlabUsers?: any[],
  gitlabProjectIds?: any[],
  gitlabProjects?: any[],
  tags?: any[],
  attachments?: any[],
  updatedStatusId?: string | null,
  jiraHostname?: string | null,
  jiraProjectName?: string | null,
  externalId?: any | null,
  lastSyncDate?: any,
  status?: any,
  projectEnvironments: Array<{
    id: number,
    title: string,
    description: string,
    createdAt: string,
    updatedAt: string | null,
    deletedAt: string | null,
  }>
}

export interface IProjectStore {
  project: ProjectDataStore,
  TitleIsEditing?: boolean,
  DescriptionIsEditing?: boolean,
  isCreateTaskModalOpen?: boolean,
  isCreateChildTaskModalOpen?: boolean,
  PortfolioIsEditing?: boolean,
  isProjectInfoReceiving?: boolean,
  isCreateTaskRequestInProgress?: boolean,
  isSprintsReceiving?: boolean,
  isProjectTagsReceiving?: boolean,
  tags?: any | null,
  lastCreatedTask?: {
    projectId: string,
    sprintId: string,
    taskId: string,
  },
}

export interface IProjectsStore {
  projects: any[],
  projectsAll: any[],
  pageSize: number,
  currentPage: number,
  pagesCount: number,
  tags: string,
  allTags: any[],
  isCreateProjectModalOpen: boolean,
  tagsFilter: any[],
  error: any | null,
  isProjectsReceived?: boolean,
}

export type TaskComment = {
  text: string;
  parentId: any | null;
  id: null;
  disabled: boolean;
  expired: boolean;
}

export interface ITaskStore {
  task: {
    id: any,
    tags: any[],
    error: boolean,
    attachments: any[],
    branches: any[],
    plannedExecutionTime: string,
    history: any[],
    linkedTasks: any[],
    subTasks: any[],
    repoBranches?: any[],
    projectRepos?: any[],
  },
  comments: any[],
  history: object,
  timeSpent: object,
  userTimeSpent?: object,
  roleTimeSpent?: object,
  currentComment: TaskComment,
  highlighted: object,
  TitleIsEditing: boolean,
  PlanningTimeIsEditing: boolean,
  ExecutionTimeIsEditing: boolean,
  SprintIsEditing: boolean,
  StatusIsEditing: boolean,
  DescriptionIsEditing: boolean,
  PriorityIsEditing: boolean,
  hasError?: boolean,
  lastUpdatedTask?: any,
  closeHasError?: boolean,
  isCommentsReceived?: boolean,
  commentsLoadedDate?: any,
}

export interface ITaskListStore {
  tasks: any[],
  pagesCount: number,
  isReceiving: boolean,
  tagsFilter: any[],
  allTags: any[]
}

export interface ITasksStore {
  tasks: any[],
  isReceiving: boolean,
  queryId: any | null,
}

export interface ITestCaseStore {
  isLoading: boolean,
  origin: any | null,
  list: {
    withTestSuite: object,
    withoutTestSuite: any[],
  }
}

export interface ITestingCaseReferenceStore {
  isLoading: boolean,
  testCases: { withTestSuite: any[], withoutTestSuite: any[] },
  testCasesByProject: object,
  testCasesByProjectLoading: object,
  isReferenceLoading: boolean,
  testCasesReference: { withTestSuite: any[], withoutTestSuite: any[] },
}

export interface ITestSuiteStore {
  testSuites: any[],
  isLoading: boolean,
  testSuitesByProject: object,
  testSuitesByProjectLoading: object,
  testSuitesReference: any[],
  isReferenceLoading: boolean,
}

export interface ITimesheetsStore {
  projects: any[];
  preloaders: {
    creating: boolean;
    gettingTimesheets: boolean;
  };
  list: any[];
  startingDay: moment.Moment;
  dateBegin: string;
  dateEnd: string;
  selectedActivityType: any | null;
  selectedTask: any[];
  selectedTaskStatusId: any[];
  selectedProject: any | null;
  selectedActivityTypeId: any | null;
  filteredTasks: any[];
  tempTimesheets: any[];
  averageNumberOfEmployees: any | null;
  lastSubmittedTimesheets: any[]
}

export interface ITimesheetPlayerStore {
  activeTask: any | null,
  availableProjects: any[],
  tracksChange: number,
  tracks: object,
}

export interface IUsersRolesStore {
  users: any[],
}

export interface IUserListStore {
  devOpsUsers: any | null,
  users: any | null, // TODO: any[] ?
  user: any | null,
}

type StoreType = {
  Auth: IAuthStore,
  Loading: ILoadingStore,
  Notifications: INotificationsStore,
  PlanningTasks: IPlanningTasksStore,
  Portfolios: IPortfoliosStore,
  Project: IProjectStore,
  Projects: IProjectsStore,
  Tasks: ITasksStore,
  TaskList: ITaskListStore,
  TestSuite: ITestSuiteStore,
  Task: ITaskStore,
  Portfolio: IPortfolioStore,
  Timesheets: ITimesheetsStore,
  TimesheetPlayer: ITimesheetPlayerStore,
  Dictionaries: IDictionariesStore,
  UsersRoles: IUsersRolesStore,
  UserList: IUserListStore,
  ExternalUsers: IExternalUsersStore,
  Localize: ILocalizeStore,
  Gitlab: IGitlabStore,
  Jira: IJiraStore,
  routing,
  TestingCaseReference: ITestingCaseReferenceStore,
}

export default StoreType;
