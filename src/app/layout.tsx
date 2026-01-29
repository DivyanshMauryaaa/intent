import { ClerkProvider } from '@/components/clerk-provider';
import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Geist_Mono, Nunito_Sans } from 'next/font/google';
import './globals.css';

const NunitoSans = Nunito_Sans({
  variable: '--font-sans'
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Intent AI',
  description: 'Accelerate your business with Intent AI',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang='en'
        className='h-full'
        suppressHydrationWarning
      >
        <body className={`${NunitoSans.variable} ${geistMono.variable} flex min-h-full flex-col font-sans antialiased`}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
