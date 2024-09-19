// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import OtpScreen from './User/OtpScreen.tsx';
import PhoneNumberScreen from './User/Phonenumber';
import { Toaster } from './components/ui/toaster.tsx';

// A mock "Home" component to represent a protected route
const Home: React.FC = () => <h1>Welcome to the Home Page!</h1>;

// Auth guard component
interface AuthGuardProps {
    children: React.ReactElement;
    isAuthenticated: boolean;
}

const AuthGuard: React.FC<AuthGuardProps> = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/" />;
};

const App: React.FC = () => {
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [user, setUser] = useState<any>(null);

    const handleSendOtp = () => {
        setIsOtpSent(true);
    };

    const handleLoginSuccess = (user: any) => {
        setUser(user);
    };

    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Public routes */}
                    <Route
                        path="/"
                        element={
                            !isOtpSent ? (
                                <PhoneNumberScreen onSendOtp={handleSendOtp} />
                            ) : (
                                <OtpScreen onLoginSuccess={handleLoginSuccess} />
                            )
                        }
                    />
                    
                    {/* Protected route: Home */}
                    <Route
                        path="/home"
                        element={
                            <AuthGuard isAuthenticated={!!user}>
                                <Home />
                            </AuthGuard>
                        }
                    />
                    
                    {/* Redirect to home if no match */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                {user && <h3>Welcome, {user.phoneNumber}</h3>}
                <Toaster />
            </div>
        </Router>
    );
};

export default App;
