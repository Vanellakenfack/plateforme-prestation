import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const userType = localStorage.getItem('user_type'); // ou récupère depuis ton contexte/auth

  // Si pas connecté
  if (!userType) {
    return <Navigate to="/login" replace />;
  }

  // Si le rôle n'est pas autorisé
  if (allowedRoles && !allowedRoles.includes(userType)) {
    return <Navigate to="/" replace />;
  }

  // Sinon, accès autorisé
  return children;
};

export default ProtectedRoute;