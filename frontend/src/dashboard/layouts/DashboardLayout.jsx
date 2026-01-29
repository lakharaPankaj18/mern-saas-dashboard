import React, { useState, useEffect} from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet, useLocation } from "react-router-dom";
import AddMemberDrawer from "../components/AddMemberDrawer";

const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 1024);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // 1. Handle Navigation: Close sidebar on mobile when route changes
  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    // Only trigger a state update if the sidebar is currently open
    if (isMobile && isSidebarOpen) {
      setIsSidebarOpen(false);
    }
    // We intentionally only depend on location here
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // 2. Handle Window Resize: Sync sidebar state if user rotates phone or resizes browser
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#f8fafc]">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <Sidebar isSidebarOpen={isSidebarOpen} />

      <div className="flex h-full flex-1 flex-col overflow-hidden min-w-0">
        <header className="sticky top-0 z-30 border-b border-slate-100 bg-white/80 backdrop-blur-md">
          <Topbar onToggleSidebar={toggleSidebar} isSidebarOpen={isSidebarOpen} />
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-7xl">
            {/* The key is that Outlet changes based on location. 
               By the time this renders, the useEffect above will have 
               scheduled the sidebar to close on mobile.
            */}
            <Outlet />
          </div>
        </main>
      </div>

      <AddMemberDrawer />
    </div>
  );
};

export default DashboardLayout;