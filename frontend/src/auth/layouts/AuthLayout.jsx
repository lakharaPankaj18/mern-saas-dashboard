const AuthLayout = ({ children }) => {
  return (
    <section className="min-h-screen bg-indigo-400 px-4">
     
      <div className="flex min-h-screen w-full items-center justify-center">
       
        <div className="w-full max-w-md transition-all">
          {children}
        </div>
      </div>
    </section>
  );
};
export default AuthLayout