import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User, Department, AppTab, Memory, AgentMessage, SystemStatus } from '../types';
import { DEMO_USERS } from '../data/mockUsers';

interface AppContextType {
  currentUser: User | null;
  currentDepartment: Department;
  currentRole: string;
  activeTab: AppTab;
  theme: 'light' | 'dark';
  systemStatus: SystemStatus;
  memories: Memory[];
  messages: Record<Department, AgentMessage[]>;
  isLoadingAgent: boolean;
  login: (user: User) => void;
  logout: () => void;
  switchDepartment: (department: Department) => void;
  setActiveTab: (tab: AppTab) => void;
  toggleTheme: () => void;
  sendAgentQuery: (question: string) => Promise<void>;
  addMemory: (memory: Omit<Memory, 'id'>) => Promise<void>;
  fetchMemories: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_SYSTEM_STATUS: SystemStatus = {
  hindsightConnected: false,
  isDemoMode: true,
  aiProvider: 'demo',
  configuredProvider: 'Demo Memory LLM',
};

const INITIAL_MESSAGES: Record<Department, AgentMessage[]> = {
  Product: [],
  Marketing: [],
  'Customer Service': [],
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(DEMO_USERS[0]);
  const [currentDepartment, setCurrentDepartment] = useState<Department>('Product');
  const [currentRole, setCurrentRole] = useState<string>('Product Manager');
  const [activeTab, setActiveTab] = useState<AppTab>('overview');
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [systemStatus, setSystemStatus] = useState<SystemStatus>(INITIAL_SYSTEM_STATUS);
  const [memories, setMemories] = useState<Memory[]>([]);
  const [messages, setMessages] = useState<Record<Department, AgentMessage[]>>(INITIAL_MESSAGES);
  const [isLoadingAgent, setIsLoadingAgent] = useState<boolean>(false);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    fetch('/api/health')
      .then(res => res.json())
      .then((data: SystemStatus) => {
        setSystemStatus(data);
      })
      .catch(err => {
        console.warn('Failed to fetch system status, using default demo status:', err);
      });

    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    try {
      const res = await fetch('/api/memories');
      if (res.ok) {
        const data = await res.json();
        setMemories(data.memories || []);
      }
    } catch (err) {
      console.warn('Failed to fetch memories from server:', err);
    }
  };

  const login = (user: User) => {
    setCurrentUser(user);
    setCurrentDepartment(user.department);
    setCurrentRole(user.role);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchDepartment = (department: Department) => {
    setCurrentDepartment(department);
    const matchingUser = DEMO_USERS.find(u => u.department === department);
    if (matchingUser && currentUser) {
      setCurrentUser({
        ...currentUser,
        department,
        name: matchingUser.name,
        role: matchingUser.role,
      });
      setCurrentRole(matchingUser.role);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const addMemory = async (newMem: Omit<Memory, 'id'>) => {
    try {
      const res = await fetch('/api/memories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newMem),
      });
      if (res.ok) {
        await fetchMemories();
      }
    } catch (err) {
      console.error('Error adding memory:', err);
    }
  };

  const sendAgentQuery = async (question: string) => {
    if (!question.trim() || isLoadingAgent) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: AgentMessage = {
      id: userMsgId,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: question,
    };

    const agentMsgId = `agent-${Date.now()}`;
    const initialAgentMsg: AgentMessage = {
      id: agentMsgId,
      sender: 'agent',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isThinking: true,
      thinkingSteps: [
        `Understanding user context (${currentDepartment} · ${currentRole})...`,
        `Searching Hindsight organizational memory for query entity...`,
        `Synthesizing relevant evidence and historical context...`,
        `Formatting grounded response...`
      ],
    };

    setMessages(prev => ({
      ...prev,
      [currentDepartment]: [...(prev[currentDepartment] || []), userMsg, initialAgentMsg],
    }));

    setIsLoadingAgent(true);

    try {
      const res = await fetch('/api/agent/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          department: currentDepartment,
          role: currentRole,
          name: currentUser?.name || 'User',
        }),
      });

      if (!res.ok) {
        throw new Error('Intelligence service returned an error response.');
      }

      const data = await res.json();

      const completedAgentMsg: AgentMessage = {
        id: agentMsgId,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredAnswer: data.answer,
        sources: data.memories || [],
        isThinking: false,
      };

      setMessages(prev => ({
        ...prev,
        [currentDepartment]: prev[currentDepartment].map(msg =>
          msg.id === agentMsgId ? completedAgentMsg : msg
        ),
      }));
    } catch (err: any) {
      const errorAgentMsg: AgentMessage = {
        id: agentMsgId,
        sender: 'agent',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isThinking: false,
        error: true,
        errorMessage: err.message || 'The intelligence service could not generate a response.',
      };

      setMessages(prev => ({
        ...prev,
        [currentDepartment]: prev[currentDepartment].map(msg =>
          msg.id === agentMsgId ? errorAgentMsg : msg
        ),
      }));
    } finally {
      setIsLoadingAgent(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentDepartment,
        currentRole,
        activeTab,
        theme,
        systemStatus,
        memories,
        messages,
        isLoadingAgent,
        login,
        logout,
        switchDepartment,
        setActiveTab,
        toggleTheme,
        sendAgentQuery,
        addMemory,
        fetchMemories,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
