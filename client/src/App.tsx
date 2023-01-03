import './App.css';
import Chat from './pages/Chat';
import { Typography } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <AppBar
        sx={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#388E3C',
        }}
      >
        <Typography style={{ fontWeight: 'bold' }}>Formula Mode</Typography>
      </AppBar>
      <div
        style={{ paddingTop: '60px', height: '100vh' }}
        className="main-content"
      >
        <Chat />
      </div>
    </>
  );
}

export default App;
