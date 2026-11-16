import React from 'react';

interface PageWrapperProps {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

const PageWrapper: React.FC<PageWrapperProps> = ({
  title,
  subtitle,
  children,
  actions,
  className = '',
}) => {
  return (
    <main className={`flex-1 min-h-screen bg-halloween-dark p-6 lg:p-8 ${className}`}>
      {(title || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
          {title && (
            <div>
              <h1 className="font-cinzel text-2xl lg:text-3xl font-bold text-halloween-ghost text-glow">
                {title}
              </h1>
              {subtitle && (
                <p className="text-halloween-ghost-muted text-sm mt-1">{subtitle}</p>
              )}
            </div>
          )}
          {actions && <div className="flex items-center gap-3 shrink-0">{actions}</div>}
        </div>
      )}
      <div className="animate-fade-in">{children}</div>
    </main>
  );
};

export default PageWrapper;
