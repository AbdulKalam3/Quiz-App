import logo from'./images/Logo.png';
import './css/Header.css';

function Header(){
    return(
        <div className="header">
            <div className="row title">
                <div className="col logo">
                    <img src={logo} alt='Logo'/>
                </div>
                <div className='col titlename'>
                    Quiz App
                </div>
            </div>
        </div>
    );
}

export default Header;