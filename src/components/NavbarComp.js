import { IoIosArrowBack } from "react-icons/io";
import {  useNavigate } from 'react-router-dom';

const NavbarComp = ({title})=>{
    const navigate = useNavigate();
    return (
        <nav class="navbar is-primary" role="navigation" 
            style={{
                position:'fixed',
                left:0,
                right:0,
                top:0,
                zIndex:1000

            }}
        
            aria-label="main navigation">
            <div class="navbar-brand"> 
                <div className="navbar-item">
                    <span className="icon" onClick={() => navigate(-1)}>
                        <IoIosArrowBack/>
                    </span>
                </div>
                <div className="navbar-item">
                    {title}    
                </div>    
            </div>
        </nav>
    )
}

export default NavbarComp;