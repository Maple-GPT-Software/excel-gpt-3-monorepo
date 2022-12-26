import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [count, setCount] = useState(0);
  const notify = () => toast("Wow so easy!");

  return (
    <>
      <h1 className="text-green text-3xl font-bold underline">Hello world!</h1>
      <div>
        <button onClick={notify}>Notify!</button>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;
