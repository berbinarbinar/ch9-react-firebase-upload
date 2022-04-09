import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyBHhxbTUEy4i1F9Fh3tYGR6GYwBoHt1e2c",
  authDomain: "berbinarbinar-firebase-upload.firebaseapp.com",
  projectId: "berbinarbinar-firebase-upload",
  storageBucket: "berbinarbinar-firebase-upload.appspot.com",
  messagingSenderId: "630188169539",
  appId: "1:630188169539:web:6260adf9f2ca88a5c777f6"
};

const firebaseApp = initializeApp(firebaseConfig)
const storage = getStorage(firebaseApp)

export { storage }