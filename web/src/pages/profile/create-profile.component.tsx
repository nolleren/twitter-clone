import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import CreateProfile from '../../components/profile/create-profile.component';
import UpdateProfile from '../../components/profile/update-profile.component';
import { me } from '../../graphql';

import '../../styles/signup.scoped.css';

const ME_QUERY = loader('src/graphql/queries/profile/me.gql');

const Profile = () => {
  const { error, loading, data } = useQuery<me>(ME_QUERY);

  if (loading) return <div>Loading...</div>

  if (error) return <div>{error.message}</div>;

  if(!data || !data.me || !data.me.profile ) return <div>Profile loading...</div>

  return (
    <div className='container'>
      <h1>Profile</h1>
      {data.me.profile.id ? <UpdateProfile /> : <CreateProfile />}
      
      <div>
        <p>{data.me.profile.bio}</p>
        <p>{data.me.profile.location}</p>
        <p>{data.me.profile.website}</p>
      </div>
    </div>
  );
};

export default Profile;
