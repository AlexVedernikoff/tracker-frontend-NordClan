const getOptions = taskStatuses =>
  taskStatuses.map(status => ({
    label: status.name.replace(' play', ''),
    value: status.id
  }));

export default getOptions;
