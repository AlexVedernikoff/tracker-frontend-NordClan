export default function getPriorityById (priorityId) {
  let priority;

  switch (priorityId) {
  case 1: priority = 'Highest';
    break;
  case 2: priority = 'High'; 
    break;
  case 3: priority = 'Average'; 
    break;
  case 4: priority = 'Low'; 
    break;
  case 5: priority = 'Lowest'; 
    break;
  default: break;
  }
  return priority;
}
