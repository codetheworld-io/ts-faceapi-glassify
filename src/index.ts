import * as fs from 'fs';
import * as path from 'path';
import GlassifyLib from './glassifyLib';

(async () => {
  const imageBuffer = fs.readFileSync(path.join(__dirname, '../', 'public/images/demo.jpg'));

  const output = await GlassifyLib.glassify(imageBuffer);

  await fs.writeFileSync(
    path.join(__dirname, '../', `public/images/output_${Date.now()}.jpg`),
    output,
  );
})();
