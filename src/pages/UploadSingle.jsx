import { useEffect, useState } from 'react';

export default function UploadSingle() {
  const [image, setImage] = useState();
  const [preview, setPreview] = useState();

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
  };

  return (
    <>
      <h1>Upload Single File</h1>
      <br />
      <img src={preview} alt='iniimage' style={{ maxWidth: '300px' }} />
      <br />
      <input type='file' onChange={handleChange} />
    </>
  );
}
