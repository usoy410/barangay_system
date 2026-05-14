import CitizenNavigation from '@/components/CitizenNavigation';

export default function ResidentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <CitizenNavigation />
      
      <div className="grow pb-[calc(5rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        {children}
      </div>
    </div>
  );
}

