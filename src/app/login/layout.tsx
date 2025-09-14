export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>

      <div className="h-full bg-darker-purple">
        <div className="h-full">
          { children }
        </div>
      </div>

    </>
  );
}