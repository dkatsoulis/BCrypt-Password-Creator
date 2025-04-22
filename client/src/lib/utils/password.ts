import { apiRequest } from "../queryClient";
import { type PasswordGenerationOptions, type GeneratedPassword } from "@shared/schema";

export async function generatePasswords(options: PasswordGenerationOptions): Promise<GeneratedPassword[]> {
  const response = await apiRequest("POST", "/api/generate-passwords", options);
  const data = await response.json();
  return data.generatedPasswords;
}

export function downloadAsCSV(passwords: GeneratedPassword[]): void {
  let csvContent = "Password,BCrypt Hash\n";
  
  passwords.forEach(({ password, hash }) => {
    csvContent += `"${password}","${hash}"\n`;
  });
  
  downloadFile(csvContent, 'passwords.csv', 'text/csv');
}

export function downloadAsText(passwords: GeneratedPassword[]): void {
  let textContent = "Generated Passwords and Hashes\n";
  textContent += "================================\n\n";
  
  passwords.forEach(({ password, hash }, index) => {
    textContent += `Password #${index + 1}\n`;
    textContent += `Password: ${password}\n`;
    textContent += `BCrypt Hash: ${hash}\n\n`;
  });
  
  downloadFile(textContent, 'passwords.txt', 'text/plain');
}

export function copyAllPasswords(passwords: GeneratedPassword[]): Promise<void> {
  let textContent = '';
  
  passwords.forEach(({ password, hash }, index) => {
    textContent += `Password #${index + 1}: ${password}\n`;
    textContent += `Hash: ${hash}\n\n`;
  });
  
  return navigator.clipboard.writeText(textContent);
}

function downloadFile(content: string, filename: string, contentType: string): void {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
}
