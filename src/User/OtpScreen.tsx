// src/components/OtpScreen.tsx
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/hooks/use-toast';
import React, { useState } from 'react';

interface OtpScreenProps {
    onLoginSuccess: (user: any) => void;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ onLoginSuccess }) => {
    const [otp, setOtp] = useState<string>('');

    const handleVerifyOtp = async () => {
        if (!otp) {
            toast.error('Please enter the OTP.');
            return;
        }

        try {
            const result = await window.confirmationResult.confirm(otp);
            onLoginSuccess(result.user);
            toast.success('Login successful!');
        } catch (error) {
            toast.error('Invalid OTP. Please try again.');
            console.error('Error verifying OTP:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Enter the OTP</h2>
            <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="mb-4"
            />
            <Button onClick={handleVerifyOtp}>Verify OTP</Button>
        </div>
    );
};

export default OtpScreen;
