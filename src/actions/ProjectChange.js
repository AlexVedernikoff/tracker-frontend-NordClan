import * as ProjectChangeActions from '../constants/ProjectChange';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';

const StartProjectChange = () => ({
  type: ProjectChangeActions.PROJECT_CHANGE_START
});

const ProjectChangeError = message => ({
  type: ProjectChangeActions.PROJECT_CHANGE_ERROR
});

const ProjectChangeSuccess = () => ({
  type: ProjectChangeActions.PROJECT_CHANGE_SUCCESS
});

export const ChangeProject = (
  id,
  name,
  prefix,
  description,
  statusId,
  notbillable,
  budget,
  riskBudget
) => {
  if (!id) {
    return;
  }

  const URL = `/api/project/${id}`;
  const params = mkobj(
    ['name', name],
    ['prefix', prefix],
    ['description', description],
    ['statusId', statusId],
    ['notbillable', notbillable],
    ['budget', budget],
    ['riskBudget', riskBudget]
  );

  return dispatch => {
    dispatch(StartProjectChange());
    dispatch(StartLoading());

    axios.put(URL, {
      params: params,
      withCredentials: true
    });
  };
};
