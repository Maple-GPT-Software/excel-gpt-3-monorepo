import React, {
  createContext,
  ReactNode,
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

const AuthContext = createContext<
  | {
      userProfile: SimplifyUserProfile | undefined;
      accessToken: string;
      loginWithGoogle: () => void;
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
  const [userProfile, setUserProfile] = useState<
    SimplifyUserProfile | undefined
  >(undefined);
  const [accessToken, setAccessToken] = useState<string>('');
  const [showSpinner, setShowSpinner] = useState(false);
  //   const [location, setLocation] = useLocation();
  const navgiate = useNavigate();

  function loginWithGoogle() {
    setShowSpinner(true);
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

        const profile = await SimplifyApi(accessToken).getUserProfile();

        setShowSpinner(false);
        setUserProfile(profile);
        navgiate(CHAT_ROUTE);
      } else {
        setShowSpinner(false);
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
            setShowSpinner(false);
          });
      }
    });
  });

  return (
    <AuthContext.Provider
      value={{
        userProfile,
        accessToken,
        loginWithGoogle,
        signOut,
      }}
    >
      {showSpinner && <Refresh />}
      <Routes>
        <Route index element={<Login />} />
        <Route path={CHAT_ROUTE} element={<AuthenticatedLayout />} />
      </Routes>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
