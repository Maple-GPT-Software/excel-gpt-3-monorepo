import { MILISECONDS_IN_DAY } from '../constants';

/**
 * get the end of the current day as a unix timestamp in seconds,
 * optionally pass in how many days relative to the present
 */
export function endOfDay(daysToAdd?: number) {
  let dayEnd: number;

  dayEnd = new Date().setHours(23, 59, 59, 999).valueOf();

  if (daysToAdd) {
    dayEnd += daysToAdd * MILISECONDS_IN_DAY;
  }

  return Math.round(dayEnd / 1000);
}
