import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { User } from './types';
import { Route, Router, useLocation, useRouter, Link } from 'wouter';
import Login from './Login';
import SignUp from './SignUp';
import Chat from './Chat';
import { isProd } from './settings';
import Refresh from './Refresh';

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
  const [location, setLocation] = useLocation();

  async function loginWithGoogle() {
    const user = await window.googleAuthPopUp();

    // TODO: get actual user profile from API and set it as user state
    setUser(user);
  }

  async function signUpWithGoogle() {
    const user = await window.googleAuthPopUp();

    // TODO:
    setUser(user);
  }

  async function signOut() {
    const auth = await window.getAuth();
    auth.signOut();
  }

  useEffect(() => {
    window.getAuth().onAuthStateChanged((user) => {
      if (user) {
        // TODO: verify user and refresh token
        // we can also schedule a refrehs of the user's id token
        // using getIdToken()
        console.log('logged in user is: ', user);
        setLocation('/sidebar-app-impl.html/chat');
      } else {
        console.log('no one logged in');
      }
    });
  }, []);

  //   let defaultChildren: ReactNode;

  //   if (user) {
  //     defaultChildren = children;
  //   } else {
  //     defaultChildren = <Login />;
  //   }

  return (
    <AuthContext.Provider
      value={{ user, signUpWithGoogle, loginWithGoogle, signOut }}
    >
      <Router base={isProd ? '/userCodeAppPanel' : '/sidebar-app-impl.html'}>
        <Route path="/">
          <Refresh />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <SignUp />
        </Route>
        <Route path="/chat">
          <Chat />
        </Route>
        {/* <button onClick={() => setLocation('/sidebar-app-impl.html/')}>
          login page
        </button>
        <Link href="/">login</Link> */}
        {/* <Route path="/refresh">
      </Route> */}
      </Router>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
