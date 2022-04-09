import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <>
      <Link to='/'>Single</Link>
      <Link to='/multi'>Multiple</Link>
    </>
  );
}
