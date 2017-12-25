const PRIORITIES = {
  1: 'Highest',
  2: 'High',
  3: 'Average',
  4: 'Low',
  5: 'Lowest',
  default: ''
};

export default function getPriorityById (priorityId) {
  return PRIORITIES[priorityId] || PRIORITIES.default;
}
