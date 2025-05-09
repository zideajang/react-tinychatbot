import { MdMessage } from "react-icons/md";
import { HiArrowSmLeft } from "react-icons/hi";

import { useNavigate } from 'react-router-dom';
import config from "../config";


const AgentCardComp = ({agent,loading})=>{

    const navigate = useNavigate();

    const handleBackButtonClick = () => {
        navigate('/');
    };
    const handleGoAgentPageClick = ()=>{
        navigate('/agent');

    }
    const handleNavigateToMessages = ()=>{
        navigate("/messages")
    }
    return (
        <div style={{
        position:'fixed',
            left:0,
            right:0,
            top:0,
            zIndex:1000
        }}>

        <div className="media p-3 has-background-link-05 has-text-link-05-invert">
            <div className="media-left">
                <figure className="image is-48x48 is-1by1"
                    onClick={handleGoAgentPageClick}>
                <img className="is-rounded" src={`${config.baseUrl}${agent.iconUrl}`} alt={agent.name}/>
                </figure>
            </div>
            <div className="media-content">
                <p className="title is-6">{agent.name}</p>
                <p className="subtitle is-7">{agent.description}</p>
                {loading && 
                    <p>
                        <progress class="progress is-small is-primary" max="100">15%</progress>
                    </p>
                }
            </div>
            <div className="media-right">
                <div className="buttons">
                <button className="button has-background-link-15 has-text-link-15-invert is-small mt-2 is-rounded"
                    onClick={handleBackButtonClick}
                    >
                    <span className="icon">
                        <HiArrowSmLeft/>
                    </span>
                </button>
                <button className="button has-background-link-15 has-text-link-15-invert is-small mt-2 is-rounded"
                    onClick={handleNavigateToMessages}
                    >
                    <span className="icon">
                        <MdMessage/>
                    </span>
                </button>
                </div>
            </div>
        </div>
        </div>
    )
}

export default AgentCardComp;