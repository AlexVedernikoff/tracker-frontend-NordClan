const getOptions = taskStatuses =>
  taskStatuses.filter(status => status.createDraftByChangesTaskStatus && status.name.includes(' play')).map(status => ({
    label: status.name.replace(' play', ''),
    value: status.id
  }));

export default getOptions;
