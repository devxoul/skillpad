import { ImageResponse } from 'next/og'

export const alt = 'SkillPad — Desktop GUI for AI Agent Skills'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const interRegular = fetch(
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfMZg.ttf',
).then((res) => res.arrayBuffer())

const interBold = fetch(
  'https://fonts.gstatic.com/s/inter/v20/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuFuYMZg.ttf',
).then((res) => res.arrayBuffer())

export default async function Image() {
  const [regular, bold] = await Promise.all([interRegular, interBold])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        fontFamily: 'Inter',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: 'flex',
          background: 'radial-gradient(ellipse 70% 50% at 50% 45%, rgba(56, 189, 248, 0.06), transparent)',
        }}
      />

      <svg width="88" height="88" viewBox="113 150 540 540" fill="none">
        <path
          d="M400 181.547C412.376 174.402 427.624 174.402 440 181.547L616.506 283.453C628.882 290.598 636.506 303.803 636.506 318.094V521.906C636.506 536.197 628.882 549.402 616.506 556.547L440 658.453C427.624 665.598 412.376 665.598 400 658.453L223.494 556.547C211.118 549.402 203.494 536.197 203.494 521.906V318.094C203.494 303.803 211.118 290.598 223.494 283.453L400 181.547Z"
          fill="white"
        />
        <circle cx="147.5" cy="191.5" r="17.5" fill="white" />
        <circle cx="192.5" cy="191.5" r="17.5" fill="white" />
        <circle cx="237.5" cy="191.5" r="17.5" fill="white" />
      </svg>

      <div style={{ marginTop: 28, fontSize: 64, fontWeight: 700, color: 'white', letterSpacing: '-0.04em' }}>
        SkillPad
      </div>

      <div style={{ marginTop: 12, fontSize: 26, fontWeight: 400, color: '#a1a1aa', letterSpacing: '-0.01em' }}>
        Desktop GUI for AI Agent Skills
      </div>

      <div style={{ position: 'absolute', bottom: 40, fontSize: 18, fontWeight: 400, color: '#52525b' }}>
        skillpad.dev
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Inter', data: regular, weight: 400, style: 'normal' as const },
        { name: 'Inter', data: bold, weight: 700, style: 'normal' as const },
      ],
    },
  )
}
