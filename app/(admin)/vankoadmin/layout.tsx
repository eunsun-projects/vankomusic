import '../globals.css';

export default async function VankoAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        width: '100%',
        height: 'auto',
        minHeight: '100vh',
        backgroundColor: '#3b6ea5',
        cursor: 'url(/assets/img/admincursor.png), auto',
      }}
    >
      {children}
    </div>
  );
}
