export const moveArrayItem = <T>(
  source: Array<T>,
  from: number,
  to: number
) => {
  const data = [...source];

  data.splice(to, 0, data.splice(from, 1)[0]);

  return data;
};
