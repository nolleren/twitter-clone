import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

import TwitterLogo from '../../assets/twitter-logo.png';
import './login.scoped.css';
import CustomErrorMessage from '../../components/custom-error-message/custom-error-message.component';

const LOGIN_MUTATION = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

interface LoginValues {
  email: string;
  password: string;
}

const LogIn = () => {
  const history = useHistory();
  const [login] = useMutation(LOGIN_MUTATION);

  const initialValues: LoginValues = {
    email: '',
    password: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email required'),
    password: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Password required'),
  });

  return (
    <div className='container'>
      <Helmet>
        <title>Fake Twitter Log In</title>
      </Helmet>
      <img
        src={TwitterLogo}
        alt='Twitter logo'
        style={{ width: '50px' }}
        className='logo'
      />
      <h3>Log in to fake Twitter</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await login({
            variables: values,
          });
          localStorage.setItem('token', response.data.login.token);
          setSubmitting(false);
          history.push('/users');
        }}
      >
        <Form>
          <Field name='email' type='email' placeholder='Email' />
          <ErrorMessage name='email' component={CustomErrorMessage} />
          <Field name='password' type='password' placeholder='Password' />
          <ErrorMessage name='password' component={CustomErrorMessage} />

          <button type='submit' className='login-button'>
            <span>Log In</span>
          </button>
        </Form>
      </Formik>
      <div className='register'>
        <h4>Don't have an account?</h4>
        <Link to='/signup'>Sign up</Link>
      </div>
    </div>
  );
};

export default LogIn;
