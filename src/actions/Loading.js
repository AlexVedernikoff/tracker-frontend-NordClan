import * as LoadingActions from '../constants/Loading';

const startLoading = () => ({
  type: LoadingActions.LOADING_START
});

const finishLoading = () => ({
  type: LoadingActions.LOADING_FINISH
});

export { startLoading, finishLoading };
