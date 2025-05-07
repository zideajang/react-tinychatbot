import React,{useState,useCallback} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useUserStore } from '../state/useUserStore';
import config from '../config';
import { RxAvatar } from "react-icons/rx";

const UserPage = () => {
  const { action, username } = useParams();
  const { updateUser,setUser } = useUserStore();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [iconUrl, setIconUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const navigate = useNavigate();
  
  const handleImageUpload = useCallback(async (event) => {
    
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file, `${username}.${file.name.split('.').pop()}`); // 使用 username 作为文件名
    formData.append('username', username);
    try {
      const response = await fetch('http://localhost:8000/upload/avatar', {
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
  }, [username]);
  
  const onSubmit = useCallback(async (data) => {
    let uploadedIconUrl = iconUrl;
    if (!uploadedIconUrl && data.avatar) { // 如果没有上传过，且有选择文件
      uploadedIconUrl = await handleImageUpload(data.avatar[0]); // 上传图片
      if (!uploadedIconUrl) {
        return; // 上传失败，阻止提交
      }
    }

    // 在这里处理表单提交的数据，包括 iconUrl
    const userData = {
      iconUrl: uploadedIconUrl,
      name: username,
      description: data.description,
      gender: data.gender,
      age: data.age ? parseInt(data.age) : null, // 确保 age 是整数或 null
    };

    try {
      const response = await fetch(`${config.baseUrl}/users`, { // 使用您的用户创建接口
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // 用户创建成功，处理响应
        console.log('用户创建成功', await response.json());

        setUser(userData);
        // useUserState 设置用户
        navigate('/chat'); // 重定向到成功页面
      } else {
        // 用户创建失败，处理错误
        console.error('用户创建失败', await response.json());
        // 显示错误信息给用户
      }
    } catch (error) {
      console.error('网络错误', error);
      // 显示网络错误信息给用户
    }
  }, [handleImageUpload, iconUrl, navigate, username]);

  

  return (
    <div className="container is-fluid ">
      <section className="section">
        <h1 className="title has-text-centered">{action==='create'?"创建用户":"用户"}</h1>
        {username && <p className=" has-text-centered is-size-7">{username}</p>}
      </section>
      <section className="section">
        <div className="columns is-centered">
          <div className="column is-half">
            <form onSubmit={handleSubmit(onSubmit)}>

            <div className="field">
                <div className="control">
                  {iconUrl?  (
                    <div className='is-flex is-justify-content-center'>
                    <figure className="image is-128x128 mb-3" onClick={event=>setIconUrl(null)}>
                      <img className="is-rounded" src={`${config.baseUrl}${iconUrl}`} alt="User Avatar" />
                    </figure>
                    </div>
                  ):(
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
                        <span className='is-size-7'>选择头像</span>
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
                <label className="label is-size-6">用户名</label>
                <div className="control">
                  <input
                    className={`input ${errors.username ? 'is-danger' : 'is-link'}`}
                    type="text"
                    value={username} // 将 URL 中的 username 显示出来，但通常不让用户修改
                    readOnly
                  />
                </div>
              </div>
              <div className="field">
                <label className="label is-size-6">用户描述</label>
                <div className="control">
                  <textarea
                    {...register('description', { required: '用户描述不能为空' })}
                    className={`textarea ${errors.description ? 'is-danger' : ''} is-size-7`}
                    placeholder="请输入用户描述"
                  />
                </div>
                {errors.description && <p className="help is-danger">{errors.description.message}</p>}
              </div>

              <div className="field">
                <label className="label">性别</label>
                <div className="control is-flex">
                    <label className="radio ">
                    <input
                        type="radio"
                        value="male"
                        {...register('gender', { required: '请选择性别' })}
                    />
                    男
                    </label>
                    <label className="radio">
                    <input
                        type="radio"
                        value="female"
                        {...register('gender', { required: '请选择性别' })}
                    />
                    女
                    </label>
                </div>
                {errors.gender && <p className="help is-danger">{errors.gender.message}</p>}
                </div>

              <div className="field">
                <label className="label">年龄 (可选)</label>
                <div className="control">
                  <input
                    {...register('age', { pattern: /^[0-9]*$/i, min: 1, max: 150 })}
                    className={`input ${errors.age ? 'is-danger' : ''}`}
                    type="number"
                    placeholder="请输入年龄"
                  />
                </div>
                {errors.age && errors.age.type === 'pattern' && (
                  <p className="help is-danger">请输入有效的年龄数字</p>
                )}
                {errors.age && errors.age.type === 'min' && (
                  <p className="help is-danger">年龄不能小于 1</p>
                )}
                {errors.age && errors.age.type === 'max' && (
                  <p className="help is-danger">年龄不能大于 150</p>
                )}
              </div>

              <div className="field is-grouped is-pulled-right">
                <div className="control">
                  <button type="submit" className="button 
                    is-small 
                    is-primary">提交</button>
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
  );
};

export default UserPage;