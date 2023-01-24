import { storageService } from '../fBase';
import { uploadString, getDownloadURL, ref } from 'firebase/storage';
import { dbService } from '../fBase';
import { addDoc, collection } from 'firebase/firestore';
import { useState, useRef } from 'react';
import { v4 as uuid } from 'uuid';
import { IHome } from '../routes/Home';

const TweetyFactory = ({ userObj }: IHome) => {
  const [nweet, setNweet] = useState('');
  const [file, setFile] = useState<string>('');
  const fileInput = useRef<HTMLInputElement>(null);

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let fileUrl = '';
    if (fileUrl !== '') {
      const storageRef = ref(storageService, `${userObj.uid}/${uuid()}`);
      const response = await uploadString(storageRef, file, 'data_url');
      fileUrl = await getDownloadURL(response.ref);
    }

    const tweetyObj = {
      text: nweet,
      createAt: Date.now(),
      creatorId: userObj.uid,
      fileUrl,
    };

    await addDoc(collection(dbService, 'twitty'), tweetyObj);
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
  );
};

export default TweetyFactory;
