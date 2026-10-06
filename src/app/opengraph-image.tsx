import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export const alt = 'Asri Mela Aldian Syah — Website Profil & Portfolio RPL';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  let autographBase64 = '';
  try {
    const autographPath = path.join(process.cwd(), 'public/images/autograph.png');
    if (fs.existsSync(autographPath)) {
      const buf = fs.readFileSync(autographPath);
      autographBase64 = `data:image/png;base64,${buf.toString('base64')}`;
    }
  } catch (err) {
    console.warn('Autograph preview note:', err);
  }
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 70px',
          backgroundColor: '#090d16',
          backgroundImage:
            'radial-gradient(circle at 85% 15%, rgba(99, 102, 241, 0.28) 0%, transparent 45%), radial-gradient(circle at 15% 85%, rgba(59, 130, 246, 0.22) 0%, transparent 45%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
          border: '12px solid #1e293b',
          position: 'relative',
        }}
      >
        {/* Top Header Badge & Meta */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '10px 22px',
              borderRadius: '9999px',
              backgroundColor: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
            }}
          >
            <div
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
              }}
            />
            <span
              style={{
                fontSize: '16px',
                fontWeight: 600,
                letterSpacing: '2px',
                color: '#93c5fd',
                textTransform: 'uppercase',
              }}
            >
              Portfolio & Profile • SMK RPL
            </span>
          </div>

          <div
            style={{
              fontSize: '18px',
              color: '#94a3b8',
              letterSpacing: '1px',
              fontWeight: 500,
            }}
          >
            Kelas Industri Next.js
          </div>
        </div>

        {/* Center Main Identity */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            marginTop: '20px',
          }}
        >
          <h1
            style={{
              fontSize: '66px',
              fontWeight: 800,
              lineHeight: 1.1,
              margin: 0,
              letterSpacing: '-1.5px',
              background: 'linear-gradient(to right, #ffffff, #e2e8f0, #93c5fd)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Asri Mela Aldian Syah
          </h1>

          <p
            style={{
              fontSize: '28px',
              color: '#cbd5e1',
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            Web Developer &amp; Siswi Rekayasa Perangkat Lunak
          </p>

          {/* Tech Badges */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: '10px',
            }}
          >
            {['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Supabase'].map(
              (tech) => (
                <div
                  key={tech}
                  style={{
                    padding: '8px 18px',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(30, 58, 138, 0.4)',
                    border: '1px solid rgba(96, 165, 250, 0.35)',
                    fontSize: '16px',
                    color: '#bfdbfe',
                    fontWeight: 600,
                  }}
                >
                  {tech}
                </div>
              )
            )}
          </div>
        </div>

        {/* Bottom Bar: Autograph & Live Link */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            paddingTop: '25px',
            borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <span
              style={{
                fontSize: '14px',
                color: '#64748b',
                textTransform: 'uppercase',
                letterSpacing: '1.5px',
                fontWeight: 600,
              }}
            >
              Live URL &amp; Case Studies
            </span>
            <span
              style={{
                fontSize: '22px',
                color: '#38bdf8',
                fontWeight: 600,
              }}
            >
              asri-mela.my.id
            </span>
          </div>

          {/* Autograph / Digital Signature Box */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              padding: '10px 18px',
              borderRadius: '16px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '2px solid rgba(251, 191, 36, 0.6)',
              boxShadow: '0 12px 28px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                fontSize: '11px',
                color: '#78350f',
                letterSpacing: '1.5px',
                textTransform: 'uppercase',
                fontWeight: 700,
                marginBottom: '4px',
              }}
            >
              ✍️ Official Autograph
            </div>
            {autographBase64 ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={autographBase64}
                alt="Autograph Asri Mela"
                style={{
                  width: '260px',
                  height: '95px',
                  objectFit: 'contain',
                }}
              />
            ) : (
              <div
                style={{
                  fontSize: '32px',
                  fontStyle: 'italic',
                  fontWeight: 700,
                  color: '#1e293b',
                }}
              >
                ~ Asri Mela ~
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
