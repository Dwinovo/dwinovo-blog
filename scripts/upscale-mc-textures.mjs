// One-off helper: nearest-neighbor upscale pixel-art Minecraft textures so the
// browser doesn't have to do the scaling. Run with `node scripts/upscale-mc-textures.mjs`.
//
// HD mod artwork (Usagi/Hachiware/Chiikawa weapons) is intentionally skipped —
// those source assets are already 169-244 px smooth illustrations.

import sharp from 'sharp'
import { rename, readFile } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DIR = join(__dirname, '..', 'public', 'static', 'images', 'minecraft')
const TARGET = 128

const PIXEL_ART = [
  'flint',
  'stick',
  'yellow_wool',
  'blue_wool',
  'pink_wool',
  'music_box',
]

for (const name of PIXEL_ART) {
  const path = join(DIR, `${name}.png`)
  const tmp = path + '.tmp'

  const buf = await readFile(path)
  const meta = await sharp(buf).metadata()
  await sharp(buf)
    .resize(TARGET, TARGET, { kernel: 'nearest' })
    .png({ compressionLevel: 9 })
    .toFile(tmp)
  await rename(tmp, path)

  console.log(`${name}: ${meta.width}×${meta.height} → ${TARGET}×${TARGET}`)
}
