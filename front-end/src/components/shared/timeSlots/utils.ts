export const getTimeOfDay = (startTime: string) => {
  const hour = new Date(startTime).getHours();
  if (hour >= 0 && hour < 12) return "morning";
  if (hour >= 12 && hour < 18) return "evening";
  return "night";
};

export const isSlotTimeout = (startTime: string) =>
  new Date(startTime) < new Date();
