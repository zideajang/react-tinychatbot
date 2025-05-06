

const UserCardComp = ({agent})=>{
    return (
        <div className="media p-3 has-background-link-05 has-text-link-05-invert">
            <div className="media-left">
                <figure className="image is-48x48">
                <img className="is-rounded" src={`${agent.iconUrl}`} alt={agent.name}/>
                </figure>
            </div>
            <div className="media-content">
                <p className="title is-6">{agent.name}</p>
                <p className="subtitle is-7">{agent.description}</p>
            </div>
    </div>
    )
}

export default UserCardComp;