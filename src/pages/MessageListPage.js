import React, { useEffect, useState } from "react";
import NavbarComp from "../components/NavbarComp";
import { useAgentStore } from "../state/useAgentStore";
import { useUserStore } from "../state/useUserStore";
import Markdown from "react-markdown";

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
                    const response = await fetch(`http://localhost:8000/messages/?${queryParams.toString()}`);

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
                {user?.id}
                {agent?.id}
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