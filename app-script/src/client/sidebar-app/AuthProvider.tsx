import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from './types';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Chat from './Chat';
import Refresh from './Refresh';
import { CHAT_ROUTE, LOGIN_ROUTE, SIGNUP_ROUTE } from './constants';

const AuthContext = createContext<
  | {
      user: User | undefined;
      loginWithGoogle: () => void;
      signUpWithGoogle: () => void;
      signOut: () => void;
    }
  | undefined
>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('must be wrapped in AuthContext.Provider');
  }

  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

/**
 * AuthProvider only renders the main application when the user has been authenticated
 * Users can authenticate by login in, singing up or re-opening the app if previously logged in.
 * If the user was previously logged in we refresh their accessToken using firebase's SDK
 */
function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | undefined>(undefined);
  //   const [location, setLocation] = useLocation();
  const navgiate = useNavigate();

  async function loginWithGoogle() {
    navgiate('/');
    const user = await window.googleAuthPopUp();

    // TODO: get actual user profile from API and set it as user state
    setUser(user);
  }

  async function signUpWithGoogle() {
    navgiate('/');
    const user = await window.googleAuthPopUp();

    // TODO:
    setUser(user);
  }

  async function signOut() {
    const auth = await window.getAuth();
    auth.signOut();
    setUser(undefined);
    navgiate(LOGIN_ROUTE);
  }

  useEffect(() => {
    // https://medium.com/geekculture/firebase-auth-with-react-and-typescript-abeebcd7940a
    // TODO: unsubscribe from onAuthStateChanged
    window.getAuth().onAuthStateChanged((user) => {
      if (user) {
        // TODO: verify user and refresh token
        // we can also schedule a refrehs of the user's id token
        // using getIdToken()
        console.log('logged in user is: ', user);
        navgiate(CHAT_ROUTE);
      } else {
        navgiate(LOGIN_ROUTE);
      }
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, signUpWithGoogle, loginWithGoogle, signOut }}
    >
      <Routes>
        <Route path="/" element={<Refresh />} />
        <Route path={LOGIN_ROUTE} element={<Login />} />
        <Route path={SIGNUP_ROUTE} element={<SignUp />} />
        <Route path={CHAT_ROUTE} element={<Chat />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default AuthProvider;