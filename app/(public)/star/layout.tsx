import { PropsWithChildren } from 'react';

export default function StarLayout({ children }: PropsWithChildren) {
  return <div className="fixed inset-0 h-dvh w-dvw z-50 bg-black">{children}</div>;
}
