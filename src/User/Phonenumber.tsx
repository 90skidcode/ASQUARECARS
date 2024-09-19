import React, { useState } from 'react';
import { auth } from '../utils/firebase';
import { toast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import logo from "../assets/logo.png";
import { RecaptchaVerifier } from 'firebase/auth';

interface PhoneNumberScreenProps {
    onSendOtp: () => void;
}

const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = ({ onSendOtp }) => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');

    const handleSendOtp = async () => {
        if (!phoneNumber) {
            toast({
                variant: "destructive",
                title: "Please enter a valid phone number."
            });
            return;
        }

        try {
            if (!window?.recaptchaVerifier)
                recaptchaVerifier();
            onSendOtp();
            toast.success('OTP sent successfully!');
        } catch (error) {
            console.log('===============window?.recaptchaVerifier=====================');
            console.log(window);
            console.log('====================================');
            toast({
                variant: "destructive",
                title: "Failed to send OTP. Please try again."
            });
            console.error('Error sending OTP:', error);
        }
    };

    const recaptchaVerifier = () => {
        //window.recaptchaVerifier.recaptcha.reset();
        window.recaptchaVerifier = new RecaptchaVerifier('recaptcha-container', {
            'size': 'invisible',
            'callback': () => { }
        }, auth);
    }

    return (
        <div className="flex flex-col items-center justify-between h-screen bg-black overflow-hidden">
            <div></div>
            <img src={logo} alt='logo' className="" />
            <div className="w-full flex flex-col p-2 pb-5">
                <h1 className="text-2xl font-semibold mb-6 text-left text-white">Log in to continue your journey.</h1>
                <Input
                    type="tel"
                    placeholder="98765 41230"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="mb-4 text-white"
                />
                <Button className='bg-orange-600 focus:bg-orange-700' onClick={handleSendOtp}>Send OTP</Button>
                <div id="recaptcha-container"></div>
            </div>
        </div>
    );
};

export default PhoneNumberScreen;
