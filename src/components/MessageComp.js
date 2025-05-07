import Markdown from 'react-markdown'
import config from '../config'
const MessageComp = ({message,user,agent})=>{

    const userIconUrl = `${config.baseUrl}${user.iconUrl}`
    const agentIconUrl = `${config.baseUrl}${agent.iconUrl}`
    
    return (

        <div class="columns">
            <div class="box">
                <p>
                    <strong>{`${message.role==="user"?user.name:agent.name}`}</strong> <small className="tag">角色:{message.role}</small> <small className="tag is-link">时间:{message.time}</small>
                    <br />
                    {message.role==="user"?(
                        <p className="is-size-7">
                        {message.content}
                        </p>
                    ):(
                        <p className="is-size-7">
                        <Markdown>{message.content}</Markdown>
                        </p>
                    )}
                </p>
            </div>

           

            <div className="section pt-0">
                <p className={`image is-32x32 is-1by1 ${message.role==="user"?"is-pulled-right":""}`}>
                    <img 
                    className="is-rounded"
                    src={`${message.role==="assistant"?agentIconUrl:userIconUrl}`} alt="assistant" />
                </p>
            </div>
        </div>
    )
}

export default MessageComp