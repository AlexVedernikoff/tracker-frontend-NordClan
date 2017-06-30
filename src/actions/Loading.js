import * as LoadingActions from "../constants/Loading";

function StartLoading () {
  return {
    type: LoadingActions.LOADING_START
  }
}

function FinishLoading () {
  return {
    type: LoadingActions.LOADING_FINISH
  }
}

export { StartLoading, FinishLoading };
