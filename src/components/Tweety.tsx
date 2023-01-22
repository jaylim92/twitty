import { dbService, storageService } from '../fBase';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { deleteObject, ref } from 'firebase/storage';

interface ITweety {
  nweet: INweet;
  isOwner: boolean;
}

interface INweet {
  text: string;
  createAt: number;
  creatorId: string;
  id: number;
  fileUrl: string;
}

const Tweety = ({ nweet, isOwner }: ITweety) => {
  const [editText, setEditText] = useState(false);
  const [newTweety, setNewTweety] = useState(nweet.text);
  const onDeleteClick = async () => {
    const ok = window.confirm('Are you sure you want to delete?');
    if (ok) {
      // Delete Tweety
      await deleteDoc(doc(dbService, 'twitty', `${nweet.id}`));
      await deleteObject(ref(storageService, nweet.fileUrl));
    }
  };
  const toggleEditText = () => setEditText((prev) => !prev);
  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateDoc(doc(dbService, 'twitty', `${nweet.id}`), {
      text: newTweety,
    });
    setEditText((prev) => !prev);
  };
  const onChange = (event: React.FormEvent<HTMLInputElement>) => {
    const {
      currentTarget: { value },
    } = event;
    setNewTweety(value);
  };
  return (
    <>
      {nweet.fileUrl ? <img src={nweet.fileUrl} alt="image" /> : null}
      <h4>{nweet.text}</h4>
      {editText ? (
        <>
          <form onSubmit={onSubmit}>
            <input type="text" value={newTweety} onChange={onChange} required />
            <input type="submit" value="Update" />
            <button onClick={toggleEditText}>Cancel</button>
          </form>
        </>
      ) : (
        isOwner && (
          <>
            <button onClick={onDeleteClick}>Delete Tweety</button>
            <button onClick={toggleEditText}>Edit Tweety</button>
          </>
        )
      )}
    </>
  );
};

export default Tweety;
