import { Formik } from 'formik';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import logo from '../images/medias.svg';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [error, setError] = useState();

  const initialValues = {
    email: '',
    password: '',
  };

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='bg-base-300 flex flex-col p-10 items-center gap-10'>
        <div>
          <h1 className='text-blue-500 text-6xl font-poppins font-extrabold text-center'>
            Social Pulse
          </h1>
          <p className='text-center mx-16 mt-2'>
            AI-powered social media management platform
          </p>
        </div>
        <div className='flex gap-10'>
          <div className='h-full flex flex-col justify-center gap-10'>
            <img src={logo} alt='logo' />
            <p className='text-center text-2xl font-semibold'>
              Designed for small business
            </p>
          </div>
          <div className='px-11 pt-8 pb-8 mx-auto rounded-2xl w-100 bg-base-100'>
            <h2 className='text-xl mb-5 font-bold'>Sign In</h2>
            <Formik
              initialValues={initialValues}
              onSubmit={async (values) => {
                try {
                  await login(values.email, values.password);
                  navigate('/dashboard');
                } catch (error) {
                  console.log(error.code);
                  if (error.code === 'auth/user-not-found') {
                    setError('User not found.');
                  } else if (error.code === 'auth/wrong-password') {
                    setError('Wrong password given.');
                  }
                }
              }}
            >
              {(formik) => {
                const { values, handleChange, handleSubmit, handleBlur } =
                  formik;
                return (
                  <form className='space-y-5' onSubmit={handleSubmit}>
                    {error && (
                      <span className='text-red-500 text-xs italic'>
                        {error}
                      </span>
                    )}
                    <div className='space-y-2'>
                      <label className='text-sm font-medium tracking-wide'>
                        Email
                      </label>
                      <input
                        className='input input-bordered w-full'
                        id='email'
                        value={values.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder='john@gmail.com'
                        style={{ outline: '0' }}
                      />
                    </div>
                    <div className='space-y-2'>
                      <label className='mb-5 text-sm font-medium tracking-wide'>
                        Password
                      </label>
                      <input
                        className='input input-bordered w-full'
                        id='password'
                        type='password'
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder='Enter your password'
                        style={{ outline: '0' }}
                      />
                    </div>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center'>
                        <input
                          id='remember_me'
                          name='remember_me'
                          type='checkbox'
                          className='checkbox checkbox-sm'
                        />
                        <label
                          htmlFor='remember_me'
                          className='ml-2 block text-sm'
                        >
                          Remember me
                        </label>
                      </div>
                    </div>
                    <div>
                      <button
                        type='submit'
                        className='btn btn-info w-full rounded-lg'
                      >
                        Sign in
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
            <p className='mt-6 text-center text-sm'>
              No account?{' '}
              <Link to='/register'>
                <a href='#' className='font-medium btn btn-link text-blue-500'>
                  Register here.
                </a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
