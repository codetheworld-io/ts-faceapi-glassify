import express from 'express';
import fileUpload, { UploadedFile } from 'express-fileupload';
import glassifyLib from './glassifyLib';

const app = express();
app.use(fileUpload());

app.post('/glassify', async (req, res) => {
  try {
    const uploadedImage = req.files?.image as UploadedFile;

    res.contentType('image/jpeg');
    res.send(await glassifyLib.glassify(uploadedImage.data));
  } catch(error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on: ${PORT}`);
});
