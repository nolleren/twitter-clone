import { useMutation, useQuery } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { loader } from 'graphql.macro';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';

import { updateProfileVariables, updateProfile, me } from '../../graphql';
import { customModalStyles } from '../../styles/modal.scoped';
import '../../styles/signup.scoped.css';

const UPDATE_PROFILE_MUTATION = loader(
  'src/graphql/mutations/profile/update-profile.gql'
);
const ME_QUERY = loader('src/graphql/queries/profile/me.gql');

const UpdateProfile = () => {
  const [updateProfile] = useMutation<
    updateProfile,
    updateProfileVariables
  >(UPDATE_PROFILE_MUTATION, {
    refetchQueries: [{ query: ME_QUERY }],
  });

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { loading, error, data } = useQuery<me>(ME_QUERY)

  if (loading) return <div>Loading...</div>

  if (error) return <div>{error.message}</div>

  if (!data || !data.me || !data.me.profile) return <div>Profile loading...</div>
  
  const initialValues: updateProfileVariables = {
    id: data.me.id,
    bio: data.me.profile.bio,
    location: data.me.profile.location,
    website: data.me.profile.website,
    avatar: data.me.profile.avatar,
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
        <title>Fake Twitter Update Profile</title>
      </Helmet>
      <button onClick={openModal}>Update Profile</button>
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
            await updateProfile({
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

            <button type='submit' className='login-button'>
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default UpdateProfile;
