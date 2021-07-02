import { gql, useMutation } from '@apollo/client';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Link, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import CustomErrorMessage from '../../components/custom-error-message/custom-error-message.component';

import TwitterLogo from '../../assets/twitter-logo.png';
import '../../styles/signup-login.styles.css';

const SIGNUP_MUTATION = gql`
  mutation signup($name: String, $email: String!, $password: String!) {
    signup(name: $name, email: $email, password: $password) {
      token
    }
  }
`;

interface SignUpValues {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

const Signup = () => {
  const history = useHistory();
  const [signup] = useMutation(SIGNUP_MUTATION);

  const initialValues: SignUpValues = {
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email required'),
    password: Yup.string()
      .max(20, 'Must be 20 characters or less')
      .required('Password required'),
    confirmPassword: Yup.string().oneOf(
      [Yup.ref('password')],
      'Password must match'
    ),
    name: Yup.string()
      .max(15, 'Must be 15 characters or less')
      .required('Name required'),
  });

  return (
    <div className='container'>
      <Helmet>
        <title>Fake Twitter Sign Up</title>
      </Helmet>
      <img
        src={TwitterLogo}
        alt='Twitter logo'
        style={{ width: '50px' }}
        className='logo'
      />
      <h3>Sign up to fake Twitter</h3>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={async (values, { setSubmitting }) => {
          setSubmitting(true);
          const response = await signup({
            variables: values,
          });
          localStorage.setItem('token', response.data.signup.token);
          setSubmitting(false);
          history.push('/users');
        }}
      >
        <Form>
          <Field name='email' type='email' placeholder='Email' />
          <ErrorMessage name='email' component={CustomErrorMessage} />
          <Field name='name' type='text' placeholder='Name' />
          <ErrorMessage name='name' component={CustomErrorMessage} />
          <Field name='password' type='password' placeholder='Password' />
          <ErrorMessage name='password' component={CustomErrorMessage} />
          <Field
            name='confirmPassword'
            type='password'
            placeholder='Confirm Password'
          />
          <ErrorMessage name='confirmPassword' component={CustomErrorMessage} />
          <button type='submit' className='signup-button'>
            <span>Sign Up</span>
          </button>
        </Form>
      </Formik>
      <div className='register'>
        <h4>Already have an account?</h4>
        <Link to='/login'>Log In</Link>
      </div>
    </div>
  );
};

export default Signup;
