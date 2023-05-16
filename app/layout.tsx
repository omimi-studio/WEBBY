import './globals.css'

export const metadata = {
  title: 'Webby',
  description: 'Webby',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
