"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, ExpandMore } from "@mui/icons-material";

const DashboardLayout = ({ children, menuItems, title }) => {
  const pathname = usePathname();

  // ---------------- STATE ----------------
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openDropdown, setOpenDropdown] = useState({});

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  const handleDropdown = (menu) =>
    setOpenDropdown((prev) => ({ ...prev, [menu]: !prev[menu] }));

  const isExpanded = sidebarOpen;
  const sidebarWidth = isExpanded ? 256 : 80;

  const isActiveRoute = (item) => {
    if (item.children) {
      return item.children.some((c) => pathname.startsWith(c.link));
    }
    return pathname === item.link;
  };

  // ---------------- MENU ----------------
  const renderedMenu = useMemo(
    () =>
      menuItems.map((item) => {
        const key = item.name.toLowerCase();
        const isDropdown = !!item.children;
        const activeDropdown = openDropdown[key];
        const isActive = isActiveRoute(item);

        return (
          <li key={item.name}>
            {isDropdown ? (
              <>
                <button
                  onClick={() => handleDropdown(key)}
                  className={`flex w-full items-center justify-between px-4 py-2 rounded-xl transition-colors ${
                    isActive
                      ? "bg-indigo-100 text-indigo-800"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    {isExpanded && <span>{item.name}</span>}
                  </div>

                  {isExpanded && (
                    <ExpandMore
                      className={`transition-transform duration-300 ${
                        activeDropdown ? "rotate-180" : ""
                      }`}
                    />
                  )}
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    activeDropdown && isExpanded
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <ul className="pl-6 mt-1 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.name}>
                        <Link
                          href={child.link}
                          className={`block px-3 py-2 rounded-lg text-sm transition ${
                            pathname === child.link
                              ? "bg-indigo-100 text-indigo-800"
                              : "hover:bg-gray-100"
                          }`}
                        >
                          {child.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            ) : (
              <Link
                href={item.link}
                className={`flex items-center gap-3 px-4 py-2 rounded-xl transition ${
                  isActive
                    ? "bg-indigo-100 text-indigo-800"
                    : "hover:bg-gray-100"
                }`}
              >
                {item.icon}
                {isExpanded && <span>{item.name}</span>}
              </Link>
            )}
          </li>
        );
      }),
    [menuItems, pathname, openDropdown, isExpanded]
  );

  return (
    <div className="flex min-h-screen w-full bg-slate-50 dark:bg-gray-900 transition-colors">
      {/* SIDEBAR */}
      <aside
        className="fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transition-all duration-300"
        style={{ width: sidebarWidth }}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          {isExpanded && (
            <span className="font-bold text-lg whitespace-nowrap">
              {title || "Dashboard"}
            </span>
          )}
          <button onClick={toggleSidebar}>
            {sidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
        </div>

        {/* Sidebar Menu */}
        <nav className="flex-1 mt-2 overflow-y-auto">
          <ul className="space-y-2 px-2">{renderedMenu}</ul>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main
        className="flex-1 transition-all duration-300 p-4"
        style={{ marginLeft: sidebarWidth }}
      >
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;