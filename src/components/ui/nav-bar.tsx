import { UserButton } from "@stackframe/stack";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { stackServerApp } from "@/stack/server";

export async function NavBar() {
  const user = await stackServerApp.getUser();
  const clientUser = user?.toClientJson();

  return (
    <header className="w-full border-b border-gray-200 bg-white">
      <nav className="mx-auto flex h-14 w-full max-w-7xl items-center px-6 gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
          </svg>
          <span className="font-bold text-base text-gray-900 tracking-tight">
            SkillShelf
          </span>
        </Link>

        <div className="flex-1 max-w-xl">
          <div className="relative flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="absolute left-3 text-gray-400 pointer-events-none"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <Input
              type="text"
              placeholder="Search resources..."
              className="pl-9 pr-4 py-1.5 text-sm text-gray-700 placeholder-gray-400 border-gray-300 focus-visible:border-gray-400 focus-visible:ring-0 bg-white"
              style={{ fontFamily: "inherit" }}
            />
          </div>
        </div>

        <div className="flex items-center gap-5 ml-auto shrink-0">
          <Link
            href="/dashboard"
            className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            Browse
          </Link>
          <Link
            href="/saved"
            className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
          >
            Saved
          </Link>

          <div className="h-5 w-px bg-gray-300" aria-hidden="true" />
          {clientUser ? (
            <div className="scale-90 origin-right">
              <UserButton showUserInfo={false} />
            </div>
          ) : (
            <>
              <Link
                href="/handler/signup?redirect=%2Fdashboard"
                className="text-sm text-gray-700 hover:text-gray-900 transition-colors"
              >
                Sign Up
              </Link>
              <Link
                href="/handler/signin?redirect=%2Fdashboard"
                className="text-sm text-gray-800 border border-gray-800 rounded-md px-4 py-1.5 hover:bg-gray-50 transition-colors"
              >
                Sign In
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default NavBar;
