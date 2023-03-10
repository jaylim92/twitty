import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import Profile from '../routes/Profile';
import Auth from '../routes/Auth';
import Home from '../routes/Home';
import Navigation from './Navigation';
import { AppRouterProps } from './App';

const AppRouter = ({ isLoggedIn, userObj, refreshUser }: AppRouterProps) => {
  return (
    <Router>
      {isLoggedIn && <Navigation userObj={userObj} />}
      <Routes>
        {isLoggedIn ? (
          <>
            <Route path="/" element={<Home userObj={userObj} />} />
            <Route
              path="/profile"
              element={<Profile refreshUser={refreshUser} userObj={userObj} />}
            />
          </>
        ) : (
          <Route path="/" element={<Auth />} />
        )}
      </Routes>
    </Router>
  );
};

export default AppRouter;
