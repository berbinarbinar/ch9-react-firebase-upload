import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { useEffect, useState } from 'react';
import { storage } from '../config/firebase';

export default function UploadMultiple() {
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [urls, setUrls] = useState([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!images) {
      setPreviews([
        'https://via.placeholder.com/600x400/c71818/ffffff?text=ini+image+placeholder',
        'https://via.placeholder.com/600x400/c71818/ffffff?text=ini+image+placeholder',
        'https://via.placeholder.com/600x400/c71818/ffffff?text=ini+image+placeholder',
        'https://via.placeholder.com/600x400/c71818/ffffff?text=ini+image+placeholder',
      ]);
      return;
    }
    images.map((image) => {
      const objUrl = URL.createObjectURL(image);
      setPreviews((pre) => [...pre, objUrl]);
      return () => URL.revokeObjectURL(objUrl);
    });
  }, [images]);

  const handleChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage.id = Math.random();
      // di setimages ini, nambahin file baru, tanpa ngebuang file yang udah dimasukin ke dalem state image, jadi pake spread operator (...)
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const handleUpload = () => {
    // initialize batch upload promises
    const promises = [];
    // loop dulu si imagesnya
    images.map((image) => {
      // buat manipulasi nama file
      image.nameFile = new Date() + image.name;
      // buat define ke arah storage mana file ini akan ke upload
      const storageRef = ref(storage, `multipleImages/${image.nameFile}`);

      // proses buat upload
      const uploadTask = uploadBytesResumable(storageRef, image);
      promises.push(uploadTask);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // set progress
          const progressss = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(progressss);
        },
        (error) => {
          console.log(error);
        },
        async () => {
          await getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setUrls((prev) => [...prev, downloadUrl]);
            console.log(`file available at `, downloadUrl);
          });
        }
      );
    });
    Promise.all(promises)
      .then(() => alert('berhasil diupload semua'))
      .catch((err) => console.log(err));
  };

  return (
    <>
      <h1>Upload Multiple File</h1>
      <progress value={progress} max='100' />
      <br />
      <br />
      {
        // preview files
        previews.map((image, idx) => (
          <img
            src={image}
            key={idx}
            style={{ maxHeight: '100px' }}
            alt={image.name}
          />
        ))
      }
      <input type='file' multiple onChange={handleChange} />
      <br />
      <button onClick={handleUpload}>Upload</button>
      <br />
      <h1>Yang keupload:</h1>
      <br />
      {urls.map((url, idx) => (
        <img key={idx} style={{ maxHeight: '150px' }} src={url} alt={url} />
      ))}
    </>
  );
}
