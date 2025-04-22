import { AlertCircle, CheckCircle, AlertTriangle, Shield } from "lucide-react";

export function SecurityTips() {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden" id="security-tips">
      <div className="px-4 sm:px-6 py-5 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Password Security Tips</h2>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-md bg-blue-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Length Matters</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>Use at least 12 characters for strong passwords. Longer is better.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-md bg-green-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-green-800">Use Mixed Characters</h3>
                <div className="mt-2 text-sm text-green-700">
                  <p>Combine uppercase, lowercase, numbers, and special characters.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-md bg-yellow-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">Avoid Obvious Choices</h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Don't use personal info, common words, or sequential characters.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <Shield className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Store Securely</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Never store passwords in plain text. Always use secure hashing.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-sm text-gray-500">
          <p><strong>About Bcrypt:</strong> A strong password hashing function that incorporates a salt to protect against rainbow table attacks and has an adjustable cost factor to remain resistant to brute-force attacks as computing power increases.</p>
        </div>
      </div>
    </div>
  );
}
