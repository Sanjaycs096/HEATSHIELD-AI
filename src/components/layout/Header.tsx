import React from "react";
import { getAuthSession, logoutAction } from "@/lib/auth";
import Link from "next/link";

export async function Header() {
  const auth = await getAuthSession();

  return (
    <header className="h-16 bg-white border-b border-gray-100 shadow-sm flex items-center justify-between px-4 sm:px-8 z-10 relative">
      <div className="flex items-center md:hidden gap-3">
        <Link href="/" className="flex items-center gap-1.5 font-bold text-emerald-700">
          <span className="material-icons text-emerald-600 text-lg">shield</span>
          HeatShield
        </Link>
      </div>
      
      <div className="hidden md:flex items-center">
        {/* We can dynamically inject breadcrumbs here if we want, but for now we keep it simple. */}
      </div>

      <div className="flex items-center gap-6">
        {auth ? (
          <>
            <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <div className="h-7 w-7 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold text-xs uppercase shadow-sm">
                {auth.profile.name.charAt(0)}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden sm:block pr-2">{auth.profile.name}</span>
            </div>
            <form action={logoutAction}>
              <button type="submit" className="text-sm text-gray-500 hover:text-red-600 font-medium flex items-center gap-1 transition-colors" title="Logout">
                <span className="material-icons text-sm">logout</span>
                <span className="hidden sm:inline">Logout</span>
              </button>
            </form>
          </>
        ) : (
          <Link href="/login" className="text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg transition shadow-sm">
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
}
