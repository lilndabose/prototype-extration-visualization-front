import { useState, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import Navbar from '../components/Navbar';

ChartJS.register(CategoryScale, LinearScale, BarController, BarElement, Tooltip, Legend, ArcElement, ChartDataLabels);

interface AnalyticsData {
  scopeMetrics: { label: string; value: number; color: string }[];
  erisAttributes: { label: string; value: number }[];
  scoreTotal: number;
  stationData: { station: string; value: number }[];
  filters: {
    date: string;
    subZone: string;
    ace: string;
    stationCode: string;
    stationName: string;
    managementMode: string;
    segmentation: string;
  };
}

const Analytics = () => {
  const [filters, setFilters] = useState({
    date: '2025-08-31',
    subZone: '',
    ace: '',
    stationCode: '',
    stationName: '',
    managementMode: 'CODO',
    segmentation: 'S1',
  });

  // Mock analytics data - Replace with actual data from file analysis
  const mockAnalyticsData: AnalyticsData = {
    scopeMetrics: [
      { label: 'EP', value: 67, color: '#ED1C24' },
      { label: 'ES', value: 69, color: '#FFB700' },
      { label: 'ET', value: 81, color: '#003f7f' },
    ],
    erisAttributes: [
      { label: 'Energy', value: 75 },
      { label: 'Safety', value: 68 },
      { label: 'Reliability', value: 82 },
      { label: 'Efficiency', value: 71 },
    ],
    scoreTotal: 66.00,
    stationData: [
      { station: 'E01', value: 61 },
      { station: 'E02', value: 37 },
      { station: 'E03', value: 54 },
      { station: 'E04', value: 56 },
      { station: 'E05', value: 65 },
      { station: 'E06', value: 78 },
      { station: 'E07', value: 73 },
      { station: 'E08', value: 76 },
      { station: 'E09', value: 78 },
      { station: 'E10', value: 73 },
      { station: 'E11', value: 78 },
      { station: 'E12', value: 82 },
      { station: 'E03', value: 43 },
      { station: 'E04', value: 42 },
      { station: 'E05', value: 95 },
      { station: 'E06', value: 88 },
      { station: 'E07', value: 93 },
      { station: 'E08', value: 98 },
      { station: 'E09', value: 78 },
      { station: 'E10', value: 71 },
    ],
    filters,
  };

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = { ...mockAnalyticsData };

    if (filters.stationCode) {
      filtered.stationData = filtered.stationData.filter(
        (d) => d.station.toLowerCase().includes(filters.stationCode.toLowerCase())
      );
    }

    return filtered;
  }, [filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      date: '2025-08-31',
      subZone: '',
      ace: '',
      stationCode: '',
      stationName: '',
      managementMode: 'CODO',
      segmentation: 'S1',
    });
  };

  // Scope Metrics Chart (3 colored bars)
  const scopeChartData = {
    labels: filteredData.scopeMetrics.map((m) => m.label),
    datasets: [
      {
        label: 'Scope Par Famille Invariants %',
        data: filteredData.scopeMetrics.map((m) => m.value),
        backgroundColor: filteredData.scopeMetrics.map((m) => m.color),
        borderRadius: 8,
        barThickness: 60,
      },
    ],
  };

  // ERIS Attributes Doughnut Chart
  const erisChartData = {
    labels: filteredData.erisAttributes.map((a) => a.label),
    datasets: [
      {
        data: filteredData.erisAttributes.map((a) => a.value),
        backgroundColor: ['#FF6B35', '#FFB700', '#00A650', '#003f7f'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Score Total Gauge Chart
  const scoreChartData = {
    labels: ['Score', 'Remaining'],
    datasets: [
      {
        data: [filteredData.scoreTotal, 100 - filteredData.scoreTotal],
        backgroundColor: ['#003f7f', '#e0e0e0'],
        borderColor: '#fff',
        borderWidth: 2,
      },
    ],
  };

  // Station Performance Bar Chart
  const stationChartData = {
    labels: filteredData.stationData.map((s) => s.station),
    datasets: [
      {
        label: 'Station Performance',
        data: filteredData.stationData.map((s) => s.value),
        backgroundColor: (context: any) => {
          const value = context.raw;
          if (value >= 80) return '#ED1C24';
          if (value >= 60) return '#FFB700';
          return '#003f7f';
        },
        borderRadius: 4,
        barThickness: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      datalabels: {
        display: true,
        color: '#000',
        font: { weight: 'bold' as const, size: 12 },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Data Intelligence Analytics</h1>
          <p className="text-gray-600">Analyze and visualize your energy data insights</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Top Section - Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Scope Metrics */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Scope Par Famille Invariants %</h3>
                <div style={{ position: 'relative', height: '200px' }}>
                  <Bar data={scopeChartData} options={chartOptions} />
                </div>
              </div>

              {/* ERIS Attribute */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Attribute ERIS</h3>
                <div style={{ position: 'relative', height: '200px' }}>
                  <Doughnut
                    data={erisChartData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: true,
                      plugins: {
                        legend: {
                          position: 'bottom' as const,
                          labels: { font: { size: 11 } },
                        },
                        datalabels: {
                          display: true,
                          color: '#fff',
                          font: { weight: 'bold' as const, size: 12 },
                        },
                      },
                    }}
                  />
                </div>
              </div>

              {/* Score Total */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Score Total %</h3>
                <div className="flex flex-col items-center justify-center h-full">
                  <div style={{ position: 'relative', height: '150px', width: '150px' }}>
                    <Doughnut
                      data={scoreChartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        plugins: {
                          legend: { display: false },
                          datalabels: { display: false },
                        },
                      }}
                    />
                  </div>
                  <p className="text-3xl font-bold text-blue-600 mt-4">{filteredData.scoreTotal.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">out of 100</p>
                </div>
              </div>
            </div>

            {/* Station Performance Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Station Performance</h3>
              <div style={{ position: 'relative', height: '300px' }}>
                <Bar
                  data={stationChartData}
                  options={{
                    ...chartOptions,
                    indexAxis: 'x' as const,
                    scales: {
                      y: {
                        beginAtZero: true,
                        max: 100,
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>

          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Filters</h3>

              <div className="space-y-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Sub Zone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub Zone</label>
                  <select
                    value={filters.subZone}
                    onChange={(e) => handleFilterChange('subZone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select Zone</option>
                    <option value="zone-a">Zone A</option>
                    <option value="zone-b">Zone B</option>
                    <option value="zone-c">Zone C</option>
                  </select>
                </div>

                {/* ACE */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ACE</label>
                  <select
                    value={filters.ace}
                    onChange={(e) => handleFilterChange('ace', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Select ACE</option>
                    <option value="ace-1">ACE 1</option>
                    <option value="ace-2">ACE 2</option>
                  </select>
                </div>

                {/* Station Code */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Station Code</label>
                  <input
                    type="text"
                    placeholder="e.g., E01"
                    value={filters.stationCode}
                    onChange={(e) => handleFilterChange('stationCode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Station Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Station Name</label>
                  <input
                    type="text"
                    placeholder="Station name"
                    value={filters.stationName}
                    onChange={(e) => handleFilterChange('stationName', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* Management Mode */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Management Mode</label>
                  <select
                    value={filters.managementMode}
                    onChange={(e) => handleFilterChange('managementMode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="CODO">CODO</option>
                    <option value="SCADA">SCADA</option>
                    <option value="Manual">Manual</option>
                  </select>
                </div>

                {/* Segmentation */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Segmentation</label>
                  <select
                    value={filters.segmentation}
                    onChange={(e) => handleFilterChange('segmentation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full mt-6 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
