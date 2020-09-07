const sortCharLineByDates = (a, b) => {
  const c = new Date(a.x);
  const d = new Date(b.x);
  return c - d;
};

export default sortCharLineByDates;
