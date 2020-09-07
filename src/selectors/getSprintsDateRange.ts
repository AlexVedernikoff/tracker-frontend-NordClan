export const getSprintsDateRange = sprints => {
  const sprintsDates = [];
  const changeDays = (date, days, type) => {
    const result = new Date(date);
    if (type === 'increase') {
      result.setDate(result.getDate() + days);
    } else if (type === 'decrease') {
      result.setDate(result.getDate() - days);
    }
    return result;
  };

  for (const sprint of sprints) {
    const sprintDates = {
      after: changeDays(new Date(sprint.factStartDate), 1, 'decrease'),
      before: changeDays(new Date(sprint.factFinishDate), 1, 'increase')
    };
    sprintsDates.push(sprintDates);
  }
  return sprintsDates;
};
