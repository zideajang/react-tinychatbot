import React, { useEffect, useState } from "react";
import NavbarComp from "../components/NavbarComp";
import { useAgentStore } from "../state/useAgentStore";
import { useUserStore } from "../state/useUserStore";
import Markdown from "react-markdown";
import config from "../config";



const MessageListPage = () => {
    const { agent } = useAgentStore();
    const { user } = useUserStore();
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMessages = async () => {
            setLoading(true);
            setError(null);
            try {
                const userId = user?.id;
                const agentId = agent?.id;

                if (userId && agentId) {
                    const queryParams = new URLSearchParams({ userId, agentId });
                    const response = await fetch(`${config.baseUrl}/messages/?${queryParams.toString()}`);

                    if (!response.ok) {
                        const errorData = await response.json();
                        throw new Error(`Failed to fetch messages: ${response.status} - ${errorData?.detail || response.statusText}`);
                    }

                    const data = await response.json();
                    setMessages(data);
                } else {
                    // 如果 userId 或 agentId 为空，可以设置一个空数组或采取其他处理方式
                    setMessages([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();
    }, [agent?.id, user?.id]); // 当 agent.id 或 user.id 变化时重新执行

    if (loading) {
        return <div>Loading messages...</div>;
    }

    if (error) {
        return <div>Error loading messages: {error}</div>;
    }

    return (
        <>
            <NavbarComp title={"Messages"} />
            <div className="container is-fluid" style={{ marginTop: 64 }}>
                {agent && <article class="media">
                    <figure class="media-left">
                        <p class="image is-64x64">
                        <img className="is-rounded" src={`${config.baseUrl}${agent.iconUrl}`}  alt={agent.name}/>
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                        <p>
                            <strong>{agent.name}</strong> <small>assistant</small> <small></small>
                            <br />
                            {agent.description}
                        </p>
                        </div>
                        
                    </div>
                    <div class="media-right">
                        <button class="delete"></button>
                    </div>
                </article>}

                {user && <article class="media">
                    <figure class="media-left">
                        <p class="image is-64x64">
                        <img className="is-rounded" src={`${config.baseUrl}${user.iconUrl}`}  alt={agent.name}/>
                        </p>
                    </figure>
                    <div class="media-content">
                        <div class="content">
                        <p>
                            <strong>{user.name}</strong> <small>user</small> <small></small>
                            <br />
                            {user.description}
                        </p>
                        </div>
                        
                    </div>
                    <div class="media-right">
                        <button class="delete"></button>
                    </div>
                </article>}
                
                <label className="label">历史消息</label>
                
                {messages.length > 0 ? (
                    <ul>
                        {messages.map(msg => (
                            <div className="box" key={msg.id}>
                                <strong>{msg.role}:</strong>
                                {msg.role==="assistant"?(
                                    <>
                                    <Markdown>{msg.content}</Markdown>
                                    <span>{msg.createAt}</span>
                                    </>
                                ):(
                                    <>
                                    <p>{msg.content}</p> 
                                    <span>{msg.createAt}</span>
                                    </>
                                )}
                            </div>
                        ))}
                    </ul>
                ) : (
                    <div>No messages found for this agent and user.</div>
                )}
            </div>
        </>
    );
};

export default MessageListPage;