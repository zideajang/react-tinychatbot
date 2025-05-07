import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePromptStore } from '../state/userPromptStore';
import NavbarComp from '../components/NavbarComp';

const PromptListPage = () => {
//   const [prompts, setPrompts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

  const { prompts, loading, error, getPrompts,setPrompt } = usePromptStore();

  const navigate = useNavigate();

  useEffect(() => {
    getPrompts(); // This will handle all the loading/error states internally
  }, []);

//   useEffect(() => {
//     const fetchPrompts = async () => {
//       try {
//         const response = await fetch('http://localhost:8000/prompts/'); // 确保 API 路径与你的 FastAPI 路由匹配
//         if (!response.ok) {
//           const message = `HTTP error! status: ${response.status}`;
//           throw new Error(message);
//         }
//         const data = await response.json();
//         setPrompts(data);
//         setLoading(false);
//       } catch (error) {
//         setError(error);
//         setLoading(false);
//         console.error('获取 Prompt 列表失败:', error);
//       }
//     };

//     fetchPrompts();
//   }, []); // 空依赖数组意味着这个 effect 只会在组件挂载后执行一次

  if (loading) {
    return <div className="has-text-centered">Loading prompts...</div>;
  }

  if (error) {
    return <div className="has-text-danger has-text-centered">Error loading prompts: {error.message}</div>;
  }

  const handleClickOnPrompt = (event,agent)=>{
    navigate(`/promptpreview`);
    setPrompt(agent)
  }

  return (
    <>
    <NavbarComp title={"Prompt 列表"}/>
    <div className="container is-fluid" style={{
        marginTop:64
    }}>
      {prompts.length === 0 ? (
        <div className="has-text-centered ">暂无 Prompt</div>
      ) : (
        <div className="columns is-multiline mt-6">
          {prompts.map((prompt) => (
            <div className='box'
                key={prompt.id}
                onClick={(event)=>handleClickOnPrompt(event,prompt)}
                >
                <div className='level'>
                    <span>{prompt.name}</span>
                    <p className='is-size-7'>
                    {prompt.role?prompt.role:"暂时没有给出角色描述"}

                    </p>
                </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default PromptListPage;