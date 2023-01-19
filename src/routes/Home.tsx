import { dbService, storageService } from '../fBase';
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from 'firebase/firestore';
import React, { useEffect, useRef, useState } from 'react';
import Tweety from '../components/Tweety';
import { User } from 'firebase/auth';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from 'firebase/storage';
import { v4 as uuid } from 'uuid';

interface IHome {
  userObj: User;
}

const Home = ({ userObj }: IHome) => {
  const [nweet, setNweet] = useState('');
  const [nweets, setNweets] = useState([]);
  const [file, setFile] = useState('');
  const fileInput = useRef<HTMLInputElement>(null);

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
    const storageRef = ref(storageService, `${userObj.uid}/${uuid()}`);
    const response = await uploadString(storageRef, file, 'data_url');
    const fileUrl = await getDownloadURL(response.ref);
    await addDoc(collection(dbService, 'twitty'), {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      fileUrl,
    });
    setNweet('');
    setFile('');
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
    reader.onload = () => {
      setFile(reader.result);
    };
    reader.readAsDataURL(theFile);
  };
  const onClearFile = () => {
    setFile(null);
    fileInput.current.value = null;
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
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="Twitty!" />
        {file && (
          <div>
            <img src={file} width="150px" height="150px" />
            <button onClick={onClearFile}>Clear</button>
          </div>
        )}
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
