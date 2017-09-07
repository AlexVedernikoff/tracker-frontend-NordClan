import { DEMO_ACTION } from '../constants/SocketIO';

const demoAction = (...res) => ({
  type: DEMO_ACTION,
  res
});

export { demoAction };
