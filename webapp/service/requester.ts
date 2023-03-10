import settings from '@/settings';
import { User } from '@/utils/types';
import axios from 'axios';

class Requester {
  headerConfig: {
    accessToken: string;
  };
  error: string | undefined;
  user: User | undefined;

  constructor(accessToken: string) {
    this.headerConfig = { accessToken };
  }

  async login(user: User) {
    const loginUrl = settings.simplfyBasUrl + '/login';
    try {
      const response = await axios.post(
        loginUrl,
        { referrer: user.referrer, signUpSource: user.signUpSource },
        {
          headers: {
            Authorization: `Basic ${this.headerConfig.accessToken}`,
          },
        }
      );
      this.user = response.data;
    } catch (e) {
      this.error = 'login: Invalid User';
    }
  }

  async signUp(user: User, accessToken: string, hasAcceptedTerms: boolean) {
    const signUpUrl = settings.simplfyBasUrl + '/signup';
    try {
      const response = await axios.post(
        signUpUrl,
        { ...user, hasAcceptedTerms: hasAcceptedTerms },
        {
          headers: {
            Authorization: `Basic ${accessToken}`,
          },
        }
      );
    } catch (e) {
      this.error = 'signup: Problem Occured';
    }
  }
}

export default Requester;
