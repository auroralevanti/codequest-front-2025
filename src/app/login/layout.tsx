export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <div className="flex min-h-screen bg-darker-purple items-center justify-center">
        <div className="h-full">
          { children }
        </div>
      </div>

    </>
  );
}