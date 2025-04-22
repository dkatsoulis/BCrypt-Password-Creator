import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Check, Copy, FileText } from "lucide-react";

interface PasswordResultItemProps {
  passwordNumber: number;
  password: string;
  hash: string;
}

export function PasswordResultItem({ passwordNumber, password, hash }: PasswordResultItemProps) {
  const { toast } = useToast();
  const [passwordCopied, setPasswordCopied] = useState(false);
  const [hashCopied, setHashCopied] = useState(false);

  const copyToClipboard = async (text: string, isPassword: boolean) => {
    try {
      await navigator.clipboard.writeText(text);
      
      if (isPassword) {
        setPasswordCopied(true);
        setTimeout(() => setPasswordCopied(false), 1500);
      } else {
        setHashCopied(true);
        setTimeout(() => setHashCopied(false), 1500);
      }

      toast({
        title: "Copied to clipboard",
        description: isPassword ? "Password copied" : "Hash copied",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Could not copy to clipboard",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="password-item bg-gray-50 rounded-lg p-4 mb-4 border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <h3 className="font-medium text-gray-700">
          Password #{passwordNumber}
        </h3>
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-500 hover:text-primary p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            title="Copy Password"
            onClick={() => copyToClipboard(password, true)}
          >
            {passwordCopied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <Copy className="h-5 w-5" />
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-gray-500 hover:text-primary p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            title="Copy Hash"
            onClick={() => copyToClipboard(hash, false)}
          >
            {hashCopied ? (
              <Check className="h-5 w-5 text-green-500" />
            ) : (
              <FileText className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            Password
          </div>
          <div className="password-value bg-white border border-gray-300 rounded px-3 py-2 font-mono text-sm break-all">
            {password}
          </div>
        </div>
        <div>
          <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
            BCrypt Hash
          </div>
          <div className="password-hash bg-white border border-gray-300 rounded px-3 py-2 font-mono text-sm break-all overflow-x-auto text-xs">
            {hash}
          </div>
        </div>
      </div>
    </div>
  );
}
