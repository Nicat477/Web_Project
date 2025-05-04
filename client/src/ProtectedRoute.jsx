
import { Outlet, navigate } from 'react-router-dom';

const ProtectedRoutes = () => {
    const user = null; // Simulate an unauthenticated user
    return user ? <Outlet /> : <Navigate to="/"/> // Redirect to login if not authenticated
}
export default ProtectedRoutes;

