"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaHome, FaUsers, FaTags, FaStore } from "react-icons/fa";
import { FaCircleQuestion } from "react-icons/fa6";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Dashboard", href: "/", icon: <FaHome /> },
    { name: "Creators", href: "/creators", icon: <FaUsers /> },
    { name: "Offers", href: "/offers", icon: <FaTags /> },
    // { name: "Events", href: "/events", icon: <FaCalendarAlt /> },
    { name: "Stores", href: "/stores", icon: <FaStore /> },
    { name: "Qurey", href: "/query", icon: <FaCircleQuestion /> },
  ];

  return (
    <div className="w-64 h-full bg-card p-6 border-r border-primary">
      <div className="flex items-center gap-3 mb-8">
        <img src="/logob.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-xl font-bold text-primary">Apna City</h1>
      </div>

      <nav className="space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
              pathname === item.href
                ? "bg-primary text-base font-semibold"
                : "text-secondary hover:bg-card hover:text-primary"
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-primary">
        <div className="text-xs text-tertiary">
          <p>APNA CITY ADMIN v1.0</p>
        </div>
      </div>
    </div>
  );
}
