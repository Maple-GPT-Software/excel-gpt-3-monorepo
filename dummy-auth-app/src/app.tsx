import { useEffect, useState } from "preact/hooks";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from "firebase/auth";

import "./app.css";
import { Route, Routes } from "react-router-dom";
import Checkout from "./Checkout";
import { Fragment } from "preact/jsx-runtime";

const firebaseConfig = {
  apiKey: "AIzaSyD-HGaNIlqTjZiRQAA6wvKOBjQVUyFwBQQ",
  authDomain: "excel-simplify.firebaseapp.com",
  projectId: "excel-simplify",
  storageBucket: "excel-simplify.appspot.com",
  messagingSenderId: "357936409669",
  appId: "1:357936409669:web:c0b89f9d8f1b13fdf9072c",
  measurementId: "G-NDF54XDW0L",
};

async function redirectToCheckout(accessToken: string) {
  const res = await fetch(
    "http://localhost:3000/payment/subscription-session",
    {
      method: "POST",
      body: JSON.stringify({
        priceId: "price_1MdLWWGB7M3KTCGBlQufaDuk",
      }),
      redirect: "follow",
      headers: {
        "Content-Type": "application/json",
        authorization: `acces ${accessToken}`,
      },
    }
  );

  const { url } = await res.json();

  window.location.href = url;
}

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export function App() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [accessToken, setAccessToken] = useState<string | null>("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        console.log(user);
        user.getIdToken().then((token) => setAccessToken(token));
        setUser(user);
      } else {
        setUser(undefined);
        setAccessToken(null);
      }
    });
  });

  return (
    <div style={{ display: "grid", gridTemplateColumns: "50% 50%" }}>
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
        <button onClick={() => redirectToCheckout(accessToken)}>
          Free trial checkout
        </button>
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
      </div>
      <Routes>
        <Route path="/registration/checkout" element={<Checkout />} />
      </Routes>
    </div>
  );
}
