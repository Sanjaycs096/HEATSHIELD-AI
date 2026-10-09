export interface EnvironmentalSnapshot {
  location: string;
  timestamp: number;
  temperature: number;
  humidity: number;
  heatIndex?: number;
  windSpeed?: number;
  precipitation?: number;
  uvIndex?: number;
  pm25?: number;
  pm10?: number;
  aqi?: number;
  source: {
    provider: string;
    type: 'live' | 'fallback';
    fetchedAt: number;
    isLive: boolean;
    fallback: boolean;
  };
}

export interface HourlyCondition {
  timestamp: number;
  temperature: number;
  humidity: number;
  heatIndex?: number;
  aqi?: number;
  pm25?: number;
  uvIndex?: number;
}

export interface EnvironmentalDataService {
  getEnvironmentalSnapshot(location: string): Promise<EnvironmentalSnapshot>;
  getHourlyEnvironmentalData(location: string, startTime: number, endTime: number): Promise<HourlyCondition[]>;
}

// Deterministic fallback generator for testing and offline development
export class FallbackEnvironmentalProvider implements EnvironmentalDataService {
  async getEnvironmentalSnapshot(location: string): Promise<EnvironmentalSnapshot> {
    // Generate deterministic values based on location string length and char codes
    const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    return {
      location,
      timestamp: Date.now(),
      temperature: 30 + (seed % 10), // 30-39 C
      humidity: 40 + (seed % 40), // 40-79 %
      windSpeed: 5 + (seed % 15), // 5-19 km/h
      uvIndex: 4 + (seed % 6), // 4-9
      aqi: 50 + (seed % 100), // 50-149
      pm25: 15 + (seed % 40),
      source: {
        provider: 'FallbackDemoProvider',
        type: 'fallback',
        fetchedAt: Date.now(),
        isLive: false,
        fallback: true
      }
    };
  }

  async getHourlyEnvironmentalData(location: string, startTime: number, endTime: number): Promise<HourlyCondition[]> {
    const seed = location.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hours = [];
    
    let currentTime = startTime;
    let hourOffset = 0;
    
    while (currentTime <= endTime && hourOffset < 24) {
      // Simulate daytime temperature curve (peak around 2-3 PM)
      const date = new Date(currentTime);
      const hour = date.getHours();
      
      // Basic bell curve for temperature peaking at 14:00 (2 PM)
      const distanceFromPeak = Math.abs(14 - hour);
      const tempModifier = Math.max(0, 10 - distanceFromPeak);
      
      hours.push({
        timestamp: currentTime,
        temperature: 25 + tempModifier + (seed % 5),
        humidity: 60 - tempModifier * 2 + (seed % 10), // humidity drops as temp rises
        uvIndex: Math.max(0, 8 - distanceFromPeak) + (seed % 2),
        aqi: 50 + (seed % 50) + tempModifier * 2, // slightly worse AQI in heat
        pm25: 15 + (seed % 20) + tempModifier
      });
      
      currentTime += 60 * 60 * 1000; // +1 hour
      hourOffset++;
    }
    
    return hours;
  }
}

// Expose a configured instance
export const envService: EnvironmentalDataService = new FallbackEnvironmentalProvider();
