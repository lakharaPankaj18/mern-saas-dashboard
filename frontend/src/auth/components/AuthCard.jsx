const AuthCard = ({ title, description, children, footer }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h1>
        {description && (
          <p className="mt-2 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {/* Main content */}
      <div className="space-y-4">{children}</div>

      {/* Footer */}
      {footer && (
        <div className="mt-8 border-t border-slate-100 pt-6 text-center text-sm text-slate-600">
          {footer}
        </div>
      )}
    </div>
  );
};

export default AuthCard