export function percentageToRating(percentage) {
  if (percentage === 100.0) {
    return 5;
  } else if (percentage >= 85.0 && percentage < 100.0) {
    return 4;
  } else if (percentage >= 70.0 && percentage < 85.0) {
    return 3;
  } else if (percentage >= 50.0 && percentage < 70.0) {
    return 2;
  } else if (percentage >= 0.0 && percentage < 50.0) {
    return 1;
  }
}
