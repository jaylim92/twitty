import React, { useEffect, useState } from 'react';
import AppRouter from './Router';
import { auth } from '../fBase';
import { User, updateCurrentUser } from 'firebase/auth';

export interface AppRouterProps {
  isLoggedIn: boolean;
  userObj: User;
  refreshUser: () => void;
}

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState<User | null>(null);
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUserObj(user);
        console.log(user);
      } else {
        setUserObj(null);
      }
      setInit(true);
    });
  }, []);

  const refreshUser = async () => {
    await updateCurrentUser(auth, auth.currentUser);
    setUserObj(auth.currentUser);
  };

  return (
    <>
      {init ? (
        <AppRouter
          refreshUser={refreshUser}
          isLoggedIn={Boolean(userObj)}
          userObj={userObj}
        />
      ) : (
        'initialing...'
      )}
      <footer>&copy; {new Date().getFullYear()}Twitty</footer>
    </>
  );
}

export default App;
