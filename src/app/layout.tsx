import '@/styles/globals.css';

import { GeistSans } from 'geist/font/sans';
import { type Metadata } from 'next';
import { ThemeProvider } from 'next-themes';
import { QueryProvider } from '@/components/reactquery/query-provider';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { TRPCReactProvider } from '@/trpc/react';
import { BreadcrumbProvider } from '@/contexts/breadcrumb';
import { NextAuthProvider } from '@/server/auth/sessionprovider';

export const metadata: Metadata = {
  title: 'Challenge CodificaDev',
  description:
    'Challenge de crud de clients criado para usar como teste técnico para a empresa CodificaDev',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable}`}
      suppressHydrationWarning
    >
      <body>
        <NextAuthProvider>
          <TRPCReactProvider>
            <QueryProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="dark"
                enableSystem
                disableTransitionOnChange
              >
                <BreadcrumbProvider>
                  <TooltipProvider>
                    <Toaster />
                    {children}
                  </TooltipProvider>
                </BreadcrumbProvider>
              </ThemeProvider>
            </QueryProvider>
          </TRPCReactProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
