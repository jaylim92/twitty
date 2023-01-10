import React, { useEffect, useState } from 'react';
import AppRouter from './Router';
import { auth } from '../fBase';
import { NextOrObserver, User } from 'firebase/auth';

export interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: User;
}

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<User | null>(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
        console.log(user);
      }
      setInit(true);
    });
  }, []);
  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        'initialing...'
      )}
      <footer>&copy; {new Date().getFullYear()}Twitty</footer>
    </>
  );
}

export default App;
