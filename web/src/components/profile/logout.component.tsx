import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import Modal from 'react-modal';
import { loader } from 'graphql.macro';
import { useQuery } from '@apollo/client';
import { me } from '../../graphql';
import { logoutModalStyles } from '../../styles/logout-modal.styles';
import '../../styles/logout.styles.css';

const ME_QUERY = loader('src/graphql/queries/profile/me.gql');

const LogOut = () => {
  const { loading, error, data } = useQuery<me>(ME_QUERY);

  const history = useHistory();

  const [modalIsOpen, setModalIsOpen] = useState(false);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleLogOut = async () => {
    localStorage.removeItem('token');

    history.push('/login');
  };

  if (loading || !data || !data.me || !data.me.profile)
    return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;
  return (
    <div>
      <Helmet>
        <title>Fake Twitter Log Out</title>
      </Helmet>
      <div className='logout'>
        <span onClick={openModal} style={{ flex: 1, flexDirection: 'row' }}>
          <h4>
            {data.me.profile.avatar ? (
              <img
                src={data.me.profile.avatar}
                style={{ width: '150px', borderRadius: '50%' }}
                alt='avatar'
              />
            ) : (
              <i className='fa fa-user fa-5x' aria-hidden='true' />
            )}
            <span style={{ marginLeft: '10px', marginTop: '-10px' }}>
              {data.me.name}
            </span>
            <span style={{ marginLeft: '30px' }}>
              <i className='fas fa-ellipsis-h' />
            </span>
          </h4>
        </span>
        <div style={{ position: 'absolute', bottom: 0 }} />
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={closeModal}
          contentLabel='Modal'
          style={logoutModalStyles}
          ariaHideApp={false}
        >
          <span onClick={handleLogOut} style={{ cursor: 'pointer' }}>
            <p style={{ borderBottom: '1px solid black' }}>
              Log out @{data.me.name}
            </p>
          </span>
        </Modal>
      </div>
    </div>
  );
};

export default LogOut;
