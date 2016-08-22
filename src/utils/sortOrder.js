const SORT_DIRECTION = {
  NONE: 'NONE',
  ASC: 'ASC',
  DESC: 'DESC'
};

const SORT_SEQUENCE = [
  SORT_DIRECTION.NONE,
  SORT_DIRECTION.ASC,
  SORT_DIRECTION.DESC
];

const SORT_SIGN = {
  [SORT_DIRECTION.ASC]: 1,
  [SORT_DIRECTION.DESC]: -1,
  [SORT_DIRECTION.NONE]: 0
};

const sortOrder = {
  DIRECTION: SORT_DIRECTION,

  SEQUENCE: SORT_SEQUENCE,

  SIGN: SORT_SIGN,

  isSignificant: (order) => {
    return (order === SORT_DIRECTION.ASC) || (order === SORT_DIRECTION.DESC);
  },

  sign: (order) => {
    const key = (typeof order === 'string' || order instanceof String) ?
      order.toUpperCase() : SORT_DIRECTION.NONE;
    return SORT_SIGN.hasOwnProperty(key) ? SORT_SIGN[key] : 0;
  },

  next: (current) => {
    const currentIndex = SORT_SEQUENCE.indexOf(current);
    return SORT_SEQUENCE[(currentIndex + 1) % 3];
  }
};

export default sortOrder;
