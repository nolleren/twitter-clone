import { useMutation, useQuery } from '@apollo/client';
import { Formik, Form, Field } from 'formik';
import { loader } from 'graphql.macro';
import { MutableRefObject, useRef, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Modal from 'react-modal';

import { updateProfileVariables, updateProfile, me } from '../../graphql';
import { customModalStyles } from '../../styles/modal.styles';

import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
  cloud_name: process.env.REACT_APP_CLOUDINARY_Name,
  api_key: process.env.REACT_APP_CLOUDINARY_API_KEY,
  api_secret: process.env.REACT_APP_CLOUDINARY_API_SECRET,
  upload_preset: 'twitter-clone',
  folder: 'twitter-clone'
});

const UPDATE_PROFILE_MUTATION = loader(
  'src/graphql/mutations/profile/update-profile.gql'
);
const ME_QUERY = loader('src/graphql/queries/profile/me.gql');

const UpdateProfile = () => {
  const inputFile = useRef() as MutableRefObject<HTMLInputElement>;
  const [image, setImage] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  const [updateProfile] = useMutation<updateProfile, updateProfileVariables>(
    UPDATE_PROFILE_MUTATION,
    {
      refetchQueries: [{ query: ME_QUERY }],
    }
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const { loading, error, data } = useQuery<me>(ME_QUERY);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (!data || !data.me || !data.me.profile)
    return <div>Profile loading...</div>;

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

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && process.env.REACT_APP_CLOUDINARY_ENDPOINT) {
      setImageLoading(true);
      const reader = new FileReader();
      const result: cloudinary.UploadApiResponse = await new Promise(
        (resolve, reject) => {
          reader.readAsDataURL(files[0]);

          reader.onload = async () => {
            const base64data = reader.result;

            if (typeof base64data === 'string') {
              const response = await cloudinary.v2.uploader.upload(
                base64data,
                (event) => {
                  return event;
                }
              );
              resolve(response);
            }
          };
        }
      );
      setImage(result.secure_url);
    }

    setImageLoading(false);
  };

  return (
    <div className='container'>
      <Helmet>
        <title>Fake Twitter Update Profile</title>
      </Helmet>
      <button onClick={openModal} className='edit-button'>
        Edit Profile
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel='Modal'
        style={customModalStyles}
        ariaHideApp={false}
      >
        <input
          type='file'
          name='file'
          placeholder='Upload image'
          onChange={uploadImage}
          ref={inputFile}
          style={{ display: 'none' }}
        />
        {imageLoading ? (
          <h3>Loading image...</h3>
        ) : (
          <>
            {' '}
            {image ? (
              <span onClick={() => inputFile.current.click()}>
                <img
                  src={image}
                  style={{ width: '150px', borderRadius: '50%' }}
                  alt='avatar'
                />
              </span>
            ) : (
              <span onClick={() => inputFile.current.click()}>
                <i className='fa fa-user fa-5x' aria-hidden='true' />
              </span>
            )}
          </>
        )}
        <Formik
          initialValues={initialValues}
          onSubmit={async (values, { setSubmitting }) => {
            setSubmitting(true);
            await updateProfile({
              variables: {...values, avatar: image}
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
              <span>Update Profile</span>
            </button>
          </Form>
        </Formik>
      </Modal>
    </div>
  );
};

export default UpdateProfile;
