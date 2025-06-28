import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Try Before You Buy (demo)',
  description: 'A demo service for trying before buying',
  generator: 'Akmal',
  icons: {
    icon: 'https://api-private.atlassian.com/users/5d5be3345a68ef0ca6255324/avatar?initials=public',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
