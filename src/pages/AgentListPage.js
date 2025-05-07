import NavbarComp from "../components/NavbarComp";
import { useAgentStore } from "../state/useAgentStore";


const AgentListPage = ()=>{
     const { agents } = useAgentStore();
   
    return (
        <div>
            <NavbarComp title={"Agents"}/>
            <div className="container is-fluid" style={{
                marginTop:64
            }}>
                {agents.length  >  0? (agents.map((agent,idx)=>(
                    <div>{agent.name}</div>
                ))):(
                    <div className="notification">
                        暂时没有Agent
                    </div>
                )}
        </div>
        </div>
    )
}

export default AgentListPage;