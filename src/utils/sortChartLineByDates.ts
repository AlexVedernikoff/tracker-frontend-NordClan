const sortCharLineByDates = (a, b) => {
  const c = new Date(a.x).valueOf();
  const d = new Date(b.x).valueOf();
  return c - d;
};

export default sortCharLineByDates;
