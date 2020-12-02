const getOptions = taskStatuses =>
  taskStatuses.filter(status => status.name.includes(' play')).map(status => ({
    label: status.name.replace(' play', ''),
    value: status.id
  }));

export default getOptions;
