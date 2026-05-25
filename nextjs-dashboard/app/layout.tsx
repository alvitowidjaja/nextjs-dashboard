import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import { ThemeProvider } from '@/app/ui/theme-provider';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import ThemeBox from '@/app/dashboard/ThemeBox';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body className={`${inter.className} antialiased bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-white transition-colors duration-500`}>
        <ThemeProvider>
          <ThemeBox />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
