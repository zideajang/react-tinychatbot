import React from 'react';
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from 'uuid'; // For generating UUIDs
import { format } from 'date-fns'; // For formatting the date (optional)
import NavbarComp from '../components/NavbarComp';
import config from '../config';



const PromptPage = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    // Include the generated ID and creation timestamp before submitting
    const newPrompt = {
        id: uuidv4(),
        createAt: new Date().toISOString(),
        name: data.name,
        content: `**role**\n${data.role || ''}\n\n**instructions**\n${data.instructions || ''}\n\n**constraints**\n${data.constraints || ''}\n\n**examples**\n${data.examples || ''}\n\n**context**\n${data.context || ''}`,
        role: data.role ? data.role.split(',').map(r => r.trim()) : null,
        instructions: data.instructions ? data.instructions.split('\n').map(i => i.trim()) : null,
        constraints: data.constraints ? data.constraints.split('\n').map(c => c.trim()) : null,
        examples: data.examples ? data.examples.split('\n').map(e => e.trim()) : null,
        context: data.context || null,
      };
  
      try {
        const response = await fetch(`${config.baseUrl}/prompts/`, { // 确保 API 路径与您的 FastAPI 路由匹配
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newPrompt),
        });
  
        if (response.ok) {
          console.log('Prompt 创建成功!', await response.json());
          reset(); // 清空表单
          // 可选: 导航到 Prompt 列表页或其他页面
        //   navigate('/prompts');
        } else {
          console.error('创建 Prompt 失败:', await response.json());
          // 处理错误，例如显示错误消息给用户
        }
      } catch (error) {
        console.error('发送请求时发生错误:', error);
        // 处理网络错误或其他异常
      }
    // In a real application, you would send this data to your backend API
  };

  return (
    <>
    <NavbarComp title={"创建 Prompt"}/>
    <div className="container is-fluid " style={{
        marginTop:64
    }}>
      <div className="is-size-5 has-text-centered">创建 Prompt</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="field">
          <label className="label is-size-6">名称</label>
          <div className="control">
            <input
              {...register('name', { required: '名称不能为空' })}
              className={`input ${errors.name ? 'is-danger' : 'is-link'} is-small`}
              type="text"
              placeholder="请输入 Prompt 名称"
            />
          </div>
          {errors.name && <p className="help is-danger">{errors.name.message}</p>}
        </div>

        <div className="field">
          <label className="label is-size-6">角色 (可选)</label>
          <div className="control">
            <input
              {...register('role')}
              className="input is-link"
              type="text"
              placeholder="请输入角色，多个角色请用逗号分隔"
            />
          </div>
          <p className="help">多个角色请用逗号分隔</p>
        </div>

        <div className="field">
          <label className="label is-size-6">指令 (可选)</label>
          <div className="control">
            <textarea
              {...register('instructions')}
              className="textarea is-link is-small"
              placeholder="请输入指令，每条指令占一行"
            />
          </div>
          <p className="help">每条指令占一行</p>
        </div>

        <div className="field">
          <label className="label is-size-6">约束 (可选)</label>
          <div className="control">
            <textarea
              {...register('constraints')}
              className="textarea is-link is-small"
              placeholder="请输入约束，每条约束占一行"
            />
          </div>
          <p className="help">每条约束占一行</p>
        </div>

        <div className="field">
          <label className="label is-size-6">示例 (可选)</label>
          <div className="control">
            <textarea
              {...register('examples')}
              className="textarea is-link is-small"
              placeholder="请输入示例，每个示例占一行"
            />
          </div>
          <p className="help">每个示例占一行</p>
        </div>

        <div className="field">
          <label className="label is-size-6">上下文 (可选)</label>
          <div className="control">
            <textarea
              {...register('context')}
              className="textarea is-link"
              placeholder="请输入上下文信息"
            />
          </div>
        </div>

        <div className="control">
          <button type="submit" className="button is-primary">
            创建 Prompt
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default PromptPage;