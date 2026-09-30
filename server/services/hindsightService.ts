import { Memory, Department } from '../../src/types';
import { INITIAL_MEMORIES } from '../../src/data/mockMemories';
import { CONFIG } from '../config';

export class HindsightService {
  private localMemories: Memory[] = [...INITIAL_MEMORIES];

  public isConnected(): boolean {
    return Boolean(CONFIG.HINDSIGHT_API_KEY && CONFIG.HINDSIGHT_BASE_URL);
  }

  public async recall(params: {
    query: string;
    department?: Department;
    entity?: string;
  }): Promise<Memory[]> {
    if (this.isConnected()) {
      try {
        const response = await fetch(`${CONFIG.HINDSIGHT_BASE_URL}/recall`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.HINDSIGHT_API_KEY}`,
          },
          body: JSON.stringify(params),
        });

        if (response.ok) {
          const data = await response.json();
          if (Array.isArray(data.memories)) {
            return data.memories;
          }
        }
      } catch (err) {
        console.warn('Real Hindsight recall failed, falling back to local organizational memory store:', err);
      }
    }

    // Local Memory Search (Demo / Fallback Mode)
    return this.localRecall(params);
  }

  private localRecall(params: {
    query: string;
    department?: Department;
    entity?: string;
  }): Memory[] {
    const q = params.query.toLowerCase();
    const targetDept = params.department;
    const targetEntity = params.entity?.toLowerCase();

    // Key entity detector from text
    const isP500 = q.includes('p500');
    const isCampaign = q.includes('campaign') || q.includes('conversion') || q.includes('q3');
    const isAuth = q.includes('auth') || q.includes('login') || q.includes('sso');

    const results = this.localMemories.filter(mem => {
      const memDept = mem.department;
      const memEntity = mem.entity.toLowerCase();
      const memObs = mem.observation.toLowerCase();
      const memEv = mem.evidence.toLowerCase();

      // Entity direct match
      if (targetEntity && memEntity.includes(targetEntity)) return true;
      if (isP500 && memEntity.includes('p500')) return true;
      if (isCampaign && (memEntity.includes('campaign') || memObs.includes('conversion'))) return true;
      if (isAuth && (memEntity.includes('auth') || memObs.includes('sso'))) return true;

      // Keyword match across text
      const keywords = q.split(/\s+/).filter(w => w.length > 3);
      const matchesKeyword = keywords.some(k => memObs.includes(k) || memEv.includes(k) || memEntity.includes(k));

      if (matchesKeyword) return true;

      // Department fallback match if general query
      if (targetDept && memDept === targetDept) return true;

      return false;
    });

    // If query matches P500 explicitly, ensure cross-department memories (Product & CS & Marketing) are returned!
    if (isP500) {
      const p500Memories = this.localMemories.filter(m => m.entity.toUpperCase().includes('P500'));
      if (p500Memories.length > 0) return p500Memories;
    }

    // Default: Return top relevant memories or top 3 memories
    return results.length > 0 ? results.slice(0, 4) : this.localMemories.slice(0, 3);
  }

  public async retain(memoryData: Omit<Memory, 'id'>): Promise<Memory> {
    const newMemory: Memory = {
      ...memoryData,
      id: `mem-${Date.now()}`,
    };

    if (this.isConnected()) {
      try {
        const response = await fetch(`${CONFIG.HINDSIGHT_BASE_URL}/retain`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${CONFIG.HINDSIGHT_API_KEY}`,
          },
          body: JSON.stringify(newMemory),
        });

        if (response.ok) {
          const resJson = await response.json();
          if (resJson.memory) return resJson.memory;
        }
      } catch (err) {
        console.warn('Real Hindsight retain failed, saving locally:', err);
      }
    }

    this.localMemories.unshift(newMemory);
    return newMemory;
  }

  public async getAllMemories(departmentFilter?: Department): Promise<Memory[]> {
    if (departmentFilter) {
      return this.localMemories.filter(m => m.department === departmentFilter);
    }
    return this.localMemories;
  }
}

export const hindsightService = new HindsightService();
