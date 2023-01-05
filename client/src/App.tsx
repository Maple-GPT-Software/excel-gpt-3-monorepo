import './App.css';
import { Outlet } from 'react-router';
import 'react-toastify/dist/ReactToastify.css';
import PrivateLayout from '~shared/components/Layout/PrivateLayout';

function App() {
  return (
    <PrivateLayout>
      <Outlet />
    </PrivateLayout>
  );
}

export default App;
