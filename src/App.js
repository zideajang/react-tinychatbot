import 'bulma/css/bulma.min.css';
import { BrowserRouter, Routes, Route,Navigate, useParams  } from 'react-router-dom';

// 页面
import UserPage from "./pages/UserPage";
import HomePage from "./pages/HomePage";
import ChatPage from "./pages/ChatPage"; // 假设你创建了 ChatPage 组件
import AgentPage from './pages/AgentPage';
import AgentListPage from './pages/AgentListPage';
import PromptPage from './pages/PromptPage';
import PromptListPage from './pages/PromptListPage';
import PromptPreviewPage from './pages/PromptPreviewPage';
import MessageListPage from './pages/MessageListPage';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/agent" element={<AgentPage />} />
          <Route path="/agents" element={<AgentListPage />} />
          <Route path="/agents" element={<AgentListPage />} />
          <Route path="/prompt" element={<PromptPage />} />
          <Route path="/prompts" element={<PromptListPage />} />
          <Route path="/promptpreview" element={<PromptPreviewPage/>}/>
          <Route path="/messages" element={<MessageListPage/>}/>



          <Route path="/user/detail/:username" element={<Navigate to={`/userpage/detail/:username`} />} />
          <Route path="/user/create/:username" element={<Navigate to={`/userpage/create/:username`} />} />
          <Route path="/userpage/:action/:username" element={<UserPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;