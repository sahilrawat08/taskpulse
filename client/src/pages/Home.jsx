// client/src/pages/Home.jsx - Redirects to dashboard or login
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { PageLoader } from '../components/common/Loader';

const Home = () => {
    const { user, loading } = useContext(AuthContext);
    if (loading) return <PageLoader />;
    return <Navigate to={user ? '/dashboard' : '/login'} replace />;
};

export default Home;
