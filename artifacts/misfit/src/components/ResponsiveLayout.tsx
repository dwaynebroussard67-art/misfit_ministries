import { useState } from 'react';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

export function ResponsiveLayout({
  children,
  sidebar,
  header,
  footer,
}: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-dark">
      {/* Header */}
      {header && (
        <header className="bg-surface border-b border-dark-border sticky top-0 z-30">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {header}
            {sidebar && (
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden text-gold font-bold"
              >
                ☰
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        {sidebar && (
          <>
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 z-20 md:hidden"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <aside
              className={`
                fixed md:static inset-y-0 left-0 w-64 bg-surface border-r border-dark-border
                transform transition-transform duration-300 z-20
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
              `}
            >
              <div className="p-4 md:p-6 overflow-y-auto h-full">
                {sidebar}
              </div>
            </aside>
          </>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 md:py-12">
            {children}
          </div>
        </main>
      </div>

      {/* Footer */}
      {footer && (
        <footer className="bg-surface border-t border-dark-border mt-12">
          <div className="container mx-auto px-4 py-8 md:py-12">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}

/* Mobile-optimized grid component */
export function ResponsiveGrid({
  children,
  cols = { sm: 1, md: 2, lg: 3 },
  gap = 4,
}: {
  children: React.ReactNode;
  cols?: { sm?: number; md?: number; lg?: number };
  gap?: number;
}) {
  const gridClass = `
    grid gap-${gap}
    ${cols.sm ? `grid-cols-${cols.sm}` : 'grid-cols-1'}
    ${cols.md ? `md:grid-cols-${cols.md}` : ''}
    ${cols.lg ? `lg:grid-cols-${cols.lg}` : ''}
  `;

  return <div className={gridClass}>{children}</div>;
}

/* Mobile-optimized card component */
export function ResponsiveCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`
        bg-surface rounded-lg p-4 md:p-6
        border border-dark-border
        hover:border-gold transition
        ${className}
      `}
    >
      {children}
    </div>
  );
}

/* Mobile-optimized button group */
export function ResponsiveButtonGroup({
  children,
  vertical = false,
}: {
  children: React.ReactNode;
  vertical?: boolean;
}) {
  return (
    <div
      className={`
        flex flex-col md:flex-row gap-3
        ${vertical ? 'flex-col' : ''}
      `}
    >
      {children}
    </div>
  );
}

