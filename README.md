# tiny Chatbot (React 版本)


需要在 src 文件夹下添加 config 文件
```js

const config = {
    baseUrl: process.env.NODE_ENV === 'production' 
      ? 'https://api.yourdomain.com' 
      : '<服务器端口>'
  };
  
export default config;
```
```shell
npm install
```
```
npm start
```