import { gql, useQuery } from '@apollo/client';
import { Redirect } from 'react-router-dom';

const IS_LOGGED_IN = gql`
  {
      me {
          id
      }
  }
`;

interface Props {
    children?: React.ReactNode
}

const IsAuthenticated = ({ children }: Props) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);

  if (loading) return <div>Loading...</div>;

  if (error) return <div>{error.message}</div>;

  if (!data.me) {
      return <Redirect to={{pathname: '/landing'}} />
  }

  return <>{children}</>;
};

export default IsAuthenticated;
