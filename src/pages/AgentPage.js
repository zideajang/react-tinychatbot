import React, { useState, useCallback,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAgentStore } from '../state/useAgentStore';
// 假设您有一个管理 Agent 状态的 Store
// import { useAgentStore } from '../state/useAgentStore';

import { RxAvatar } from "react-icons/rx";
import { usePromptStore } from '../state/userPromptStore';
import NavbarComp from '../components/NavbarComp';


const AgentPage = () => {
  const { agent,updateAgent, setAgent } = useAgentStore(); // 假设有这些方法
    const { prompts, loading, error, getPrompts,setPrompt } = usePromptStore();
  
  const [action,setAction] = useState('create')
  const {agentId,setAgentId} = useState(agent?.id)
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const [iconUrl, setIconUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const agentName = watch('name');

  const navigate = useNavigate();

   useEffect(() => {
      getPrompts(); // This will handle all the loading/error states internally
}, []);

  const handleImageUpload = useCallback(async (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file, `${agentName}.${file.name.split('.').pop()}`); // 使用 agentId 作为文件名
    formData.append('username', agentName);
    try {
      const response = await fetch('http://localhost:8000/upload/avatar', { // 更改上传 Agent 图标的 API
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setIconUrl(data.iconUrl);
      } else {
        const errorData = await response.json();
        setUploadError(errorData.detail || '图片上传失败');
      }
    } catch (error) {
      setUploadError('网络错误，上传失败');
    } finally {
      setUploading(false);
    }
  }, [agentName]);

  const onSubmit = useCallback(async (data) => {
    let uploadedIconUrl = iconUrl;
    if (!uploadedIconUrl && data.icon) { // 如果没有上传过，且有选择文件，字段名改为 icon
      const uploadResult = await handleImageUpload({ target: { files: [data.icon[0]] } });
      if (uploadError) {
        return; // 上传失败，阻止提交
      }
      uploadedIconUrl = iconUrl; // 上传成功后更新 uploadedIconUrl
    }

    const agentData = {
      iconUrl: uploadedIconUrl,
      name: data.name, // 使用表单中的 name
      description: data.description,
      promptId: data.promptId, // 假设表单中有 promptId
      // id 将由后端生成，前端不需要传递
    };

    // const apiUrl = action === 'create' ? 'http://localhost:8000/agents' : `http://localhost:8000/agents/${agentId}`;
    const apiUrl = 'http://localhost:8000/agents'
    const method = action === 'create' ? 'POST' : 'PUT'; 
    try {
      const response = await fetch(apiUrl, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      if (response.ok) {
        console.log(`Agent ${action === 'create' ? '创建' : '更新'}成功`, await response.json());
        // if (action === 'create') {
        //   setAgent(await response.json()); // 设置新创建的 Agent
        // } else {
        //   updateAgent({ id: agentId, ...agentData }); // 更新 Agent
        // }
        navigate('/agents'); // 重定向到 Agent 列表页面
      } else {
        console.error(`Agent ${action === 'create' ? '创建' : '更新'}失败`, await response.json());
        // 显示错误信息给用户
      }
    } catch (error) {
      console.error('网络错误', error);
      // 显示网络错误信息给用户
    }
  }, [action, agentId, handleImageUpload, iconUrl, navigate]);

  return (
    <>
    <NavbarComp title={action === 'create' ? `创建 ${agentName} Agent` : '编辑 Agent'}/>
    <div className="container is-fluid " style={{
        marginTop:64
    }}>
      <section className="section">
        {agentId && <p className=" has-text-centered is-size-7">Agent ID: {agentId}</p>}
      </section>
      <section className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            <form onSubmit={handleSubmit(onSubmit)}>
                
              <div className="field">
                <div className="control">
                  {iconUrl ? (
                    <div className='is-flex is-justify-content-center'>
                      <figure className="image is-128x128 mb-3" onClick={() => setIconUrl(null)}>
                        <img className="is-rounded" src={`http://localhost:8000${iconUrl}`} alt="Agent Icon" />
                      </figure>
                    </div>
                  ) : (
                    <div className='is-flex is-justify-content-center'>
                    <div className="file">
                      <label className="file-label">
                        <input
                          className="file-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                        <span className="file-cta">
                          <span className="file-icon">
                            <RxAvatar/>
                          </span>
                          <span className='is-size-7'>选择 Agent 图标</span>
                        </span>
                      </label>
                    </div>
                    </div>
                  )}
                  {uploading && <progress className="progress is-small is-primary" max="100">上传中...</progress>}
                  {uploadError && <p className="help is-danger">{uploadError}</p>}
                </div>
              </div>

              <div className="field">
                <label className="label is-size-6">Agent 名称</label>
                <div className="control">
                  <input
                    {...register('name', { required: 'Agent 名称不能为空' })}
                    className={`input ${errors.name ? 'is-danger' : 'is-link'}`}
                    type="text"
                    placeholder="请输入 Agent 名称"
                  />
                </div>
                {errors.name && <p className="help is-danger">{errors.name.message}</p>}
              </div>

              <div className="field mb-3">
                    <label className="label is-pulled-left">Prompt</label>
                    <button className='button is-pulled-right is-small is-success mb-3' onClick={(event)=>navigate("/prompt")}>添加</button>

                    <div className="control has-icons-left ">
                        <div className={`select is-fullwidth ${errors.promptId ? 'is-danger' : 'is-info'}`}>
                        <select 
                            {...register('promptId', { required: '请选择 Prompt' })}
                            
                        >
                            <option value="">请选择 Prompt</option>
                            {prompts && prompts.map((prompt) => (
                            <option key={prompt.id} value={prompt.id}>
                                {prompt.name || `Prompt ${prompt.id}`}
                            </option>
                            ))}
                        </select>
                        </div>
                        
                    </div>
                    {errors.promptId && (
                        <p className="help is-danger">{errors.promptId.message}</p>
                    )}
            </div>

              <div className="field">
                <label className="label is-size-6">Agent 描述 (可选)</label>
                <div className="control">
                  <textarea
                    {...register('description')}
                    className={`textarea ${errors.description ? 'is-danger' : ''} is-size-7`}
                    placeholder="请输入 Agent 描述"
                  />
                </div>
                {errors.description && <p className="help is-danger">{errors.description.message}</p>}
              </div>

              <div className="field is-grouped is-pulled-right">
                <div className="control">
                  <button type="submit" className="button
                    is-small
                    is-primary">{action === 'create' ? '创建' : '保存'}</button>
                </div>
                <div className="control">
                  <button className="button is-link
                    is-small
                    is-light" onClick={() => navigate(-1)}>取消</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
    </>
  );
};

export default AgentPage;