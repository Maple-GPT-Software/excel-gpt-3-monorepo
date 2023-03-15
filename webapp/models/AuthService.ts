import { SimplifyUser } from '@/types/simplifyApi';
import { User } from '@firebase/auth-types';

class AuthService {
  private _firebaseUser?: User;
  private _accessToken?: string;
  // we'll need this when we do teams pricing. If a member is under an org we won't fetch
  // billing information
  // TODO: _userProfile
  // private _userProfile: SimplifyUser;

  setCurrentUser(firebaseUser: User, accessToken: string) {
    this._firebaseUser = firebaseUser;
    this._accessToken = accessToken;
  }

  // TODO: if we need firebase user or user profiles outside of react
  // we'll have to add more getters

  get accessToken() {
    if (!this._accessToken) {
      throw new Error('Must be logged in to get accessToken');
    }

    return this._accessToken;
  }
}

export default new AuthService();
