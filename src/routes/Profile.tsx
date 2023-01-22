import { auth, dbService } from '../fBase';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { IHome } from './Home';

const Profile = ({ userObj }: IHome) => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    auth.signOut();
    navigate('/');
  };

  const getMyTweety = async () => {
    const q = query(
      collection(dbService, 'twitty'),
      orderBy('createAt', 'desc'),
      where('creatorId', '==', userObj.uid)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, '=>', doc.data());
    });
  };

  useEffect(() => {
    getMyTweety();
  }, []);

  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
