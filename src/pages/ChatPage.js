import { useState,useRef,useEffect,useCallback } from "react"
import MessageComp from "../components/MessageComp";
import UserCardComp from "../components/UserCardComp";
import { useAgentStore } from "../state/useAgentStore";
import { useUserStore } from "../state/useUserStore";
const ChatPage = ()=>{

      const { agent } = useAgentStore();
      const {user} = useUserStore();
    
    const [messages,setMessages] = useState([]);
    const [message,setMessage] = useState()
    const websocket = useRef(null);
    const [isConnected, setIsConnected] = useState(false);
    const [loading,setLoading] = useState(false);

    console.log(agent.iconUrl)
    console.log(JSON.stringify(agent))


    const connectWebSocket = useCallback(() => {
        if (websocket.current) {
          disconnectWebSocket(); // 确保先断开之前的连接
        }
        websocket.current = new WebSocket('ws://localhost:8000/ws');
    
        websocket.current.onopen = () => {
          console.log('WebSocket connected');
          setIsConnected(true);
        };
    
        websocket.current.onclose = () => {
          console.log('WebSocket disconnected');
          setIsConnected(false);
        };
    
        websocket.current.onmessage = (event) => {
          try {
            const parsedMessage = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, parsedMessage]);
            setLoading(false); // 收到消息后停止加载
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
            // 错误处理：可以显示错误消息，或者尝试重新连接
          }
        };
    
        websocket.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          setIsConnected(false);
          setLoading(false);
        };
      }, [setMessages,setIsConnected]);
    
      const disconnectWebSocket = useCallback(() => {
        if (websocket.current) {
          websocket.current.close();
          websocket.current = null;
        }
      },[]);

    useEffect(() => {
        connectWebSocket();
    
        return () => {
          disconnectWebSocket();
        };
      }, [connectWebSocket, disconnectWebSocket]); 
    
    const sendMessage = (event) => {
        event.preventDefault()
        if (isConnected && websocket.current && message) {
            setLoading(true);
            setMessages((preMessages)=>([...preMessages,{
                "role":"user",
                "content":message
            }]))
            websocket.current.send(JSON.stringify({
                role:"user",
                user:user.id,
                agent:agent.id,
                content:message,
                total_tokens:-1
            }));
            setMessage('');
        }
    };

    return(
        <div className="container">
            <UserCardComp agent={agent}/>
            {loading && <progress class="progress is-small is-primary" max="100">15%</progress>
            }
            <div className="section">
                {
                    messages && messages.map((message,idx)=>(
                        <MessageComp key={message.id} message={message} agent={agent} user={user}/>
                    ))
                }
            </div>
            <form onSubmit={sendMessage} className="p-3" style={{
                position:'fixed',
                bottom:36,
                left:0,
                right:0
            }}>
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="输入信息"
                    className="input is-rounded" />
            </form>
        </div>
    )
}

export default ChatPage