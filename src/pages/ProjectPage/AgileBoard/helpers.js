export const getNewStatus = newPhase => {
  let newStatusId;

  switch (newPhase) {
    case 'New':
      newStatusId = 1;
      break;
    case 'Dev':
      newStatusId = 3;
      break;
    case 'Code Review':
      newStatusId = 5;
      break;
    case 'QA':
      newStatusId = 7;
      break;
    case 'Done':
      newStatusId = 8;
      break;
    default:
      break;
  }

  return newStatusId;
};

export const getNewStatusOnClick = oldStatusId => {
  let newStatusId;

  if (oldStatusId === 2 || oldStatusId === 4 || oldStatusId === 6) {
    newStatusId = oldStatusId + 1;
  } else if (oldStatusId === 3 || oldStatusId === 5 || oldStatusId === 7) {
    newStatusId = oldStatusId - 1;
  }

  return newStatusId;
};
