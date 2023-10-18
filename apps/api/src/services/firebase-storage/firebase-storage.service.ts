// eslint-disable-next-line import/no-extraneous-dependencies
import { initializeApp } from 'firebase/app';
// eslint-disable-next-line import/no-extraneous-dependencies
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from 'firebase/storage';
// eslint-disable-next-line import/no-extraneous-dependencies
import { File } from '@koa/multer';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { UploadResult } from '@firebase/storage';
import config from '../../config';

const firebaseService = initializeApp({
  apiKey: config.FIREBASE_API_KEY,
  authDomain: config.FIREBASE_AUTH_DOMAIN,
  projectId: config.FIREBASE_PROJECT_ID,
  storageBucket: config.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: config.FIREBASE_MESSAGING_SENDER_ID,
  appId: config.FIREBASE_APP_ID,
  measurementId: config.FIREBASE_MEASUREMENT_ID,
});
const storage = getStorage(firebaseService);

const uploadPublic = async (fileName: string, file: File): Promise<UploadResult> => {
  const storageRef = ref(storage);
  const publicSectionRef = ref(storageRef, 'public');
  const fileRef = ref(publicSectionRef, fileName);

  const { ref: refResult } = await uploadBytes(fileRef, file.buffer);

  return getDownloadURL(refResult);
};

const getFilePath = async (fileUrl: string) => {
  try {
    const fileRef = ref(storage, fileUrl);
    return fileRef.fullPath;
  } catch (e) {
    return;
  }
};

const removeObject = async (filePath: string): Promise<void> => {
  const fileRef = ref(storage, filePath);

  return deleteObject(fileRef);
};

export default {
  uploadPublic,
  removeObject,
  getFilePath,
};
