"use client";

import Button from "@/components/atoms/button";
import Logo from "../logo";
import NotificationBell from "../notification-bell";
import ProfileCompletionBar from "../profile-completion-bar";
import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { logout } from "@/lib/auth/logout";
import {
  getAccessToken,
  getUserName as getStoredUserName,
  getUserType as getStoredUserType,
} from "@/lib/secure-storage";

export default function Navbar() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const accessToken = getAccessToken();
      const name = getStoredUserName();
      const type = getStoredUserType();

      if (accessToken) {
        setIsAuthenticated(true);
        setUserName(name || "User");
        setUserType(type || "");
      } else {
        setIsAuthenticated(false);
        setUserName("");
        setUserType("");
      }
    };

    checkAuth();

    // Listen for storage changes (logout from other tabs)
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  /** Vendors (organizations): RFQ before Feed; others default to Feed-first */
  const mainNavItems = useMemo(() => {
    const items = [
      { href: "/dashboard", label: "Feed" },
      { href: "/rfq", label: "RFQ" },
      { href: "/messages", label: "Messages" },
      { href: "/opportunities", label: "Opportunities" },
      { href: "/analytics", label: "Analytics" },
      { href: "/events", label: "Events" },
    ];
    if (userType === "ORGANIZATION") {
      const feed = items[0];
      const rfq = items[1];
      return [rfq, feed, ...items.slice(2)];
    }
    return items;
  }, [userType]);

  const handleLogout = async () => {
    await logout();
    setIsAuthenticated(false);
    setUserName("");
    setUserType("");
    setIsDropdownOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white" aria-label="Main navigation">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-[50px]">
        <div className="flex justify-between items-center h-[63px]">
          {/* Logo/Title */}
          <Logo />

          {/* Desktop Menu items */}
          <div className="hidden lg:flex items-center gap-8">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className="text-black text-[16px] font-medium leading-[18px] hover:text-primary-dark transition-colors"
                >
                  Home
                </Link>
                <Link
                  href="/contact"
                  className="text-black text-[16px] font-medium leading-[18px] hover:text-primary-dark transition-colors"
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-black text-[16px] font-medium leading-[18px] hover:text-primary-dark transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </>
            )}
          </div>

          {/* Desktop Auth buttons or User Dropdown */}
          <div className="hidden lg:flex items-center gap-3 h-[35px]">
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                {userType === "ORGANIZATION" && <ProfileCompletionBar />}
                <NotificationBell />
                <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-off-white transition-colors"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-primary-dark font-medium">
                    {userName}
                  </span>
                  <svg
                    className={`w-4 h-4 text-primary-dark transition-transform ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-light-gray rounded-lg shadow-lg py-2 z-50">
                    <Link
                      href="/dashboard"
                      className="block px-4 py-2 text-text-dark hover:bg-off-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-text-dark hover:bg-off-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                    {userType === 'CONSUMER' && (
                      <Link
                        href="/events"
                        className="block px-4 py-2 text-text-dark hover:bg-off-white transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        My Events
                      </Link>
                    )}
                    <Link
                      href="/messages"
                      className="block px-4 py-2 text-text-dark hover:bg-off-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Messages
                    </Link>
                    <Link
                      href="/analytics"
                      className="block px-4 py-2 text-text-dark hover:bg-off-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Analytics
                    </Link>
                    <Link
                      href="/settings"
                      className="block px-4 py-2 text-text-dark hover:bg-off-white transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Settings
                    </Link>
                    <hr className="my-2 border-light-gray" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-500 hover:bg-off-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
              </div>
            ) : (
              <>
                <Button href="/signup-select">Sign Up</Button>
                <Button href="/login">Login</Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden flex flex-col gap-1.5 w-6 h-6 justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-nav-menu"
          >
            <span
              className={`w-full h-0.5 bg-black transition-transform duration-300 ${
                isMobileMenuOpen ? "rotate-45 translate-y-2" : ""
              }`}
            />
            <span
              className={`w-full h-0.5 bg-black transition-opacity duration-300 ${
                isMobileMenuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`w-full h-0.5 bg-black transition-transform duration-300 ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div id="mobile-nav-menu" className="lg:hidden bg-white border-t border-gray-200" role="menu">
          <div className="max-w-[1440px] mx-auto px-4 py-4 flex flex-col gap-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/"
                  className="py-2 text-black text-[16px] font-medium leading-[18px] hover:text-primary-dark transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/contact"
                  className="py-2 text-black text-[16px] font-medium leading-[18px] hover:text-primary-dark transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </>
            ) : (
              <>
                {mainNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="py-2 text-black text-[16px] font-medium leading-[18px] hover:text-primary-dark transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/notifications"
                  className="py-2 text-black text-[16px] font-medium leading-[18px] hover:text-primary-dark transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Notifications
                </Link>
              </>
            )}

            {isAuthenticated ? (
              <div className="flex flex-col gap-3 mt-2 pt-3 border-t border-light-gray">
                <div className="flex items-center gap-3 py-2">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {userName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-primary-dark font-medium">
                    {userName}
                  </span>
                </div>
                <Link
                  href="/profile"
                  className="py-2 px-4 text-text-dark hover:bg-off-white rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  My Profile
                </Link>
                <Link
                  href="/analytics"
                  className="py-2 px-4 text-text-dark hover:bg-off-white rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Analytics
                </Link>
                <Link
                  href="/settings"
                  className="py-2 px-4 text-text-dark hover:bg-off-white rounded-lg transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="py-2 px-4 text-left text-red-500 hover:bg-off-white rounded-lg transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3 mt-2">
                <Button href="/signup-select">Sign Up</Button>
                <Button href="/login">Login</Button>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
