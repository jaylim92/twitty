import { auth, dbService } from '../fBase';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { updateProfile, User } from 'firebase/auth';
import { AppRouterProps } from '../components/App';

interface IProfile {
  userObj: User;
  refreshUser: () => void;
}

const Profile = ({ refreshUser, userObj }: IProfile) => {
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

  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewDisplayName(value);
  };

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      await updateProfile(auth.currentUser, { displayName: newDisplayName });
      refreshUser();
    }
  };

  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="프로필 이름"
          value={newDisplayName}
        />
        <input type="button" value="프로필 수정" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};

export default Profile;
