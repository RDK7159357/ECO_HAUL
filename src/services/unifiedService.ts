/**
 * EcoHaul Integration Service - Spring Boot + n8n Compatible
 * Updated to work with both Spring Boot backend and n8n workflows
 */

import { Platform } from 'react-native';

// Configuration - n8n primary, Spring Boot for data and fallback
const INTEGRATION_CONFIG = {
  // n8n instance URL (PRIMARY - your main application logic)
  n8nUrl: Platform.select({
    ios: 'http://localhost:5678',
    android: 'http://10.0.2.2:5678', 
    web: 'http://localhost:5678',
    default: 'http://localhost:5678',
  }),
  
  // Spring Boot backend URL (SUPPORT - data source and fallback)
  springBootUrl: Platform.select({
    ios: 'http://localhost:8080',
    android: 'http://10.0.2.2:8080',
    web: 'http://localhost:8080',
    default: 'http://localhost:8080',
  }),
  
  // Use n8n as primary, Spring Boot for support
  useN8nPrimary: true,
  timeout: 30000,
  retries: 3,
};

// Types (same as before)
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
  experienceLevel?: 'beginner' | 'intermediate' | 'expert';
}

interface DisposalGuideResponse {
  success: boolean;
  guidance_provided: {
    preparation_steps: Array<{
      step: number;
      action: string;
      details: string;
      time_needed: string;
    }>;
    disposal_methods: Array<{
      method: string;
      suitability: string;
      instructions: string;
    }>;
    safety_warnings: string[];
    environmental_impact: {
      co2_saved: string;
      energy_saved: string;
      water_saved: string;
      points_earned: number;
    };
  };
  waste_type: string;
  user_level: string;
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
  motivational_message: string;
  error?: string;
}

/**
 * N8n-Primary HTTP Client with Spring Boot support
 */
class N8nPrimaryHttpClient {
  private static async makeRequest(
    endpoint: string,
    data: any,
    useN8nPrimary: boolean = INTEGRATION_CONFIG.useN8nPrimary,
    retryCount = 0
  ): Promise<any> {
    
    const baseUrl = useN8nPrimary ? INTEGRATION_CONFIG.n8nUrl : INTEGRATION_CONFIG.springBootUrl;
    const url = `${baseUrl}${endpoint}`;
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), INTEGRATION_CONFIG.timeout);

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
      console.error(`API Error (${endpoint}):`, error);

      // If n8n fails, try Spring Boot as fallback
      if (useN8nPrimary && retryCount === 0) {
        console.log('n8n failed, trying Spring Boot fallback...');
        return this.makeRequest(endpoint, data, false, retryCount + 1);
      }

      // Retry logic for same endpoint
      if (retryCount < INTEGRATION_CONFIG.retries) {
        console.log(`Retrying request to ${endpoint} (attempt ${retryCount + 1}/${INTEGRATION_CONFIG.retries})`);
        await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
        return this.makeRequest(endpoint, data, useN8nPrimary, retryCount + 1);
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  static async post(endpoint: string, data: any): Promise<any> {
    return this.makeRequest(endpoint, data);
  }

  /**
   * Get data from Spring Boot backend (for n8n workflows to use)
   */
  static async getSpringBootData(endpoint: string): Promise<any> {
    try {
      const url = `${INTEGRATION_CONFIG.springBootUrl}${endpoint}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Spring Boot data fetch error (${endpoint}):`, error);
      return null;
    }
  }
}

/**
 * EcoHaul Service - n8n Primary with Spring Boot Support
 * Your n8n workflows are the main application logic
 * Spring Boot provides data persistence and fallback functionality
 */
export class EcoHaulService {
  /**
   * Find nearby disposal centers for specific waste type
   * Primary: n8n workflow with adaptive logic
   * Fallback: Spring Boot with basic data
   */
  static async findDisposalCenters(
    request: DisposalCentersRequest
  ): Promise<DisposalCentersResponse> {
    const requestData = {
      ...request,
      radius: request.radius || 10,
      maxResults: request.maxResults || 5,
    };

    const response = await N8nPrimaryHttpClient.post('/webhook/disposal-centers', requestData);
    
    if (!response.success) {
      console.warn('n8n disposal center lookup failed, using fallback data');
      return this.fallbackDisposalCenters(request);
    }

    return response;
  }

  /**
   * Get detailed disposal guide for waste type
   * Primary: n8n workflow with adaptive recommendations
   * Fallback: Spring Boot with basic guidance
   */
  static async getDisposalGuide(
    request: DisposalGuideRequest
  ): Promise<DisposalGuideResponse> {
    const requestData = {
      ...request,
      experienceLevel: request.experienceLevel || 'beginner',
    };

    const response = await N8nPrimaryHttpClient.post('/webhook/disposal-guide-enhanced', requestData);
    
    if (!response.success) {
      console.warn('n8n disposal guide failed, using fallback guide');
      return this.fallbackDisposalGuide(request.wasteType);
    }

    return response;
  }

