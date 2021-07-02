import './custom-error-message.scoped.css';

interface Props {
  children?: React.ReactNode;
}

const CustomErrorMessage = ({children}: Props) => (
  <div className='error-header'>
    <p className='error-text'>{children}</p>
  </div>
);

export default CustomErrorMessage;
