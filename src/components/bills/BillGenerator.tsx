'use client';
import { useState } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import BillForm from './BillForm';

export default function BillGenerator() {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const login = useGoogleLogin({
    onSuccess: (response) => {
      setAccessToken(response.access_token);
    },
    scope: 'https://www.googleapis.com/auth/spreadsheets',
  });

  if (!accessToken) {
    return (
      <button
        onClick={() => login()}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Sign in with Google
      </button>
    );
  }

  return <BillForm accessToken={accessToken} />;
}