import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Tilhengerutleie — Terminal',
};

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="terminal-mode min-h-screen bg-gray-50 flex flex-col max-w-[540px] mx-auto">
      {children}
    </div>
  );
}
