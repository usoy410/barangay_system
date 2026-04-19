import CitizenNavigation from '@/components/CitizenNavigation';

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <CitizenNavigation />
      
      {/* 
        Padding Bottom (pb-24) for Mobile to account for fixed bottom nav
      */}
      <div className="flex-grow pb-24 md:pb-0">
        {children}
      </div>
    </div>
  );
}

