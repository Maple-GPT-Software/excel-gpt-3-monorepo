import * as dateUtil from './dateUtils';

/** Tue Mar 21 2023 07:00:00 GMT+0000 as unix timestamp in seconds */
const MARCH_21_2023 = 1679382000;
/** march 15 2023 12:00:00pm on */
const MARCH_15_2023 = 1678906800000;
const MARCH_15_2023_END_OF_DAY = 1678950000;

describe('dateUtil.', () => {
  it('should return the timestamp that represents the end of the current date', () => {
    jest.useFakeTimers().setSystemTime(new Date(MARCH_15_2023));

    expect(dateUtil.endOfDay()).toBe(MARCH_15_2023_END_OF_DAY);
  });

  it('should return the 21st of March 00:00:00 when passing in 5 days to add', () => {
    jest.useFakeTimers().setSystemTime(new Date(MARCH_15_2023));

    expect(dateUtil.endOfDay(5)).toBe(MARCH_21_2023);
  });
});
