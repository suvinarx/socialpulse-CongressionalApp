import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Formik } from 'formik';
import { useAuth } from '../auth/AuthContext';
import { useMutation } from '@apollo/client';
import { REGISTER_BUSINESS } from '../graphql/mutations';
import logo from '../images/medias.svg';

function Register() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const initialValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const validate = (values) => {
    let errors = {};
    if (!values.name) errors.name = 'Business name is required.';
    if (!values.email) errors.email = 'Email is required.';
    if (!values.password) errors.password = 'Password is required.';
    if (values.confirmPassword !== values.password)
      errors.confirmPassword = 'Passwords must match.';
    return errors;
  };

  const [registerBusiness, { data, error }] = useMutation(REGISTER_BUSINESS);

  if (data) console.log(data);
  if (error) console.error(error);

  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='bg-base-300 flex p-10 items-center gap-10'>
        <div className='h-full flex flex-col justify-center gap-10'>
          <div>
            <h1 className='text-blue-500 text-6xl font-poppins font-extrabold text-center'>
              Social Pulse
            </h1>
            <p className='text-center mx-16 mt-2'>
              AI-powered social media management platform
            </p>
          </div>
          <img src={logo} alt='logo' />
          <p className='text-center text-2xl font-semibold'>
            Designed for Small Business Owners
          </p>
        </div>
        <div className='px-11 pt-8 pb-8 mx-auto rounded-2xl w-100 bg-base-100'>
          <h2 className='text-xl mb-5 font-bold'>Register an account</h2>
          <Formik
            initialValues={initialValues}
            validate={validate}
            onSubmit={(values) => {
              // same shape as initial values
              registerBusiness({
                variables: {
                  RegisterBusinessInput: {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                  },
                },
              }).then(async () => {
                try {
                  await login(values.email, values.password);
                  navigate('/dashboard');
                } catch (error) {
                  console.log(error);
                }
              });
            }}
          >
            {(formik) => {
              const {
                values,
                handleChange,
                handleSubmit,
                errors,
                touched,
                handleBlur,
              } = formik;
              return (
                <form className='space-y-5' onSubmit={handleSubmit}>
                  <div className='space-y-2'>
                    <label className='text-sm font-medium tracking-wide'>
                      Business Name
                    </label>
                    <input
                      className='input input-bordered w-full'
                      id='name'
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='My Business'
                    />
                    {errors.name && touched.name && (
                      <span className='text-red-500 text-xs italic'>
                        {errors.name}
                      </span>
                    )}
                  </div>
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
                      placeholder='app@business.com'
                    />
                    {errors.email && touched.email && (
                      <span className='text-red-500 text-xs italic'>
                        {errors.email}
                      </span>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='mb-5 text-sm font-medium tracking-wide'>
                      Password
                    </label>
                    <input
                      className='input input-bordered w-full'
                      id='password'
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='Enter your password'
                      type='password'
                    />
                    {errors.password && touched.password && (
                      <span className='text-red-500 text-xs italic'>
                        {errors.password}
                      </span>
                    )}
                  </div>
                  <div className='space-y-2'>
                    <label className='mb-5 text-sm font-medium tracking-wide'>
                      Confirm Password
                    </label>
                    <input
                      className='input input-bordered w-full'
                      id='confirmPassword'
                      type='password'
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder='Enter your password'
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <span className='text-red-500 text-xs italic'>
                        {errors.confirmPassword}
                      </span>
                    )}
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
                      Register
                    </button>
                  </div>
                </form>
              );
            }}
          </Formik>
          <p className='mt-6 text-center text-sm'>
            Already have an account?
            <Link to='/login'>
              <a href='#' className='font-medium btn btn-link text-blue-500'>
                Login here.
              </a>
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
