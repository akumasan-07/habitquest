import {useState} from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import { registerUser } from '@/lib/authApi';
import ThemeToggle from '@/components/ThemeToggle';

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if(password !== confirmPassword){
      setError("Passwords do not match");
      return;
    }
    setLoading(true);

    try{
      
      await registerUser({ username, email, password });

      toast.success("Registration successful. Please log in.")

      navigate("/login");

    }catch(error){
      if(!error.response){
        setError("Server unavailable. Please try again later.");
      }else{
        setError(error.response?.data?.message || "Registration failed");
      }

    }finally{
      setLoading(false);
    }
  };


  return (
    <div className='min-h-screen flex items-center justify-center px-4'>
      <div className='w-full max-w-sm bg-card border border-border rounded-xl p-6'>
        <div className='flex justify-between items-center mb-6'>

          <div className='flex items-center gap-1'>
            <Link to="/" className='p-1 rounded-md hover:bg-secondary transition translate-y-0.5 text-primary' aria-label='Back to Home'>
              <ArrowLeft className='h-5 w-5' />
            </Link>

            <h1 className='text-2xl font-bold'>
              Register
            </h1>
          </div>
          
          <ThemeToggle />
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input 
            type="text"
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background'
            required
          />

          <input 
            type="email"
            placeholder='Email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background' 
            required
          />

          <input 
            type="password"
            placeholder='Password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background' 
            required
            minLength={8}
          />

          <input 
            type="password"
            placeholder='Confirm Password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className='w-full px-3 py-2 rounded-md border border-input bg-background' 
          />

          <button
            type='submit'
            className='w-full px-4 py-2 rounded-md bg-primary text-primary-foreground'
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        {error && (
          <p className='text-sm text-destructive mt-3'>
            {error}
          </p>
        )}

        <p className='text-sm text-muted-foreground mt-4'>
          Already have an account?{" "}
          <Link to="/login" className="text-primary" >
            Login
          </Link>
        </p>

      </div>
    </div>
  )
};

export default Register;