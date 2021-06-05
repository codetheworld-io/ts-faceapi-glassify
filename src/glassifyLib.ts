import '@tensorflow/tfjs-node';
import * as canvas from 'canvas';
import * as faceapi from 'face-api.js';
import path from 'path';

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

    const output = faceapi.createCanvasFromMedia(image);
    faceapi.draw.drawDetections(output, faces.map(res => res.detection));
    faceapi.draw.drawFaceLandmarks(output, faces.map(res => res.landmarks));

    return (output as any).toBuffer('image/jpeg');
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
