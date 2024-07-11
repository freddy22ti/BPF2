import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState({});
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          navigate('/admin');
        }
      } catch (error) {
        localStorage.removeItem('token');
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = {};

    if (!username) {
      errors.username = 'Please input your username!';
    }

    if (!password) {
      errors.password = 'Please input your password!';
    }

    if (Object.keys(errors).length > 0) {
      setError(errors);
    } else {
      setError({});
      try {
        const response = await axios.post('http://localhost:5000/login', {
          username,
          password,
        });
        const token = response.data.access_token;
        localStorage.setItem('token', token); // Store token in localStorage
        setMessage('Login successful!');
        navigate('/admin'); // Redirect to the dashboard or another protected route
      } catch (error) {
        console.error('Login failed:', error);
        setMessage('Login failed. Please check your credentials and try again.');
      }
    }
  };

  return (
    <div className='min-h-screen w-full flex items-center justify-center bg-gray-100'>
      <div className='bg-white rounded-lg shadow-md px-8 py-6'>
        <h1 className='text-4xl text-center py-2 mb-4'>Login</h1>
        <form onSubmit={handleSubmit} className='max-w-md mx-auto' style={{width: 360}}>
          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='username'>
              Username
            </label>
            <input
              id='username'
              type='text'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error.username && 'border-red-500'}`}
            />
            {error.username && (
              <p className='text-red-500 text-xs italic'>{error.username}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
              Password
            </label>
            <input
              id='password'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${error.password && 'border-red-500'}`}
            />
            {error.password && (
              <p className='text-red-500 text-xs italic'>{error.password}</p>
            )}
          </div>

          <div className='mb-4'>
            <label className='inline-flex items-center'>
              <input
                type='checkbox'
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className='form-checkbox'
              />
              <span className='ml-2 text-gray-700'>Remember me</span>
            </label>
          </div>

          <div className='flex items-center justify-between'>
            <button
              type='submit'
              className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
            >
              Submit
            </button>
          </div>
          {message && (
            <p className='text-center mt-4 text-red-500'>{message}</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Login;
