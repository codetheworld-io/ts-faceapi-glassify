import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import path from 'path';
import Jimp from 'jimp';

const { Canvas, Image, ImageData } = canvas;
faceapi.env.monkeyPatch({ Canvas: Canvas as any, Image: Image as any, ImageData });

class GlassifyLib {
  async glassify(imageBuffer: Buffer): Promise<Buffer> {
    await this.loadModels();

    const image = await canvas.loadImage(imageBuffer) as unknown as HTMLImageElement;

    const faces = await faceapi.detectAllFaces(
      image,
      new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }),
    ).withFaceLandmarks();

    const source = await Jimp.read(imageBuffer);
    const glasses = await Jimp.read(path.join(__dirname, '../', 'public/images/glasses.png'));

    for (const face of faces) {
      const { landmarks } = face;
      const leftEye = landmarks.getLeftEye()[0];
      const rightEye = landmarks.getRightEye()[4];
      const nose = landmarks.getNose()[0];

      const newWidth = Math.sqrt(
        Math.pow(leftEye.x - rightEye.x, 2) +
        Math.pow(leftEye.y - rightEye.y, 2)
      );

      const editedGlasses = glasses.clone().resize(newWidth + newWidth / 3, Jimp.AUTO);

      source.composite(
        editedGlasses,
        nose.x - editedGlasses.getWidth() / 2,
        nose.y - editedGlasses.getHeight() / 2,
      );
    }

    return source.getBufferAsync('image/jpeg');
  }

  private async loadModels() {
    if (faceapi.nets.ssdMobilenetv1.isLoaded && faceapi.nets.faceLandmark68Net.isLoaded) {
      return;
    }
    const modelsPath = path.join(__dirname, '../', 'public/weights');
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelsPath);
    await faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath);
  }
}

export default new GlassifyLib();
