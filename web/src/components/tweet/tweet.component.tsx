import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { customModalStyles } from '../../styles/modal.styles';
import Modal from 'react-modal';
import { useMutation } from '@apollo/client';
import { createTweet, createTweetVariables } from '../../graphql';
import { loader } from 'graphql.macro';
import * as Yup from 'yup';

import '../../styles/tweet.styles.css';
import CustomErrorMessage from '../custom-error-message/custom-error-message.component';

const CREATE_TWEET_MUTATION = loader(
  'src/graphql/mutations/tweet/create-tweet.gql'
);
const ME_QUERY = loader('src/graphql/queries/profile/me.gql');

const Tweet = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const [createTweet] = useMutation<createTweet, createTweetVariables>(
    CREATE_TWEET_MUTATION,
    {
      refetchQueries: [{ query: ME_QUERY }],
    }
  );

  const initialValues: createTweetVariables = {
    content: '',
  };

  const validationSchema = Yup.object({
    content: Yup.string()
      .required()
      .min(1, 'Must be more then one character')
      .max(256, 'Must be less then 257 characters'),
  });

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div>
      <Helmet>
        <title>Fake Twitter - Tweet</title>
      </Helmet>
      <button
        style={{ marginRight: '10px', marginTop: '30px' }}
        onClick={openModal}
      >
        <span style={{ padding: '15px 70px 15px 70px' }}>Tweet</span>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Modal'
        style={customModalStyles}
        ariaHideApp={false}
      >
          <span className="exit" onClick={closeModal}>
              <i className="fa fa-times" aria-hidden='true'></i>
          </span>
          <div className="header"></div>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await createTweet({
              variables: values,
            });
            setSubmitting(false);
            setModalIsOpen(false);
          }}
        >
          <Form>
            <Field
              name='content'
              type='text'
              as='textarea'
              placeholder="what's happening..."
            />
            <ErrorMessage name='content' component={CustomErrorMessage} />

            <div className="footer"></div>
            <button type='submit' className='tweet-button'>
              <span>Tweet</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default Tweet;
