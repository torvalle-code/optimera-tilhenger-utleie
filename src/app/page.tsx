import { redirect } from 'next/navigation';

export default function RootPage() {
  // Default to terminal view. Admin users navigate to /admin manually.
  redirect('/terminal');
}
