import { useState,useRef,useEffect,useCallback } from "react"
import MessageComp from "../components/MessageComp";
import AgentCardComp from "../components/AgentCardComp";
import { useAgentStore } from "../state/useAgentStore";
import { useUserStore } from "../state/useUserStore";
import { getCurrentTimeHHMM } from "../common/helper";
import { Link, Button, Element, Events, animateScroll as scroll, scrollSpy } from 'react-scroll';


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
            setLoading(false); // 收到消息后停止加载
            setMessages((prevMessages) => [...prevMessages, {...parsedMessage,time:getCurrentTimeHHMM()}]);
            scrollToBottom()
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
                "content":message,
                "time":getCurrentTimeHHMM()
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
    const scrollToBottom = () => {
        scroll.scrollToBottom();
    };

    useEffect(() => {
    
        // Registering the 'begin' event and logging it to the console when triggered.
        Events.scrollEvent.register('begin', (to, element) => {
          console.log('begin', to, element);
        });
    
        // Registering the 'end' event and logging it to the console when triggered.
        Events.scrollEvent.register('end', (to, element) => {
          console.log('end', to, element);
        });
    
        // Updating scrollSpy when the component mounts.
        scrollSpy.update();
    
        // Returning a cleanup function to remove the registered events when the component unmounts.
        return () => {
          Events.scrollEvent.remove('begin');
          Events.scrollEvent.remove('end');
        };
      }, []);
  

    return(
        <div className="container">
            <AgentCardComp agent={agent} loading={loading}/>
            
            <div className="container pl-6 pr-6" style={{
                paddingTop:'96px',
                height:'100vh',
                paddingBottom:'80px',
                overflow:'auto'
            
            }}>
                <div className="element" id="containerElement">

                {
                    messages && messages.map((message,idx)=>(
                        <Element name={`message-${idx}`} >
                            <MessageComp key={message.id} message={message} agent={agent} user={user}/>
                        </Element>
                    ))
                }
                </div>
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