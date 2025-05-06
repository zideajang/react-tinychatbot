
const MessageComp = ({message,user,agent})=>{
    return (

        <div class="columns">
          
            <div class="box">
                <p>
                    <strong>message</strong> <small>{message.role}</small> <small>31m</small>
                    <br />
                    {message.content}
                </p>
            </div>

            <div className="section pt-0">

                <p className={`image is-32x32 ${message.role==="user"?"is-pulled-right":""}`}>
                    <img 
                    className="is-rounded"
                    src={`${message.role==="assistant"?agent.iconUrl:user.iconUrl}`} alt="assistant" />
                </p>
            </div>
        </div>
    )
}

export default MessageComp