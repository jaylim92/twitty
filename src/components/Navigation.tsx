import React from 'react';
import { Link } from 'react-router-dom';
import Home from 'routes/Home';
import { IHome } from '../routes/Home';

const Navigation = ({ userObj }: IHome) => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/profile">{userObj.displayName}의 Profile</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
