import { ImageResponse } from 'next/og'

// 生成 Apple Touch Icon - 使用 GitHub 头像
export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}

export const contentType = 'image/png'

export default async function AppleIcon() {
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
