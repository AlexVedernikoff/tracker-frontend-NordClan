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
    userArray[key].sort((a, b) => {
      if (a.firstNameRu < b.firstNameRu) return -1;
      else if (a.firstNameRu > b.firstNameRu) return 1;
      return 0;
    });
  }
  return userArray;
};

export default sortPerformer;
