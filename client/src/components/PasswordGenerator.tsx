import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { PasswordResultItem } from "./PasswordResultItem";
import { generatePasswords, downloadAsCSV, downloadAsText, copyAllPasswords } from "@/lib/utils/password";
import { passwordGenerationSchema, type GeneratedPassword } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { RotateCw, Download, Copy, HelpCircle } from "lucide-react";

type FormData = z.infer<typeof passwordGenerationSchema>;

export function PasswordGenerator() {
  const [passwords, setPasswords] = useState<GeneratedPassword[]>([]);
  const { toast } = useToast();

  const { register, handleSubmit, formState, watch, control, setValue } = useForm<FormData>({
    resolver: zodResolver(passwordGenerationSchema),
    defaultValues: {
      count: 5,
      length: 12,
      costFactor: 10,
      options: {
        uppercase: true,
        lowercase: true,
        numbers: true,
        special: true,
        easyToRead: false,
      },
    },
  });

  const watchOptions = watch("options");

  // Ensure at least one option is selected
  const validateOptions = () => {
    const { uppercase, lowercase, numbers, special } = watchOptions;
    if (!uppercase && !lowercase && !numbers && !special) {
      setValue("options.lowercase", true);
      return false;
    }
    return true;
  };

  const generatePasswordsMutation = useMutation({
    mutationFn: generatePasswords,
    onSuccess: (data) => {
      setPasswords(data);
      toast({
        title: "Passwords Generated",
        description: `Successfully generated ${data.length} passwords.`,
      });
    },
    onError: (error) => {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to generate passwords. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    if (!validateOptions()) {
      toast({
        title: "Notice",
        description: "At least one character type must be selected. Lowercase has been enabled.",
      });
    }
    
    generatePasswordsMutation.mutate(data);
  };
  
  const handleCopyAll = async () => {
    try {
      await copyAllPasswords(passwords);
      toast({
        title: "Copied",
        description: "All passwords and hashes copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const handleDownloadCSV = () => {
    downloadAsCSV(passwords);
    toast({
      title: "Downloaded",
      description: "CSV file downloaded successfully.",
    });
  };

  const handleDownloadTXT = () => {
    downloadAsText(passwords);
    toast({
      title: "Downloaded",
      description: "Text file downloaded successfully.",
    });
  };

  return (
    <Card className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
      <div className="px-4 sm:px-6 py-5 bg-gray-50 border-b border-gray-200">
        <h2 className="text-lg font-medium text-gray-900">Password Generator</h2>
        <p className="mt-1 text-sm text-gray-600">Generate secure random passwords with their bcrypt hashes</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="px-4 sm:px-6 py-5 border-b border-gray-200 space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-1 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-1">
                Number of Passwords
              </Label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="count"
                  type="number"
                  min={1}
                  max={100}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  {...register("count", { valueAsNumber: true })}
                />
              </div>
              {formState.errors.count && (
                <p className="mt-1 text-xs text-red-500">{formState.errors.count.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Generate between 1-100 passwords</p>
            </div>

            <div className="col-span-1">
              <Label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-1">
                Password Length
              </Label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  id="length"
                  type="number"
                  min={8}
                  max={32}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                  {...register("length", { valueAsNumber: true })}
                />
              </div>
              {formState.errors.length && (
                <p className="mt-1 text-xs text-red-500">{formState.errors.length.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">12+ chars recommended for security</p>
            </div>

            <div className="col-span-1">
              <Label htmlFor="costFactor" className="block text-sm font-medium text-gray-700 mb-1">
                BCrypt Cost Factor
              </Label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Select 
                  defaultValue="10"
                  onValueChange={(value) => setValue("costFactor", parseInt(value))}
                >
                  <SelectTrigger id="costFactor" className="w-full">
                    <SelectValue placeholder="Select cost factor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 (Default)</SelectItem>
                    <SelectItem value="11">11</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                    <SelectItem value="13">13</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="mt-1 text-xs text-gray-500">Higher = more secure but slower</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <div className="col-span-1">
              <div className="flex items-center">
                <Checkbox
                  id="uppercase"
                  checked={watchOptions.uppercase}
                  onCheckedChange={(checked) => setValue("options.uppercase", checked === true)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded"
                />
                <Label htmlFor="uppercase" className="ml-2 block text-sm text-gray-700">
                  Uppercase (A-Z)
                </Label>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center">
                <Checkbox
                  id="lowercase"
                  checked={watchOptions.lowercase}
                  onCheckedChange={(checked) => setValue("options.lowercase", checked === true)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded"
                />
                <Label htmlFor="lowercase" className="ml-2 block text-sm text-gray-700">
                  Lowercase (a-z)
                </Label>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center">
                <Checkbox
                  id="numbers"
                  checked={watchOptions.numbers}
                  onCheckedChange={(checked) => setValue("options.numbers", checked === true)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded"
                />
                <Label htmlFor="numbers" className="ml-2 block text-sm text-gray-700">
                  Numbers (0-9)
                </Label>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center">
                <Checkbox
                  id="special"
                  checked={watchOptions.special}
                  onCheckedChange={(checked) => setValue("options.special", checked === true)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded"
                />
                <Label htmlFor="special" className="ml-2 block text-sm text-gray-700">
                  Special Chars (!@#$)
                </Label>
              </div>
            </div>
            <div className="col-span-1">
              <div className="flex items-center">
                <Checkbox
                  id="easyToRead"
                  checked={watchOptions.easyToRead}
                  onCheckedChange={(checked) => setValue("options.easyToRead", checked === true)}
                  className="h-4 w-4 text-primary focus:ring-primary rounded"
                />
                <Label htmlFor="easyToRead" className="ml-2 block text-sm text-gray-700">
                  Easy to Read
                </Label>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 p-0 ml-1">
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                      <span className="sr-only">Easy to read info</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>Removes similar-looking characters (1, l, I, 0, O) to make passwords easier to read and type correctly.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </div>
          </div>

          <div className="pt-3 flex justify-between items-center flex-wrap gap-3">
            <Button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
              disabled={generatePasswordsMutation.isPending}
            >
              {generatePasswordsMutation.isPending ? (
                <>
                  <RotateCw className="h-5 w-5 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <RotateCw className="h-5 w-5 mr-2" />
                  Generate Passwords
                </>
              )}
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDownloadCSV}
                disabled={passwords.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleDownloadTXT}
                disabled={passwords.length === 0}
              >
                <Download className="h-4 w-4 mr-1" />
                TXT
              </Button>
              <Button
                type="button"
                variant="outline"
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCopyAll}
                disabled={passwords.length === 0}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy All
              </Button>
            </div>
          </div>
        </div>
      </form>

      <CardContent className="px-4 sm:px-6 py-5">
        {passwords.length > 0 ? (
          <div className="space-y-4">
            {passwords.map((password, index) => (
              <PasswordResultItem
                key={index}
                passwordNumber={index + 1}
                password={password.password}
                hash={password.hash}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-400 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="text-md font-medium text-gray-900">No passwords generated yet</h3>
            <p className="mt-1 text-sm text-gray-500">Configure options and click "Generate Passwords"</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
