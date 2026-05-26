/**
 * API Service for Cribble - Connects to Express Backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export interface DesignElement {
  id: number;
  type: 'square' | 'circle' | 'text';
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  text?: string;
}

export interface DesignData {
  headline: string;
  elements: DesignElement[];
  zoom: number;
  canvasWidth: number;
  canvasHeight: number;
  colorPalette: string[];
  premium: boolean;
  price?: string;
}

export interface Design {
  _id?: string;
  userId: string;
  title: string;
  prompt: string;
  designData: DesignData;
  thumbnail?: string;
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface GenerateDesignRequest {
  prompt: string;
  style?: string;
  colorScheme?: string;
  userId?: string;
  saveDesign?: boolean;
}

export interface GenerateDesignResponse {
  success: boolean;
  design: DesignData;
  saved?: boolean;
  designId?: string;
}

// --- API Functions ---

/**
 * Check API health
 */
export async function checkHealth(): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/health`);
  if (!response.ok) throw new Error('API health check failed');
  return response.json();
}

/**
 * Get all designs
 */
export async function getAllDesigns(userId?: string, limit = 50, skip = 0): Promise<Design[]> {
  const params = new URLSearchParams();
  if (userId) params.append('userId', userId);
  params.append('limit', limit.toString());
  params.append('skip', skip.toString());
  
  const response = await fetch(`${API_BASE_URL}/designs?${params}`);
  if (!response.ok) throw new Error('Failed to fetch designs');
  
  const data = await response.json();
  return data.designs;
}

/**
 * Get design by ID
 */
export async function getDesignById(id: string): Promise<Design> {
  const response = await fetch(`${API_BASE_URL}/designs/${id}`);
  if (!response.ok) throw new Error('Failed to fetch design');
  
  const data = await response.json();
  return data.design;
}

/**
 * Create new design
 */
export async function createDesign(design: Omit<Design, '_id' | 'createdAt' | 'updatedAt'>): Promise<Design> {
  const response = await fetch(`${API_BASE_URL}/designs`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(design),
  });
  
  if (!response.ok) throw new Error('Failed to create design');
  
  const data = await response.json();
  return data.design;
}

/**
 * Update existing design
 */
export async function updateDesign(id: string, updates: Partial<Design>): Promise<Design> {
  const response = await fetch(`${API_BASE_URL}/designs/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  
  if (!response.ok) throw new Error('Failed to update design');
  
  const data = await response.json();
  return data.design;
}

/**
 * Delete design
 */
export async function deleteDesign(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/designs/${id}`, {
    method: 'DELETE',
  });
  
  if (!response.ok) throw new Error('Failed to delete design');
}

/**
 * Get designs by user
 */
export async function getDesignsByUser(userId: string): Promise<Design[]> {
  const response = await fetch(`${API_BASE_URL}/designs/user/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user designs');
  
  const data = await response.json();
  return data.designs;
}

/**
 * Generate design using AI
 */
export async function generateDesignWithAI(request: GenerateDesignRequest): Promise<GenerateDesignResponse> {
  const response = await fetch(`${API_BASE_URL}/ai/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(request),
  });
  
  if (!response.ok) throw new Error('Failed to generate design');
  
  return response.json();
}

/**
 * Enhance existing design with AI
 */
export async function enhanceDesign(designId: string, enhancementPrompt: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/ai/enhance/${designId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ enhancementPrompt }),
  });
  
  if (!response.ok) throw new Error('Failed to enhance design');
  
  return response.json();
}

/**
 * Get AI color suggestions
 */
export async function getColorSuggestions(prompt: string, count = 5): Promise<string[]> {
  const response = await fetch(`${API_BASE_URL}/ai/colors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ prompt, count }),
  });
  
  if (!response.ok) throw new Error('Failed to get color suggestions');
  
  const data = await response.json();
  return data.colors;
}

/**
 * Save current canvas state as design
 */
export async function saveCanvasAsDesign(
  title: string,
  designData: DesignData,
  userId = 'default-user',
  prompt = '',
  tags: string[] = []
): Promise<Design> {
  return createDesign({
    userId,
    title,
    prompt,
    designData,
    tags,
  });
}
