import React, {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import Login from './Login';
import Refresh from './Refresh';
import { CHAT_ROUTE } from './constants';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import SimplifyApi, { SimplifyUserProfile } from './api/SimplifyApi';

/**
 * WARNING! When making changes to this component you have to restart the dev server :(
 * because the app refreshes in a loop
 * However component that are children of <Routes /> are not affected by the refresh loop
 */

interface AuthContextType {
  userProfile?: SimplifyUserProfile;
  accessToken: string;
  loginWithGoogle: () => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('must be wrapped in AuthContext.Provider');
  }

  return context;
};

/** Auth context with userProfile and other optional properties defined. Safe to use this hook within a child of authenticated layout */
export const useAuthenticatedContext = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw Error('must be wrapped in AuthContext.Provider');
  }

  return context as Required<AuthContextType>;
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
  const [userProfile, setUserProfile] = useState<
    SimplifyUserProfile | undefined
  >(undefined);
  const [accessToken, setAccessToken] = useState<string>('');
  const [waitingForFirebase, setWaitingForFirebase] = useState(false);
  const [authErrorMessage, setAuthErrorMessage] = useState('');
  const navgiate = useNavigate();

  function loginWithGoogle() {
    setWaitingForFirebase(true);
    window.googleAuthPopUp();
  }

  function signOut() {
    const auth = window.getAuth();
    auth.signOut();
  }

  useEffect(() => {
    // https://medium.com/geekculture/firebase-auth-with-react-and-typescript-abeebcd7940a
    // TODO: unsubscribe from onAuthStateChanged
    window.getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const accessToken = await user.getIdToken();

        try {
          const profile = await SimplifyApi(accessToken).getUserProfile();
          setWaitingForFirebase(false);
          setUserProfile(profile);
          navgiate(CHAT_ROUTE);
        } catch (error: any) {
          const { message } = error;
          console.log(message);
        }
      } else {
        setWaitingForFirebase(false);
        setUserProfile(undefined);
        setAccessToken('');
        navgiate('/');
      }
    });
  }, []);

  useEffect(() => {
    window.getAuth().onIdTokenChanged((user) => {
      // the case where the user has logged out is handled by onAuthStateChanged listener
      // we get this event when the user first logs in and when firebase periodically refreshes the user's token
      if (user) {
        user
          .getIdToken()
          .then((token) => {
            setAccessToken(token);
          })
          .catch((e) => {
            // firebase API call fails
            signOut();
          })
          .finally(() => {
            setWaitingForFirebase(false);
          });
      }
    });
  });

  /** Refresh access token every 50 minutes */
  useEffect(() => {
    const interval = setInterval(async () => {
      const user = window.getAuth().currentUser;

      if (user) {
        const token = await user.getIdToken();
        setAccessToken(token);
      }
    }, 50 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        accessToken,
        loginWithGoogle,
        signOut,
      }}
    >
      {/* when modal popups we have to wait for user to confirm their login w firebase */}
      {waitingForFirebase && <Refresh />}
      <Routes>
        <Route index element={<Login />} />
        <Route path={CHAT_ROUTE} element={<AuthenticatedLayout />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
