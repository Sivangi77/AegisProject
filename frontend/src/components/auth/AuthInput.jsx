import { forwardRef } from 'react';

const AuthInput = forwardRef(({ icon: Icon, type = 'text', placeholder, error, ...rest }, ref) => {
  return (
    <div className="w-full">
      <div className="relative">
        {Icon && <Icon className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          className={`w-full ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 bg-secondary/50 border ${error ? 'border-red-500 focus:ring-red-500/50' : 'border-border focus:ring-primary/50'} rounded-xl focus:outline-none focus:ring-2 transition-all`}
          {...rest}
        />
      </div>
      {error && <span className="text-red-500 text-xs mt-1 block">{error}</span>}
    </div>
  );
});

AuthInput.displayName = 'AuthInput';

export default AuthInput;
