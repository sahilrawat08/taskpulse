// client/src/components/auth/ProtectedRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import { PageLoader } from '../common/Loader';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;