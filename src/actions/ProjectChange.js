import * as ProjectChangeActions from '../constants/ProjectChange';
import axios from 'axios';
import { StartLoading, FinishLoading } from './Loading';

function StartProjectChange () {
  return {
    type: ProjectChangeActions.PROJECT_CHANGE_START
  };
}

function ProjectChangeError (message) {
  return {
    type: ProjectChangeActions.PROJECT_CHANGE_ERROR
  };
}

function ProjectChangeSuccess () {
  return {
    type: ProjectChangeActions.PROJECT_CHANGE_SUCCESS
  };
}

export function ChangeProject (
  id,
  name,
  prefix,
  description,
  statusId,
  notbillable,
  budget,
  riskBudget
) {
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
      params: {
        name: name || null,
        prefix: prefix || null,
        description: description || null,
        statusId: statusId || null,
        notbillable: notbillable || null,
        budget: budget || null,
        riskbudget: riskbudget || null
      }
    });
  };
}
