import React from 'react';

import TaskCard from '../../../components/TaskCard';

export const sortTasksAndCreateCard = (
  sortedObject,
  section,
  onChangeStatus,
  onOpenPerformerModal,
  isExternal,
  lightTask,
  lightedTaskId,
  isCardFocus
) => {
  return Object.entries(sortedObject as {[key: string]: any[]}).reduce(
    (accumulator, [key, tasks]) => {
      const newObjectValueCollection = tasks.map(task => {
        const { linkedTasks, id } = task;

        const lightedRelatedTask = linkedTasks.includes(lightedTaskId);
        const lighted = id === lightedTaskId && isCardFocus;

        return (
          <TaskCard
            task={task}
            lightTask={lightTask}
            lighted={lighted}
            lightedTaskId={lightedRelatedTask && !isCardFocus ? lightedTaskId : null}
            key={`task-${id}`}
            section={section}
            isExternal={isExternal}
            onChangeStatus={onChangeStatus}
            onOpenPerformerModal={onOpenPerformerModal}
          />
        );
      });

      return {
        ...accumulator,
        [key]: newObjectValueCollection
      };
    },
    {
      new: [],
      dev: [],
      codeReview: [],
      qa: [],
      done: []
    }
  );
};
