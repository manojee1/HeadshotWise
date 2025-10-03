const API_BASE_URL = 'http://localhost:3001/api/headshot';

export interface HeadshotResponse {
  success: boolean;
  data?: {
    originalImage: string;
    generatedImage: string;
    style: string;
    processingTime: number;
  };
  error?: string;
}

export interface HealthResponse {
  success: boolean;
  data: {
    status: string;
    timestamp: string;
    apiConnected: boolean;
  };
}

export interface Style {
  id: string;
  name: string;
  description: string;
}

export interface StylesResponse {
  success: boolean;
  data: {
    styles: Style[];
  };
}

export class ApiService {
  private static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    };

    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  static async checkHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health');
  }

  static async getStyles(): Promise<StylesResponse> {
    return this.request<StylesResponse>('/styles');
  }

  static async generateHeadshot(file: File, style: string): Promise<HeadshotResponse> {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('style', style);

    return this.request<HeadshotResponse>('/generate', {
      method: 'POST',
      headers: {}, // Remove Content-Type header to let browser set it with boundary for FormData
      body: formData,
    });
  }
}

export default ApiService;
