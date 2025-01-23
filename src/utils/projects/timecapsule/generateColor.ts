export const generateColor = () => {
  return `hsl(${Math.random() * 360}, ${50 + Math.random() * 45}%, ${70 + Math.random() * 20}%)`;
};
