// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';

const firebaseConfig = {
    apiKey: 'YOUR_API_KEY',
    authDomain: 'YOUR_AUTH_DOMAIN',
    projectId: 'YOUR_PROJECT_ID',
    storageBucket: 'YOUR_STORAGE_BUCKET',
    messagingSenderId: 'YOUR_MESSAGING_SENDER_ID',
    appId: 'YOUR_APP_ID',
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Set up reCAPTCHA verifier
const setUpRecaptcha = (containerId: string): RecaptchaVerifier => {
    return new RecaptchaVerifier(containerId, {
        size: 'invisible',
        callback: (response: any) => {
            console.log('reCAPTCHA solved:', response);
        },
    }, auth);
};

export { auth, setUpRecaptcha, signInWithPhoneNumber };
