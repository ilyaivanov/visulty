export const formatTime = (time: number) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  const padZeros = (val: number): string => (val < 10 ? "0" + val : "" + val);

  return `${padZeros(minutes)}:${padZeros(seconds)}`;
};
