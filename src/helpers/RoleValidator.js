import { VISOR } from '../constants/Roles';

function checkIsViewer(globalRole) {
  return globalRole === VISOR;
}

export { checkIsViewer };
