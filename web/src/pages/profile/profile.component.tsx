import { useQuery } from '@apollo/client';
import { loader } from 'graphql.macro';
import CreateProfile from '../../components/profile/create-profile.component';
import UpdateProfile from '../../components/profile/update-profile.component';
import { me } from '../../graphql';
import { useHistory } from 'react-router';
import { Link } from 'react-router-dom';
import LeftNav from '../../components/navs/left-nav.component';
import '../../styles/primary.styles.css';
import '../../styles/profile.styles.css';

const ME_QUERY = loader('src/graphql/queries/profile/me.gql');

const Profile = () => {
  const { error, loading, data } = useQuery<me>(ME_QUERY);
  const history = useHistory();

  if (loading) return <div>Loading...</div>

  if (error) return <div>{error.message}</div>;

  if(!data || !data.me || !data.me.profile ) return <div>Profile loading...</div>
  return (
    <>
      <div className="primary">
        <div className="left">
          <LeftNav />
        </div>
        <div className="profile">
          <div className="profile-info">
            <div className="profile-head">
              <span className="back-arrow" onClick={() => history.goBack()}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
              </span>
              <span className="nickname">
                <h3>{data.me.name}</h3>
              </span>
            </div>
            <div className="avatar">
              {data.me.profile.avatar ? (
                <img
                  src={data.me.profile.avatar}
                  style={{ width: "150px", borderRadius: "50%" }}
                  alt="avatar"
                />
              ) : (
                <i className="fa fa-user fa-5x" aria-hidden="true"></i>
              )}
            </div>
            
            <div className="make-profile">
              {data.me.profile ? <UpdateProfile /> : <CreateProfile />}
            </div>

            <h3 className="name">{data.me.name}</h3>

            {data.me.profile ? (
              <p>
                <i className="fas fa-link"> </i>{" "}
                <Link
                  to={{ pathname: `http://${data.me.profile.website}` }}
                  target="_blank"
                >
                  {data.me.profile.website}
                </Link>
              </p>
            ) : null}
            <div className="followers">
            {/* <Following/> */}
              <p>384 followers</p>
            </div>
          </div>
          {/* <LikedTweets tweets={data.me} /> */}
        </div>
        <div className="right">
          {/* <PopularTweets/> */}
        </div>
      </div>
    </>
  )
};

export default Profile;
