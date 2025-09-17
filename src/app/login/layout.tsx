export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <div className="h-screen bg-darker-purple">
        <div className="h-full">
          { children }
        </div>
      </div>

    </>
  );
}