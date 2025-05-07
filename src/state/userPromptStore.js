

import { create } from 'zustand';
import axios from 'axios';

export const usePromptStore = create((set, get) => ({
    prompt: null,         // Single prompt
    prompts: [],         // Array of prompts
    loading: false,
    error: null,
    
    // Set single prompt
    setPrompt: (prompt) => set({ prompt }),
    
    // Fetch all prompts
    getPrompts: async () => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get('http://localhost:8000/prompts/');
            set({ prompts: response.data, loading: false });
        } catch (error) {
            set({ error: error.message || 'Failed to fetch prompts', loading: false });
        }
    },
    
    // Create new prompt
    createPrompt: async (promptData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.post('http://localhost:8000/prompts/', promptData);
            set(state => ({ 
                prompts: [...state.prompts, response.data], 
                loading: false 
            }));
            return response.data;
        } catch (error) {
            set({ error: error.message || 'Failed to create prompt', loading: false });
            return null;
        }
    },
    
    // Update existing prompt
    updatePrompt: async (promptId, promptData) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.put(
                `http://localhost:8000/prompts/${promptId}`, 
                promptData
            );
            
            if (response.data) {
                set(state => ({
                    prompts: state.prompts.map(prompt =>
                        prompt.id === promptId ? { ...prompt, ...response.data } : prompt
                    ),
                    loading: false,
                }));
            } else {
                set({ error: 'Prompt not found on server', loading: false });
            }
            return response.data;
        } catch (error) {
            set({ error: error.message || 'Failed to update prompt', loading: false });
            return null;
        }
    },
    
    // Delete prompt
    deletePrompt: async (promptId) => {
        set({ loading: true, error: null });
        try {
            await axios.delete(`http://localhost:8000/prompts/${promptId}`);
            set(state => ({
                prompts: state.prompts.filter(prompt => prompt.id !== promptId),
                loading: false
            }));
            return true;
        } catch (error) {
            set({ error: error.message || 'Failed to delete prompt', loading: false });
            return false;
        }
    },
    
    // Get single prompt by ID (optional)
    getPromptById: async (promptId) => {
        set({ loading: true, error: null });
        try {
            const response = await axios.get(`http://localhost:8000/prompts/${promptId}`);
            set({ prompt: response.data, loading: false });
            return response.data;
        } catch (error) {
            set({ error: error.message || 'Failed to fetch prompt', loading: false });
            return null;
        }
    }
}));