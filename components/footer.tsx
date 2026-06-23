import { Link2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-neutral-400 border-t border-neutral-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <Link2 className="w-5 h-5 text-indigo-500 rotate-45" />
            <span className="font-semibold text-neutral-300">GAUR Links</span>
          </div>
          
          <div className="text-sm text-neutral-500">
            &copy; {new Date().getFullYear()} GAUR Dynamic Links. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
