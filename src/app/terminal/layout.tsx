import type { Metadata } from 'next';
import { TerminalShell } from './terminal-shell';

export const metadata: Metadata = {
  title: 'Tilhengerutleie — Terminal',
};

export default function TerminalLayout({ children }: { children: React.ReactNode }) {
  return <TerminalShell>{children}</TerminalShell>;
}
