import { dbService } from '../fBase';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import Tweety from '../components/Tweety';
import { User } from 'firebase/auth';

interface IHome {
  userObj: User;
}

const Home = ({ userObj }: IHome) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    const q = query(
      collection(dbService, 'twitty'),
      orderBy('createAt', 'desc')
    );
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addDoc(collection(dbService, 'twitty'), {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
    });
    setNweet('');
  };

  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;

    setNweet(value);
  };

  const onFileChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { files },
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    reader.onload = (finihedEvent) => {
      console.log(finihedEvent);
    };
    reader.readAsDataURL(theFile);
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          onChange={onChange}
          type="text"
          placeholder="What's on Your mind?"
          maxLength={120}
        />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Twitty!" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Tweety
            key={nweet.id}
            nweet={nweet}
            isOwner={nweet.creatorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
