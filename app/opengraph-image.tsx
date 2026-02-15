import { ImageResponse } from 'next/og'

// 生成 Open Graph 分享图片
export const runtime = 'edge'

export const alt = '刘贺同学 - AI超级个体实践者'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

export default async function OGImage() {
  const imageData = await fetch('https://avatars.githubusercontent.com/u/19663285?v=4').then(
    (res) => res.arrayBuffer()
  )

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #09090B 0%, #18181B 100%)',
        }}
      >
        {/* Avatar */}
        <div
          style={{
            display: 'flex',
            marginBottom: 40,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '4px solid #3B82F6',
          }}
        >
          <img
            // @ts-ignore
            src={imageData}
            alt="Avatar"
            width={180}
            height={180}
          />
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 60,
            fontWeight: 'bold',
            color: '#FAFAFA',
            marginBottom: 20,
          }}
        >
          刘贺同学
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 32,
            color: '#A1A1AA',
          }}
        >
          10年+ 全栈开发工程师 | 专注 AI 工程化实践与落地场景
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: 'absolute',
            bottom: 40,
            fontSize: 24,
            color: '#52525B',
          }}
        >
          一个人 + AI = AI超级个体
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
