import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from "@/context/AuthContext";
import { loginUser } from "@/lib/authApi";
import ThemeToggle from '@/components/ThemeToggle';

const Login = () => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {login} = useAuth();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try{
      const { token } = await loginUser({identifier, password});
      await login(token);
      
      toast.success("Logged in successfully");
      navigate("/");

    }catch(error){
      if(!error.response){
        setError("Server unavailable. Please try again later.");
      }else{
        setError(error.response?.data?.message || "Login failed");
      }

    }finally{
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-sm bg-card border border-border rounded-xl p-6'>
        <div className='flex justify-between mb-6'>
          <h1 className='text-2xl font-bold'>
            Login
          </h1>
          <ThemeToggle />
        </div>
        
        <form onSubmit={handleSubmit} className='space-y-4'>
          <input 
            type="text"
            placeholder='Username or Email'
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background' 
          />

          <input 
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background' 
          />

          <button
            type='submit'
            className='w-full px-4 py-2 rounded-md bg-primary text-primary-foreground'
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {error && (
          <p className='text-sm text-destructive mt-3'>
            {error}
          </p>
        )}

        <p className='text-sm text-muted-foreground mt-4'>
          No Account?{" "}
          <Link to="/register" className="text-primary" >
            Register
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;