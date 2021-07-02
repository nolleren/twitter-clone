import { useMutation } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { loader } from 'graphql.macro';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';

import { createProfile, createProfileVariables } from '../../graphql';
import { customModalStyles } from '../../styles/modal.styles';

const CREATE_PROFILE_MUTATION = loader(
  'src/graphql/mutations/profile/create-profile.gql'
);
const ME_QUERY = loader('src/graphql/queries/profile/me.gql');

const CreateProfile = () => {
  const [createProfile] = useMutation<createProfile, createProfileVariables>(
    CREATE_PROFILE_MUTATION,
    {
      refetchQueries: [{ query: ME_QUERY }],
    }
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const initialValues: createProfileVariables = {
    bio: '',
    location: '',
    website: '',
    avatar: '',
  };

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  return (
    <div className='container'>
      <Helmet>
        <title>Fake Twitter Create Profile</title>
      </Helmet>
      <button onClick={openModal} className='edit-button'>Create Profile</button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Modal'
        style={customModalStyles}
        ariaHideApp={false}
      >
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await createProfile({
              variables: values,
            });
            setSubmitting(false);
            setModalIsOpen(false);
          }}
        >
          <Form>
            <Field name='bio' type='text' as='textarea' placeholder='Bio' />
            <Field name='location' type='text' placeholder='Location' />
            <Field name='website' type='text' placeholder='Website' />

            <button type='submit' className='custom-button'>
              <span>Create Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default CreateProfile;
