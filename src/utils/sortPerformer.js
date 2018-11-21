const getRoles = user => {
  for (const key in user.roles) {
    if (user.roles[key]) {
      return key;
    }
  }
  return 'other';
};

export const alphabeticallyComparator = (a, b) => {
  if (a.fullNameRu < b.fullNameRu) return -1;
  else if (a.fullNameRu > b.fullNameRu) return 1;
  return 0;
};

export const devOpsUsersSelector = state =>
  state.UserList.devOpsUsers ? state.UserList.devOpsUsers.sort(alphabeticallyComparator) : [];

const sortPerformer = users => {
  const userArray = {
    back: [],
    front: [],
    ios: [],
    android: [],
    qa: [],
    other: []
  };
  users.forEach(user => {
    const role = getRoles(user);
    if (userArray[role]) {
      userArray[role].push(user);
    } else {
      userArray.other.push(user);
    }
  });
  for (const key in userArray) {
    userArray[key].sort(alphabeticallyComparator);
  }
  return userArray;
};

export default sortPerformer;
