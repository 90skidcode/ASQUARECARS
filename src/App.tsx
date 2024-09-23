// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import OtpScreen from './User/OtpScreen.tsx';
import PhoneNumberScreen from './User/Phonenumber';
import { Toaster } from './components/ui/toaster.tsx';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './store/store.ts';
import Register from './User/Register.tsx';
import './App.css';
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
        <Provider store={store}>
            <PersistGate loading={<div>Loading...</div>} persistor={persistor}></PersistGate>
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

                        <Route
                            path="/register"
                            element={
                                <Register />
                            }
                        />

                        {/* Redirect to home if no match */}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Routes>
                    {user && <h3>Welcome, {user.phoneNumber}</h3>}
                    <Toaster />
                </div>
            </Router>
        </Provider>
    );
};

export default App;
