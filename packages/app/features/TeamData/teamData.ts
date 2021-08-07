export const assumedMax = {
  teamStrength: 1500,
};

export const assumedMin = {
  teamStrength: 1000,
};

export const getTeamsStrengthPercent = (strength: number): number =>
  (100 * (strength - assumedMin.teamStrength)) /
  (assumedMax.teamStrength - assumedMin.teamStrength);
