import { useState, useCallback } from 'react';
import { analyticsAPI } from '@/services/api';

// Fallback mock data
const mockFilters: FilterOptions = {
  files_creation_date: ["2025-07-01", "2025-08-15", "2025-09-01", "2025-09-15"],
  station_code: ["STA001", "STA002", "STA003"],
  station_name: ["Station A", "Station B", "Station C"],
};

const mockStatistics: StatisticsData = {
  date: "2025-09-01",
  zone: "AFA",
  sub_zone: "AFA",
  station_code: "STA001",
  station_name: "Station A",
  affiliate: "Congo",
  total_records: "1245",
  total_score_mean: 85.5,
  ep: {
    EP01: 88.5, EP02: 87.3, EP03: 89.1, EP04: 86.7, EP05: 87.9,
    EP06: 88.2, EP07: 87.5, EP08: 89.3, EP09: 86.8, EP10: 88.1, EP11: 87.6
  },
  es: {
    ES01: 82.4, ES02: 84.1, ES03: 83.7, ES04: 85.2, ES05: 82.9,
    ES06: 84.3, ES07: 83.5, ES08: 85.8, ES09: 82.6
  },
  et: {
    ET01: 78.5, ET02: 79.3, ET03: 77.8, ET04: 80.1, ET05: 78.9
  },
};

export interface FilterOptions {
  files_creation_date: string[];
  station_code: string[];
  station_name: string[];
}

export interface StatisticsData {
  date: string;
  zone: string;
  sub_zone: string;
  station_code: string;
  station_name: string;
  affiliate: string;
  total_records: string;
  total_score_mean: number;
  ep: Record<string, number>;
  es: Record<string, number>;
  et: Record<string, number>;
}

interface UseAnalyticsResult {
  filters: FilterOptions | null;
  statistics: StatisticsData | null;
  loading: boolean;
  error: string | null;
  getFilters: () => Promise<void>;
  getStatistics: (filterParams: Record<string, string>) => Promise<void>;
  refetch: () => Promise<void>;
}


export const useAnalytics = (): UseAnalyticsResult => {
  const [filters, setFilters] = useState<FilterOptions | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFilters = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsAPI.getFilters();
      setFilters(response.data);
    } catch (err) {
      // Fallback to mock data if API is unavailable
      console.log("API unavailable, using mock filters data");
      setFilters(mockFilters);
    } finally {
      setLoading(false);
    }
  }, []);

  const getStatistics = useCallback(async (filterParams: Record<string, string>) => {
    setLoading(true);
    setError(null);

    try {
      const response = await analyticsAPI.getStatistics(filterParams as any);
      setStatistics(response.data);
    } catch (err) {
      // Fallback to mock data if API is unavailable
      console.log("API unavailable, using mock statistics data");
      const updatedStats = { ...mockStatistics };
      if (filterParams.date) updatedStats.date = filterParams.date;
      if (filterParams.sub_zone) updatedStats.sub_zone = filterParams.sub_zone;
      if (filterParams.affiliate) updatedStats.affiliate = filterParams.affiliate;
      setStatistics(updatedStats);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await getFilters();
  }, [getFilters]);

  return {
    filters,
    statistics,
    loading,
    error,
    getFilters,
    getStatistics,
    refetch,
  };
};
