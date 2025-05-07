
import NavbarComp from '../components/NavbarComp';
import { usePromptStore } from '../state/userPromptStore';
import Markdown from 'react-markdown'


const PromptPreviewPage = ()=>{
    const {prompt} = usePromptStore()
    return(
        <>
            
        <NavbarComp title={prompt.name}/>
        <div className='container is-fluid'>
            {
                prompt.role && 
                <div className='content' style={{
                    marginTop:64
                }}>
                    <Markdown>
                    {prompt.content}
                    </Markdown>
                </div>
            }
        </div>
        </>
    )
}

export default PromptPreviewPage;