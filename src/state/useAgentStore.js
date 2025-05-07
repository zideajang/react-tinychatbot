import { create } from 'zustand';
import axios from 'axios';
import config from '../config';


export const useAgentStore = create((set, get) => ({
    agent: null,
    agents: [],
    loading: false,
    error: null,
    setAgent: (agent) => set({ agent }),
    getAgents: async () => {
      set({ loading: true, error: null });
      try {
        const response = await axios.get(`${config.baseUrl}/agents/`);
        console.log(response.data)
        set({ agents: response.data, loading: false });
      } catch (error) {
        set({ error: error.message || 'Failed to fetch agents', loading: false });
      }
    },
    createAgent: async (agentData) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.post(`${config.baseUrl}/agents/`, agentData);
        set(state => ({ agents: [...state.agents, response.data], loading: false }));
        return response.data;
      } catch (error) {
        set({ error: error.message || 'Failed to create agent', loading: false });
        return null;
      }
    },
    updateAgent: async (agentId, agentData) => {
      set({ loading: true, error: null });
      try {
        const response = await axios.put(`${config.baseUrl}/agents/${agentId}`, agentData);
        if (response.data) {
          set(state => ({
            agents: state.agents.map(agent =>
              agent.id === agentId ? { ...agent, ...response.data } : agent
            ),
            loading: false,
          }));
        } else {
          set({ error: 'Agent not found on server', loading: false });
        }
        return response.data;
      } catch (error) {
        set({ error: error.message || 'Failed to update agent', loading: false });
        return null;
      }
    },
  }));