import { FaGoogle } from 'react-icons/fa';

const GoogleSignInBtn = ({ onClick, loading }) => {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      type="button"
      className="w-full py-3 px-4 bg-secondary hover:bg-secondary/80 border border-border text-foreground rounded-xl font-medium transition-all flex items-center justify-center gap-3 disabled:opacity-70"
    >
      <FaGoogle className="w-5 h-5 text-blue-500" />
      Continue with Google
    </button>
  );
};

export default GoogleSignInBtn;
