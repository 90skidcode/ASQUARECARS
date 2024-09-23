import React, { SetStateAction, useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";

import logo from "../assets/logo.png";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { initializeApp, FirebaseApp } from 'firebase/app';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearUser, setUser } from '@/store/userSlice';
import PostApi from '@/services/PostApi';
import { api } from '@/api/api';
import { useToast } from "@/hooks/use-toast";

interface PhoneNumberScreenProps { }

// Extend the window object to add recaptchaVerifier and confirmationResult
declare global {
    interface Window {
        recaptchaVerifier: RecaptchaVerifier;
        confirmationResult: ConfirmationResult;
    }
}

const PhoneNumberScreen: React.FC<PhoneNumberScreenProps> = () => {
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [otp, setOtp] = useState<number>('');
    const [error, setError] = useState<string>('');
    const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [checkUser, setCheckUser] = useState<boolean>(false);
    const [timer, setTimer] = useState<number>(5);

    const user = useSelector((state: any) => state.user);
    const phoneNumberRef = useRef<HTMLInputElement | null>(null);
    const otpRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useDispatch();
    const router = useNavigate();

    const firebaseConfig = {
        apiKey: "AIzaSyAIaBeiQ_Eer_eeY5kdkpFIsIGLu_DeUik",
        authDomain: "asquare-4a4aa.firebaseapp.com",
        projectId: "asquare-4a4aa",
        storageBucket: "asquare-4a4aa.appspot.com",
        messagingSenderId: "253981945159",
        appId: "1:253981945159:web:dc95903a871859eb09b062",
        measurementId: "G-FC5T1BLVND"
    };

    // Initialize Firebase
    const app: FirebaseApp = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    auth.languageCode = 'en';
    const { toast } = useToast();

    const recaptchaVerifier = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
            size: 'invisible',
            callback: (response: any) => {
                // reCAPTCHA successful
            }
        });
    };

    const requestOtp = async () => {
        setError('');
        setLoading(true);

        if (phoneNumber.length === 10) {
            sendOTP();
            setTimeout(() => {
                if (otpRef.current) {
                    otpRef.current.focus();
                }
            }, 100);
        } else {
            toast({
                variant: "destructive",
                description: "Please enter a valid phone number",
            });
            setLoading(false);
        }
    };

    const sendOTP = () => {
        startTimer();

        // Initialize the RecaptchaVerifier if not already done
        recaptchaVerifier();

        if (!window.recaptchaVerifier) {
            setError('Recaptcha failed to load. Please refresh the page and try again.');
            setLoading(false);
            return;
        }

        // reCAPTCHA solved, allow signInWithPhoneNumber.
        signInWithPhoneNumber(auth, '+91' + phoneNumber, window.recaptchaVerifier)
            .then((confirmationResult: ConfirmationResult) => {
                window.confirmationResult = confirmationResult;
                setLoading(false);
                setIsOtpSent(true);
            })
            .catch((error: any) => {
                setLoading(false);
                toast({
                    variant: "destructive",
                    description: error.message || 'Something went wrong. Please try again!',
                });
            });
    };

    const verifyOTP = () => {
        setError('');
        setLoading(true);

        if (otp.length > 5) {
            if (checkUser) {
                userLogin(true);
            } else {
                window.confirmationResult
                    .confirm(otp)
                    .then(() => {
                        userLogin(false);
                    })
                    .catch((error: unknown) => {
                        setLoading(false);
                        toast({
                            variant: "destructive",
                            description: error?.message || 'Something went wrong. Please try again!',
                        });
                    });
            }
        } else {
            toast({
                variant: "destructive",
                description: 'Please enter a valid OTP',
            });
            setLoading(false);
        }
    };

    const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleOtpChange = (value: number) => {
        setOtp(value);
    };

    const userLogin = (flag: boolean) => {
        PostApi(api.loginCheck, { "phoneNumber": phoneNumber }).then((e: any) => {
            if (e.responcePostData.data[0]) {
                sessionStorage.setItem('login', 'true');
                setLoading(false);
                dispatch(clearUser());
                e.responcePostData.data[0].status ?  dispatch(setUser(e.responcePostData.data[0])) :'';
                e.responcePostData.data[0].status ? router('/home') : router('/register');
            } 
        });
    };

    const resendOTP = () => {
        setCheckUser(false);
        sendOTP();
    };

    const startTimer = () => {
        setTimer(5);

        const interval = setInterval(() => {
            setTimer(prevTimer => prevTimer - 1);
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
        }, 90000);
    };

    useEffect(() => {
        if (user[0]) {
            router('/rental-car');
        }
        if (phoneNumberRef.current) {
            phoneNumberRef.current.focus();
        }
    }, [user, router]);

    return (
        <div className="flex flex-col items-center justify-between h-screen bg-black overflow-hidden">
            <div></div>
            <img src={logo} alt='logo' className="" />
            {!isOtpSent ? (
                <div className="w-full flex flex-col p-2 pb-5">
                    <h1 className="text-2xl font-semibold mb-6 text-left text-white">
                        Log in to continue your journey.
                    </h1>
                    <Input
                        ref={phoneNumberRef}
                        type="tel"
                        placeholder="98765 41230"
                        value={phoneNumber}
                        onChange={handlePhoneNumberChange}
                        className="mb-4 text-white h-14 text-2xl input-bg"
                    />
                    <Button className='bg-orange-600 focus:bg-orange-700 h-14' onClick={requestOtp}>
                        Let's Start
                    </Button>
                    <div id="recaptcha-container"></div>
                </div>
            ) : <div className="w-full flex flex-col p-2 pb-5">
                <h1 className="text-2xl font-semibold mb-2 text-left text-white">
                    Verification Code
                </h1>
                <p className='text-md font-semibold mb-6 text-left text-white'>We have sent the verification code to your phone number <span className='text-orange-600'>+91-{phoneNumber}</span> <span onClick={() => { setIsOtpSent(false) }} className=' text-white underline'>edit</span></p>
                <InputOTP maxLength={6} onChange={(value) => handleOtpChange(value)} >
                    <InputOTPGroup className='mb-5 flex justify-between w-full'>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                    </InputOTPGroup>
                </InputOTP>
                <Button className='bg-orange-600 focus:bg-orange-700 h-14' onClick={verifyOTP}>
                    Verify OTP
                </Button>
                <p className={`${timer < 0 ? 'text-orange-600' : 'text-gray-500'} text-center mt-3`} onClick={() => { !timer ? requestOtp : '' }}>Resend OTP {timer > 0 ? (timer) : ''}</p>
                <div id="recaptcha-container" className='hidden'></div>
            </div>}
        </div>
    );
};

export default PhoneNumberScreen;
