/**
 * EcoHaul n8n Integration Service
 * Connects React Native app with self-hosted n8n workflows
 * 
 * Note: Waste detection is handled by AdaptiveUniversalDetector.js
 * This service manages disposal centers, guides, and impact tracking
 */

import { Platform } from 'react-native';

// Configuration
const N8N_CONFIG = {
  // For development - change this to your actual n8n instance URL
  baseUrl: Platform.select({
    ios: 'http://localhost:5678', // iOS Simulator can access localhost
    android: 'http://10.0.2.2:5678', // Android Emulator localhost mapping
    web: 'http://localhost:5678', // Web development
    default: 'http://localhost:5678',
  }),
  timeout: 30000, // 30 seconds
  retries: 3,
};

// Types - Waste detection handled by AdaptiveUniversalDetector.js
interface DisposalCentersRequest {
  latitude: number;
  longitude: number;
  wasteType: string;
  radius?: number;
  maxResults?: number;
}

interface DisposalCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  acceptedWaste: string[];
  hours: string;
  rating: number;
  phone?: string;
  googleMapsUrl: string;
}

interface DisposalCentersResponse {
  success: boolean;
  centers: DisposalCenter[];
  totalFound: number;
  searchRadius: number;
  error?: string;
}

interface DisposalGuideRequest {
  wasteType: string;
  itemDescription?: string;
  userLevel?: 'beginner' | 'intermediate' | 'expert';
}

interface DisposalGuideResponse {
  success: boolean;
  waste_type: string;
  guide: {
    title: string;
    preparation_steps: Array<{
      step: number;
      action: string;
      details: string;
      time_needed: string;
      tools_needed: string[];
    }>;
    safety_warnings: string[];
    disposal_methods: Array<{
      method: string;
      suitability: string;
      instructions: string;
    }>;
    environmental_impact: {
      co2_saved: string;
      energy_saved: string;
      landfill_diversion: string;
      water_saved: string;
    };
    points_earned: number;
    common_mistakes: string[];
    pro_tips: string[];
  };
  estimated_time: {
    preparation: number;
    total_process: string;
  };
  quick_checklist: string[];
  error?: string;
}

interface ImpactTrackingRequest {
  userId: string;
  wasteType: string;
  itemCount: number;
  disposalMethod: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

interface ImpactTrackingResponse {
  success: boolean;
  impact_calculated: {
    co2_reduced: string;
    energy_saved: string;
    water_saved: string;
    landfill_diverted: string;
    points_earned: string;
  };
  achievements: Array<{
    id: string;
    title: string;
    description: string;
    badge_emoji: string;
    first_time: boolean;
  }>;
  insights: Array<{
    type: string;
    message: string;
    icon: string;
  }>;
  projections: {
    monthly: object;
    yearly: object;
  };
  efficiency_rating: {
    current_action: number;
    waste_type_efficiency: number;
    overall_score: number;
  };
  motivational_message: string;
  next_level_progress: {
    current_points: number;
    next_milestone: number;
    progress_percentage: number;
  };
  error?: string;
}

/**
 * HTTP Client with retry logic and error handling
 */
class N8nHttpClient {
  private static async makeRequest(
    endpoint: string,
    data: any,
    retryCount = 0
  ): Promise<any> {
    const url = `${N8N_CONFIG.baseUrl}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), N8N_CONFIG.timeout);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      console.error(`N8n API Error (${endpoint}):`, error);

      // Retry logic
      if (retryCount < N8N_CONFIG.retries) {
        console.log(`Retrying request to ${endpoint} (attempt ${retryCount + 1}/${N8N_CONFIG.retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1))); // Exponential backoff
        return this.makeRequest(endpoint, data, retryCount + 1);
      }

      // Return error response format
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async post(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(endpoint, data);
  }
}

/**
 * EcoHaul n8n Service
 * Main service class for interacting with n8n workflows
 * 
 * Note: Waste detection is handled by AdaptiveUniversalDetector.js for optimal performance
 */
export class N8nService {
  /**
   * Find nearby disposal centers for specific waste type
   */
  static async findDisposalCenters(
    request: DisposalCentersRequest
  ): Promise<DisposalCentersResponse> {
    const requestData = {
      ...request,
      radius: request.radius || 10,
      maxResults: request.maxResults || 5,
    };

    const response = await N8nHttpClient.post('/webhook/disposal-centers', requestData);
    
    if (!response.success) {
      console.warn('Disposal center lookup failed, using fallback data');
      return this.fallbackDisposalCenters(request);
    }

    return response;
  }

  /**
   * Get detailed disposal guide for waste type
   */
  static async getDisposalGuide(
    request: DisposalGuideRequest
  ): Promise<DisposalGuideResponse> {
    const requestData = {
      ...request,
      userLevel: request.userLevel || 'beginner',
    };

    const response = await N8nHttpClient.post('/webhook/disposal-guide-enhanced', requestData);
    
    if (!response.success) {
      console.warn('Disposal guide failed, using fallback guide');
      return this.fallbackDisposalGuide(request.wasteType);
    }

    return response;
  }

