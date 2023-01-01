import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import Chat from "./pages/Chat";
import {
  ThemeOptions,
  ThemeProvider,
  createTheme,
  Typography,
} from "@mui/material";
import AppBar from "@mui/material/AppBar";

const lightTheme: ThemeOptions = {
  palette: {
    primary: {
      light: "#66BB6A",
      main: "#388E3C",
      dark: "#1B5E20",
    },
    secondary: {
      main: "#373F47",
    },
    mode: "light",
  },
};

function App() {
  return (
    <>
      <ThemeProvider theme={createTheme(lightTheme)}>
        <AppBar
          sx={{
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#388E3C",
          }}
        >
          <Typography style={{ fontWeight: "bold" }}>Formula Mode</Typography>
        </AppBar>
        <div style={{ paddingTop: "60px" }} className="main-content">
          <Chat />
        </div>
      </ThemeProvider>
    </>
  );
}

export default App;
