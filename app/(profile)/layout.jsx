'use client';

import Navbar from '@/components/nabvar/Navbar';
import UserSidebar from '@/components/UserSidebar';
import Footer from '@/components/nabvar/Footer';

export default function ProfileLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar />

      {/* Reduced max-width and top padding to make it feel more compact */}
      <div className="flex-1 w-full max-w-7xl pb-8 mx-auto pt-20 px-4 sm:px-6 lg:px-8 transition-all">
        <div className="flex flex-col lg:flex-row gap-5">
          
          {/* Sidebar Area - Reduced width from w-80 to w-64 to match "small more" sidebar */}
          <div className="lg:w-64 shrink-0">
            <UserSidebar />
          </div>

          {/* Main View Area - Liquid Glass Container */}
          <main className="flex-1 min-w-0">
            <div className=" min-h-[500px] overflow-hidden">
              {/* Added a bit of internal padding consistency */}
              <div className="h-full">
                {children}
              </div>
            </div>
          </main>

        </div>
      </div>

      <Footer />
    </div>
  );
}