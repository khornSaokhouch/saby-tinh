import './globals.css';
import ToastProvider from '@/components/providers/ToastProvider';
import LanguageThemeProvider from '@/components/providers/LanguageThemeProvider';

export const metadata = {
  title: 'SABY-TINH',
  description: 'High-performance hardware procurement and professional tech marketplace.',
};

export default function RootLayout({ children }) {
  return (
    // ✅ suppressHydrationWarning fix the "attributes mismatch" error caused by extensions
    <html lang="en" className="scroll-smooth" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body 
        className="antialiased bg-white text-slate-900 min-h-screen flex flex-col font-sans selection:bg-blue-600 selection:text-white"
        suppressHydrationWarning
      >
        <LanguageThemeProvider>
          {/* Global Notifications Node */}
          <ToastProvider />

          {/* Core Application Content */}
          <main className="flex flex-col flex-grow relative z-0">
            {children}
          </main>
        </LanguageThemeProvider>
      </body>
    </html>
  );
}