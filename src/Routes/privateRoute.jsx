import React from 'react';
import showToast from '../utils/toast';
import { Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const PrivateRoute = ({ children, allowedRoles }) => {
    const userRole = sessionStorage.getItem('User');
    const { t } = useTranslation()

    if (!userRole || !allowedRoles.includes(userRole)) {
        setTimeout(() => { showToast('error', t('permissionError')) }, 500)
        return <Navigate to="/" replace />;
    }
    return children;
};

export default PrivateRoute;