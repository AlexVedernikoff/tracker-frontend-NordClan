const getRoles = user => {
  const roles = [];
  for (const key in user.roles) {
    if (user.roles[key]) {
      roles.push(key);
    }
  }

  if (roles.length) {
    return roles;
  }

  return 'other';
};

export const alphabeticallyComparatorLang = lang => {
  const fullName = lang === 'en' ? 'fullNameEn' : 'fullNameRu';

  return (a, b) => {
    if (a[fullName] < b[fullName]) {
      return -1;
    }

    return 1;
  };
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
    devops: [],
    pm: [],
    teamLead: [],
    account: [],
    analyst: [],
    back: [],
    front: [],
    ux: [],
    mobile: [],
    ios: [],
    android: [],
    qa: [],
    other: []
  };
  users.forEach(user => {
    const roles = getRoles(user);
    roles.forEach(role => {
      if (userArray[role]) {
        userArray[role].push(user);
      } else {
        userArray.other.push(user);
      }
    });
  });
  for (const key in userArray) {
    userArray[key].sort(alphabeticallyComparator);
  }
  return userArray;
};

export default sortPerformer;