  /**
   * Track environmental impact of disposal action
   * Primary: n8n workflow with advanced calculations and gamification
   * Fallback: Spring Boot with basic impact tracking
   */
  static async trackImpact(
    request: ImpactTrackingRequest
  ): Promise<ImpactTrackingResponse> {
    const requestData = {
      ...request,
      timestamp: new Date().toISOString(),
    };

    const response = await N8nPrimaryHttpClient.post('/webhook/track-impact', requestData);
    
    if (!response.success) {
      console.warn('n8n impact tracking failed, using fallback calculation');
      return this.fallbackImpactTracking(request);
    }

    // Optionally persist impact data to Spring Boot for history
    this.persistImpactToSpringBoot(request, response);

    return response;
  }

  /**
   * Get user data from Spring Boot (for n8n workflows to use)
   */
  static async getUserData(userId: string): Promise<any> {
    return await N8nPrimaryHttpClient.getSpringBootData(`/api/users/${userId}`);
  }

  /**
   * Get disposal centers from Spring Boot (for n8n workflows to use)
   */
  static async getDisposalCentersData(): Promise<any> {
    return await N8nPrimaryHttpClient.getSpringBootData('/api/disposal/centers');
  }

  /**
   * Get waste records from Spring Boot (for n8n workflows to use)
   */
  static async getWasteHistoryData(userId: string): Promise<any> {
    return await N8nPrimaryHttpClient.getSpringBootData(`/api/waste-scanner/history/${userId}`);
  }

  /**
   * Persist impact data to Spring Boot for long-term storage
   */
  private static async persistImpactToSpringBoot(request: ImpactTrackingRequest, impactResult: any): Promise<void> {
    try {
      const persistData = {
        userId: request.userId,
        wasteType: request.wasteType,
        itemCount: request.itemCount,
        disposalMethod: request.disposalMethod,
        impactCalculated: impactResult.impact_calculated,
        timestamp: new Date().toISOString(),
      };

      await fetch(`${INTEGRATION_CONFIG.springBootUrl}/api/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(persistData),
      });
    } catch (error) {
      console.log('Failed to persist impact data to Spring Boot (non-critical):', error);
    }
  }

  /**
   * Health check for both services
   */
  static async healthCheck(): Promise<{ 
    n8n: { available: boolean; message: string };
    springBoot: { available: boolean; message: string };
    recommendation: string;
  }> {
    
    const checkService = async (baseUrl: string, serviceName: string) => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const healthEndpoint = serviceName === 'n8n' ? '/healthz' : '/actuator/health';
        const response = await fetch(`${baseUrl}${healthEndpoint}`, {
          method: 'GET',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        return {
          available: response.ok,
          message: response.ok ? `${serviceName} service is available` : `Service returned ${response.status}`,
        };
      } catch (error) {
        return {
          available: false,
          message: `${serviceName} service is not reachable`,
        };
      }
    };

    const n8nStatus = await checkService(INTEGRATION_CONFIG.n8nUrl, 'n8n');
    const springBootStatus = await checkService(INTEGRATION_CONFIG.springBootUrl, 'Spring Boot');

    let recommendation = 'Unknown status';
    if (n8nStatus.available && springBootStatus.available) {
      recommendation = 'n8n workflows active with Spring Boot data support - optimal performance';
    } else if (n8nStatus.available) {
      recommendation = 'n8n workflows active - full functionality available';
    } else if (springBootStatus.available) {
      recommendation = 'n8n unavailable, using Spring Boot fallback - basic functionality';
    } else {
      recommendation = 'Both services unavailable - using offline fallback data';
    }

    return {
      n8n: n8nStatus,
      springBoot: springBootStatus,
      recommendation,
    };
  }

  // Fallback methods (same as before but simplified)
  private static fallbackDisposalCenters(request: DisposalCentersRequest): DisposalCentersResponse {
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
      user_level: 'beginner',
      guidance_provided: {
        preparation_steps: [
          {
            step: 1,
            action: 'Clean the item',
            details: 'Remove any residue or contaminants',
            time_needed: '2-3 minutes',
          },
        ],
        disposal_methods: [
          {
            method: 'Local facility',
            suitability: 'Most items',
            instructions: 'Contact your local waste management facility',
          },
        ],
        safety_warnings: ['Handle with care', 'Check local guidelines'],
        environmental_impact: {
          co2_saved: '1.0 kg',
          energy_saved: '1000 BTU',
          water_saved: '0.5 L',
          points_earned: 10,
        },
      },
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
      motivational_message: 'Every action counts! Keep up the great work! 🌱',
    };
  }
}

// Export the unified service as the default
export default EcoHaulService;

// Keep the old name for backward compatibility
export const N8nService = EcoHaulService;

// Export configuration
export const IntegrationConfig = INTEGRATION_CONFIG;

// Export types
export type {
  DisposalCentersRequest,
  DisposalCentersResponse,
  DisposalGuideRequest,
  DisposalGuideResponse,
  ImpactTrackingRequest,
  ImpactTrackingResponse,
};
