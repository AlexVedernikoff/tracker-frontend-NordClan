import React from 'react';

import TaskCard from '../../../components/TaskCard';

export const sortTasksAndCreateCard = (
  sortedObject,
  section,
  onChangeStatus,
  onOpenPerformerModal,
  myTaskBoard,
  isExternal,
  lightTask,
  lightedTaskId,
  isCardFocus
) => {
  const taskArray = {
    new: [],
    dev: [],
    codeReview: [],
    qa: [],
    done: []
  };

  for (const key in sortedObject) {
    taskArray[key] = sortedObject[key].map(task => {
      const lightedRelatedTask = task.linkedTasks.includes(lightedTaskId);
      const lighted = task.id === lightedTaskId && isCardFocus;

      return (
        <TaskCard
          task={task}
          lightTask={lightTask}
          lighted={lighted}
          lightedTaskId={lightedRelatedTask && !isCardFocus ? lightedTaskId : null}
          key={`task-${task.id}`}
          section={section}
          isExternal={isExternal}
          onChangeStatus={onChangeStatus}
          onOpenPerformerModal={onOpenPerformerModal}
          myTaskBoard={myTaskBoard}
        />
      );
    });
  }
  return taskArray;
};
