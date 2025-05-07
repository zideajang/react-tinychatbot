import React, { useCallback,useEffect } from 'react';
import { useUserStore } from '../state/useUserStore';
import { useForm } from 'react-hook-form';
import { useAgentStore } from '../state/useAgentStore';
import { useNavigate } from 'react-router-dom'; // 引入 useNavigate
import { FaUserCircle } from "react-icons/fa";
import { RiRobot2Line } from "react-icons/ri";

const HomePage = () => {
  const { user, loading, error, getUser } = useUserStore();
  const { agents, loading : agentLoading, error : agentError, getAgents,setAgent } = useAgentStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate(); // 获取 navigate 函数

  const onSubmit = useCallback(async (data) => {
    await getUser(data.username);

    if (user && data.agent) { // 确保用户已登录且选择了 agent
        navigate('/chat');
        const selectedAgent = agents.find(agent => agent.id === data.agent);
        setAgent(selectedAgent || null);
    }else{
      if(user === null){
        navigate(`/userpage/create/${data.username}`);
        const selectedAgent = agents.find(agent => agent.id === data.agent);
        setAgent(selectedAgent || null);
      }
    }
  }, [getUser,user,navigator,setAgent]);

  useEffect(() => {
    getAgents();
  }, [getAgents]);

  return (
    <div className="container is-fluid">
      <section className="section">
        <h1 className="title has-text-centered">Tiny Chatbot</h1>
      </section>
      <section className="section">
        <div className="columns is-centered">
          <div className="column">
            <div className="has-text-centered">
              <figure className="image is-128x128 is-inline-block">
                <img
                  className="is-rounded"
                  src={`${user?.iconUrl?`htttp://localhost:8000${user?.iconUrl}`:"https://bulma.io/assets/images/placeholders/128x128.png"}`}
                  alt="User Avatar"
                />
              </figure>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="field">
                <label className="label">用户名</label>
                <div className="control has-icons-left">
                
                  <input
                    {...register('username', { required: '用户名是必需的' })}
                    className={`input ${errors.username ? 'is-danger' : ''} is-rounded is-link`}
                    type="text"
                    placeholder="请输入用户名"
                  />
                  <span class="icon is-small is-left">
                    <FaUserCircle/>
                </span>
                  {errors.username && (
                    <p className="help is-danger">{errors.username.message}</p>
                  )}
                </div>
              </div>
              <div className="field mb-3">
                <label className="label">Agent</label>
                <div className="control has-icons-left">
                  <div className="select is-fullwidth is-rounded is-info">
                    <select {...register('agent')}>
                        {agents && agents.map((agent,idx)=>(
                            <option  key={agent.id} 
                                value={agent.id}>{agent.name}</option>

                        ))}
                      
                    </select>
                  </div>
                    <div class="icon is-small is-left">
                        <RiRobot2Line/>
                    </div>
                </div>
              </div>
                  {loading && <progress class="progress is-small is-primary" max="100">15%</progress>
                  }
              <div className="field mt-6">
                <div className="control">
                  <button type="submit" className="button is-info is-fullwidth is-rounded">
                    登录
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;