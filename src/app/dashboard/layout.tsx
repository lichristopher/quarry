'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  Menu,
  Home,
  Users,
  Settings,
  HelpCircle,
  Wallet,
  FileText,
} from 'lucide-react';
import { useState } from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-blue-600 text-white ${
          isSidebarOpen ? 'w-64' : 'w-16'
        } transition-all duration-300 flex flex-col`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
          {isSidebarOpen && (
            <h2 className="text-lg font-semibold">Renans Quarry</h2>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1 rounded-lg hover:bg-gray-700"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          <ul className="space-y-2">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <Home className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Home</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/data"
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <Home className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Data</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/cash"
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <Wallet className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Cash</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/po-records"
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <FileText className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">PO Records</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/users"
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <Users className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Users</span>}
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/settings"
                className="flex items-center px-4 py-2 hover:bg-gray-700 transition-colors"
              >
                <Settings className="h-5 w-5" />
                {isSidebarOpen && <span className="ml-3">Settings</span>}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-700 p-4">
          <Link
            href="/dashboard/help"
            className="flex items-center hover:bg-gray-700 px-4 py-2 rounded-lg transition-colors"
          >
            <HelpCircle className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Help</span>}
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-gray-100">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
