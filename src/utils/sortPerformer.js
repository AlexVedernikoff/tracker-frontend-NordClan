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
    pm: [],
    account: [],
    analyst: [],
    teamLead: [],
    ux: [],
    back: [],
    front: [],
    mobile: [],
    ios: [],
    android: [],
    qa: [],
    devops: [],
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
      if (a.lastNameRu < b.lastNameRu) return -1;
      else if (a.lastNameRu > b.lastNameRu) return 1;
      return 0;
    });
  }
  return userArray;
};

export default sortPerformer;