  /**
   * Track environmental impact of disposal action
   */
  static async trackImpact(
    request: ImpactTrackingRequest
  ): Promise<ImpactTrackingResponse> {
    const requestData = {
      ...request,
      timestamp: new Date().toISOString(),
    };

    const response = await N8nHttpClient.post('/webhook/track-impact', requestData);
    
    if (!response.success) {
      console.warn('Impact tracking failed, using fallback calculation');
      return this.fallbackImpactTracking(request);
    }

    return response;
  }

  /**
   * Check if n8n service is available
   */
  static async healthCheck(): Promise<{ available: boolean; message: string }> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`${N8N_CONFIG.baseUrl}/healthz`, {
        method: 'GET',
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      return {
        available: response.ok,
        message: response.ok ? 'n8n service is available' : `Service returned ${response.status}`,
      };
    } catch (error) {
      return {
        available: false,
        message: 'n8n service is not reachable',
      };
    }
  }

  // Fallback methods for offline/error scenarios
  // Note: Waste detection fallback removed - handled by AdaptiveUniversalDetector.js

  private static fallbackDisposalCenters(request: DisposalCentersRequest): DisposalCentersResponse {
    // Mock data for fallback
    const mockCenters: DisposalCenter[] = [
      {
        id: 'fallback-1',
        name: 'Local Recycling Center',
        address: 'Check your local municipal website',
        distance: 0,
        acceptedWaste: ['all'],
        hours: 'Contact for hours',
        rating: 4.0,
        googleMapsUrl: 'https://maps.google.com/',
      },
    ];

    return {
      success: true,
      centers: mockCenters,
      totalFound: 1,
      searchRadius: request.radius || 10,
    };
  }

  private static fallbackDisposalGuide(wasteType: string): DisposalGuideResponse {
    return {
      success: true,
      waste_type: wasteType,
      guide: {
        title: `${wasteType} Disposal Guide`,
        preparation_steps: [
          {
            step: 1,
            action: 'Clean the item',
            details: 'Remove any residue or contaminants',
            time_needed: '2-3 minutes',
            tools_needed: ['water', 'cleaning supplies'],
          },
        ],
        safety_warnings: ['Handle with care', 'Check local guidelines'],
        disposal_methods: [
          {
            method: 'Local facility',
            suitability: 'Most items',
            instructions: 'Contact your local waste management facility',
          },
        ],
        environmental_impact: {
          co2_saved: '1.0 kg',
          energy_saved: '1000 BTU',
          landfill_diversion: '100%',
          water_saved: '0.5 L',
        },
        points_earned: 10,
        common_mistakes: ['Improper cleaning', 'Wrong disposal method'],
        pro_tips: ['Check local guidelines', 'Consider reuse options'],
      },
      estimated_time: {
        preparation: 5,
        total_process: '10-15 minutes',
      },
      quick_checklist: ['Item cleaned?', 'Disposal method confirmed?'],
    };
  }

  private static fallbackImpactTracking(request: ImpactTrackingRequest): ImpactTrackingResponse {
    const baseImpact = {
      co2_reduced: (request.itemCount * 1.5).toFixed(1),
      energy_saved: (request.itemCount * 1000).toString(),
      water_saved: (request.itemCount * 0.5).toFixed(1),
      landfill_diverted: (request.itemCount * 0.2).toFixed(1),
      points_earned: (request.itemCount * 10).toString(),
    };

    return {
      success: true,
      impact_calculated: baseImpact,
      achievements: [
        {
          id: 'eco_action',
          title: 'Eco Action',
          description: 'Made an environmental impact!',
          badge_emoji: '🌱',
          first_time: false,
        },
      ],
      insights: [
        {
          type: 'impact',
          message: `Great job! You've made a positive environmental impact.`,
          icon: '🌍',
        },
      ],
      projections: {
        monthly: {},
        yearly: {},
      },
      efficiency_rating: {
        current_action: 80,
        waste_type_efficiency: 85,
        overall_score: 82,
      },
      motivational_message: 'Every action counts! Keep up the great work! 🌱',
      next_level_progress: {
        current_points: parseInt(baseImpact.points_earned),
        next_milestone: 100,
        progress_percentage: 50,
      },
    };
  }
}

// Export configuration for advanced users
export const N8nConfig = N8N_CONFIG;

// Export types for TypeScript users
// Note: Waste detection types removed - handled by AdaptiveUniversalDetector.js
export type {
  DisposalCentersRequest,
  DisposalCentersResponse,
  DisposalGuideRequest,
  DisposalGuideResponse,
  ImpactTrackingRequest,
  ImpactTrackingResponse,
};
