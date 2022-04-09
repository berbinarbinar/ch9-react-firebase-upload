import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../config/firebase';

export default function UploadSingle() {
  const [image, setImage] = useState();
  const [preview, setPreview] = useState();
  const [dwnldUrl, setDwnldUrl] = useState();

  useEffect(() => {
    if (!image) {
      setPreview(
        'https://via.placeholder.com/600x400/c71818/ffffff?text=ini+image+placeholder'
      );
      return;
    }
    const objUrl = URL.createObjectURL(image);
    setPreview(objUrl);
    return () => URL.revokeObjectURL(objUrl);
  }, [image]);

  const handleChange = (e) => {
    if (!e.target.files) {
      setImage(undefined);
    }
    setImage(e.target.files[0]);
    handleUpload();
  };

  const handleUpload = () => {
    // ref(storage, namaFoler/namaFolder/namaFolder/namaFile)
    const storageRef = ref(storage, `images/${image.name}`);

    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`file upload is ` + progress + ` % done`);
        switch (snapshot.state) {
          case 'paused':
            console.log('upload is paused');
            break;
          case 'running':
            console.log('upload is running');
            break;
          case 'error':
            console.log('error happened');
            break;
          case 'canceled':
            console.log('upload is cancelled');
            break;
          default:
            break;
        }
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
          console.log('file available at', downloadUrl);
          setDwnldUrl(dwnldUrl);
        });
      }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.currentTarget);
    /**
     * ini dilakukan kalau misal gak pake bantuan formik
     * kalau pake formik gak pake ini
     * nanti intinya ngirim data keseluruhan itu diambil dari si state yang udah di set
     */

    if (!dwnldUrl) {
      alert('please upload file first');
    }
  };

  return (
    <>
      <h1>Upload Single File</h1>
      <br />
      <img src={preview} alt='iniimage' style={{ maxWidth: '300px' }} />
      <br />
      <input type='file' onChange={handleChange} />

      <br />
      <button onClick={handleUpload}>Upload</button>

      <br />
      <p>{dwnldUrl}</p>

      {/* <form onSubmit={handleSubmit}>
        <label>name</label>
        <input type='text' name='name'></input>
        <br />
        <label>product details</label>
        <input type='text' name='details'></input>
        <br />
        <label>price</label>
        <input type='text' name='price'></input>
        <br />
        <label>weight</label>
        <input type='text' name='weight'></input>
        <button type='submit'>submit</button>
      </form> */}
    </>
  );
}
