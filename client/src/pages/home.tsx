import { useEffect } from "react";
import { PasswordGenerator } from "@/components/PasswordGenerator";
import { SecurityTips } from "@/components/SecurityTips";

export default function Home() {
  useEffect(() => {
    document.title = "Password Generator & Hasher";
  }, []);

  return (
    <div className="bg-slate-100 text-slate-800 min-h-screen font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-800 flex items-center">
              <span className="text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
              Password Generator & Hasher
            </h1>
            <a href="#" className="text-primary hover:text-indigo-700 text-sm font-medium hidden sm:block">Documentation</a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PasswordGenerator />
        <SecurityTips />
      </main>

      <footer className="bg-white mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            Password Generator & Hasher Tool &copy; {new Date().getFullYear()}. This tool is for educational purposes only.
          </p>
          <p className="text-center text-xs text-gray-400 mt-2">
            Passwords are processed securely. BCrypt hashing happens on the server.
          </p>
        </div>
      </footer>
    </div>
  );
}
