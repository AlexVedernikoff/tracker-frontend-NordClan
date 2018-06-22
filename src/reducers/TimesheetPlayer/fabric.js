const reducerFabric = (actionSet, InitialState) => (state = InitialState, action) => {
  const actionHandler = actionSet[action.type];
  if (actionHandler) {
    return actionHandler(state, action);
  }
  return state;
};

export default reducerFabric;
