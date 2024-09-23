import '../globals.css';

export default function VanampLayout({ children }: { children: React.ReactNode }) {
  return <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>{children}</div>;
}
