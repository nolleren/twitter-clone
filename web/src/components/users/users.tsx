import { gql, useQuery } from '@apollo/client';

const USERS_QUERY = gql`
  query USERS_QUERY {
    allUsers {
      id
      name
    }
  }
`;

interface UserValues {
  id: string;
  name: string;
}

const Users = () => {
  const { loading, error, data } = useQuery(USERS_QUERY);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  return (
    <div>
      <ul>
        {data.allUsers.length &&
          data.allUsers.map((user: UserValues) => <li key={user.id}>{user.name}</li>)}
      </ul>
    </div>
  );
};

export default Users;
