import { getObjectKeyByStrRegex } from '~/utils/formatter';
import { isGuide } from '~/guides/utils';
import { guideTask } from '~/guides/Timesheets/const';
import { guideProject, guideProjectTasks, guideUsers, guideUsersProject } from '~/guides/ProjectPage/const';

const guides = {
  put: {
    '/api/v1/task/1': (payload) => ({
      data: [
        {
          ...guideTask,
          ...payload
        }
      ]
    }),
    '/api/v1/timesheet': (payload) => ({
      data: [
        {
          ...payload
        }
      ]
    })
  },
  post: {
    '/api/v1/timesheet': (payload) => ({
      data: [
        {
          ...guideTask,
          ...payload
        }
      ]
    })
  },
  get: {
    '/api/v1/task?currentPage=0': () => ({
        data: {
          data: guideProjectTasks
        }
    }),
    '/api/v1/task': () => ({
      data: {
        data: guideTask
      }
    }),
    '/api/v1/project/1109/users': () => ({
      status: 200,
      data: guideUsersProject
    }),
    '/api/v1/projects/1000': () => ({
      data: guideProject[0]
    }),
    '/api/v1/project': () => ({
      data: guideProject
    })
  }
};

export const applyGuideInterceptors = (requestManager) => {
  requestManager.interceptors.request.use(
    function(request) {
      if (isGuide()) {
        return Promise.reject(request);
      }
      return request;
    },
    function(error) {
      return Promise.reject(error);
    }
  );

  requestManager.interceptors.response.use(
    function(response) {
      return response;
    },
    function(request) {
      const endpoint = request.url;
      const url = new URL(`https://host${endpoint}`);
      const urlKey = `${url.pathname}${url.search}`;
      const guideKey = getObjectKeyByStrRegex(guides[request.method], urlKey);

      if (isGuide() && guideKey) {
        return guides[request.method][guideKey](request.data);
      }

      return Promise.reject(request);
    }
  );
};
