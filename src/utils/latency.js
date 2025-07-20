// Simulate latency between 50-200ms
export const simulateLatency = () => {
  const ms = Math.floor(Math.random() * 150) + 50;
  return new Promise(resolve => setTimeout(resolve, ms));
};
