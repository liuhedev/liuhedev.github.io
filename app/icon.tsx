import { ImageResponse } from 'next/og'

// 生成 Favicon - 使用 GitHub 头像
export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}

export const contentType = 'image/png'

export default async function Icon() {
  // 直接从 GitHub 获取头像
  const imageData = await fetch('https://avatars.githubusercontent.com/u/19663285?v=4').then(
    (res) => res.arrayBuffer()
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: '50%',
          overflow: 'hidden',
        }}
      >
        <img
          // @ts-ignore
          src={imageData}
          alt="Avatar"
          style={{
            width: '100%',
            height: '100%',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
