import { FaCog } from 'react-icons/fa';

const Navbar = ({ setShowSettings, showSettings }) => {
    return (
        <nav className='navbar'>
            <h1 className='navbar__title'>ChatGPT Plus</h1>
            <FaCog className='icon auto-right mg-right-lg pointer' onClick={() => setShowSettings(!showSettings)} />
        </nav>
    );
};

export default Navbar;
