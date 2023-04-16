import { DAY_IN_MILISECONDS } from '../constants';

/**
 * get the end of the current day as a unix timestamp in seconds,
 * optionally pass in how many days to add to current date
 */
export function endOfDay(daysToAdd?: number) {
  let dayEnd: number;

  dayEnd = new Date().setHours(23, 59, 59, 999).valueOf();

  if (daysToAdd) {
    dayEnd += daysToAdd * DAY_IN_MILISECONDS;
  }

  return Math.round(dayEnd / 1000);
}
