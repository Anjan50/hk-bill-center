// app/page.tsx
'use client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import BillGenerator from '@/components/bills/BillGenerator';

export default function Home() {
  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!}>
      <main className="container mx-auto px-4 py-8">
        <BillGenerator />
      </main>
    </GoogleOAuthProvider>
  );
} 