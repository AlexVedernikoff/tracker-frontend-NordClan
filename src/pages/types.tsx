export type CompanyDepartment = {
    id: number,
    name: string,
    psId: string,
};

export type Project = {
    id: number,
    name?: string,
    prefix?: string
};

export type Sprint = {
    id: number,
    name?: string,
};

export type Task = {
    id: number,
    name?: string,
    project?: Project,
    sprint?: Sprint,
    typeId: number
};

export type User = {
    id: number,
    active?: number,
    delete_date?: string,
    employment_date?: string,
    firstNameEn?: string,
    firstNameRu?: string,
    fullNameEn?: string,
    fullNameRu?: string,
    lastNameEn?: string,
    lastNameRu?: string
};

export type TimesheetRecord = {
    id: number,
    isBillable: boolean,
    comment?: string,
    onDate?: string,
    projectId: number,
    project: Project,
    spentTime?: string,
    sprint: Sprint,
    statusId?: number,
    task: Task,
    taskId: number,
    taskStatusId: number,
    typeId: number,
    updatedAt: string,
    user: User,
    userId: number,
    userRoleId?: string
};

export type TimeSheetsItem = {
    id: number,
    department: Omit<CompanyDepartment, 'psId'>,
    dismissalDate?: string,
    employmentDate?: string,
    firstNameEn?: string,
    firstNameRu?: string,
    fullNameEn?: string,
    fullNameRu?: string,
    global_role?: string,
    lastNameEn?: string,
    lastNameRu?: string,
    timesheet: TimesheetRecord[]
};
