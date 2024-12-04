// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';
import { getCookie } from '../helpers/cookies';

function ProtectedRoute({ children }) {
  const token = getCookie('token');
  return token ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
