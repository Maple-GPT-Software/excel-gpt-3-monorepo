import { firebaseUidTo24CharHexString } from './firebaseAuth';

describe('firebaseUidTo24CharHexString', () => {
  it('should create expected 24 character hex string', () => {
    const result = firebaseUidTo24CharHexString('b5Uoybf4FDXeeIEq5DO48edjArS2');
    expect(result).toBe('6235556f7962663446445865');
  });
});
