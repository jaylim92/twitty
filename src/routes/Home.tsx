import { dbService } from '../fBase';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import Tweety from '../components/Tweety';
import { User } from 'firebase/auth';
import TweetyFactory from '../components/TweetFactory';

export interface IHome {
  userObj: User;
}

const Home = ({ userObj }: IHome) => {
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

  return (
    <div>
      <TweetyFactory userObj={userObj} />
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
