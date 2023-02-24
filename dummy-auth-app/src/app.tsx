import { useEffect, useState } from "preact/hooks";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

import preactLogo from "./assets/preact.svg";
import "./app.css";

const firebaseConfig = {
  apiKey: "AIzaSyD-HGaNIlqTjZiRQAA6wvKOBjQVUyFwBQQ",
  authDomain: "excel-simplify.firebaseapp.com",
  projectId: "excel-simplify",
  storageBucket: "excel-simplify.appspot.com",
  messagingSenderId: "357936409669",
  appId: "1:357936409669:web:c0b89f9d8f1b13fdf9072c",
  measurementId: "G-NDF54XDW0L",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        user.getIdToken().then((token) => setAccessToken(token));
        setUser(user);
      } else {
        setUser(undefined);
        setAccessToken(null);
      }
    });
  });

  return (
    <>
      <div>
        <button
          onClick={() => {
            signInWithPopup(auth, googleProvider);
          }}
        >
          login
        </button>
        <button
          style={{ marginLeft: "1rem" }}
          onClick={() => {
            auth.signOut();
          }}
        >
          logout
        </button>
      </div>
      {accessToken && (
        <>
          <button
            style={{ marginTop: "1rem" }}
            onClick={() => {
              navigator.clipboard.writeText(accessToken);
            }}
          >
            Copy Access Token
          </button>
          <p style={{ maxWidth: "500px", wordBreak: "break-word" }}>
            {accessToken.slice(0, 50) + "...."}
          </p>
        </>
      )}
    </>
  );
}
