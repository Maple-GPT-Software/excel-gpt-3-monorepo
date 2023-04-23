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
import { CHAT_ROUTE, CONVERSATION_CHECK_ROUTE } from './constants';
import AuthenticatedLayout from './components/AuthenticatedLayout';
import SimplifyApi, { SimplifyUserProfile } from './api/SimplifyApi';
import ConversationCheck from './ConversationCheck';

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
    const unsubscribe = window.getAuth().onAuthStateChanged(async (user) => {
      if (user) {
        const accessToken = await user.getIdToken();

        try {
          const profile = await SimplifyApi(accessToken).getUserProfile();
          setWaitingForFirebase(false);
          setUserProfile(profile);
          navgiate(CONVERSATION_CHECK_ROUTE);
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

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    /** update access token when access token refreshes */
    const unsubscribe = window.getAuth().onIdTokenChanged(async (user) => {
      if (user) {
        try {
          const token = await user.getIdToken();
          setAccessToken(token);
        } catch (error) {
          signOut();
        }
      }
    });

    return () => {
      unsubscribe();
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
        <Route
          path={CONVERSATION_CHECK_ROUTE}
          element={<ConversationCheck />}
        />
        <Route
          path={`${CHAT_ROUTE}/:conversationId`}
          element={<AuthenticatedLayout />}
        />
      </Routes>
    </AuthContext.Provider>
  );
}

export default AuthProvider;
