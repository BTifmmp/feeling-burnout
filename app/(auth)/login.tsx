import { use, useEffect, useState } from 'react';
import PageBase from '@/components/login/PageBase';
import SignIn, { SignInFooter } from '@/components/login/SignIn';
import SignUp, { SignUpFooter } from '@/components/login/SignUp';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

export default function LoginPage() {
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-in');
  const { user, userLoading } = useAuthStore();

  const toggleMode = () => {
    setMode(prev => (prev === 'sign-in' ? 'sign-up' : 'sign-in'));
  };


  useEffect(() => {
    if (userLoading) {
      return;
    }
    if (user && user.confirmed_at) {
      router.replace('/');
    }
    if (user && !user.confirmed_at) {
      router.replace('/email-verification');
    }
  }, [user, userLoading]);


  return (
    <PageBase
      mode={mode}
      footer={mode === 'sign-in' ? <SignInFooter onActionPress={toggleMode} /> : <SignUpFooter onActionPress={toggleMode} />}
    >
      {mode === 'sign-in' ? <SignIn /> : <SignUp />}
    </PageBase>
  );
}
