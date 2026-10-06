import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const alt = 'Official Autograph Asri Mela — Crafted with love & quiet thoughts';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  let base64 = '';
  try {
    const autographPath = path.join(process.cwd(), 'public/images/autograph.jpg');
    if (fs.existsSync(autographPath)) {
      const buf = fs.readFileSync(autographPath);
      base64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
    }
  } catch (err) {
    console.warn('Autograph OG load notice:', err);
  }

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#faf8f5',
          position: 'relative',
        }}
      >
        {base64 ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={base64}
            alt="Official Autograph Asri Mela"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        ) : (
          <div
            style={{
              fontSize: '48px',
              fontStyle: 'italic',
              fontWeight: 700,
              color: '#3f2e22',
            }}
          >
            Asri Mela — Crafted with love &amp; quiet thoughts
          </div>
        )}
      </div>
    ),
    {
      ...size,
    }
  );
}
