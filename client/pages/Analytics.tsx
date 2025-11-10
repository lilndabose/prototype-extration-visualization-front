import { useState, useMemo, useEffect } from "react";
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Layout } from "@/components/Layout";
import { useAnalytics } from "@/hooks/use-analytics";

interface AnalyticsData {
  scopeMetrics: { label: string; value: number; color: string }[];
  erisAttributes: { label: string; value: number }[];
  scoreTotal: number;
  stationData: { station: string; value: number }[];
}

const Analytics = () => {
  const { statistics, loading, getFilters, getStatistics } = useAnalytics();
  const [filters, setFilters] = useState({
    date: "2025-08-31",
    subZone: "",
    ace: "ACE 1",
    stationCode: "",
    stationName: "",
    managementMode: "CODO",
    segmentation: "S1",
  });

  useEffect(() => {
    getFilters();
    const filterParams: Record<string, string> = {
      date: filters.date,
    };
    if (filters.subZone) filterParams.sub_zone = filters.subZone;
    if (filters.ace) filterParams.affiliate = filters.ace;
    if (filters.stationCode) filterParams.station_code = filters.stationCode;
    if (filters.stationName) filterParams.station_name = filters.stationName;
    if (filters.managementMode) filterParams.management_mode = filters.managementMode;
    if (filters.segmentation) filterParams.segmentation = filters.segmentation;

    getStatistics(filterParams);
  }, [filters, getFilters, getStatistics]);

  // Family summary metrics (EP, ES, ET)
  const familyMetrics = [
    { label: "EP", value: 72, color: "#D32F2F" }, // Red - Average of 11 EP attributes
    { label: "ES", value: 79, color: "#FBC02D" }, // Yellow - Average of 9 ES attributes
    { label: "ET", value: 79, color: "#1976D2" }, // Blue - Average of 5 ET attributes
  ];

  // All 25 individual attributes for second chart
  const allAttributesData = [
    // EP Attributes (11) - Red
    { label: "EP01", value: 68, color: "#D32F2F" },
    { label: "EP02", value: 37, color: "#D32F2F" },
    { label: "EP03", value: 72, color: "#D32F2F" },
    { label: "EP04", value: 61, color: "#D32F2F" },
    { label: "EP05", value: 78, color: "#D32F2F" },
    { label: "EP06", value: 85, color: "#D32F2F" },
    { label: "EP07", value: 73, color: "#D32F2F" },
    { label: "EP08", value: 81, color: "#D32F2F" },
    { label: "EP09", value: 66, color: "#D32F2F" },
    { label: "EP10", value: 75, color: "#D32F2F" },
    { label: "EP11", value: 79, color: "#D32F2F" },
    // ES Attributes (9) - Yellow
    { label: "ES01", value: 74, color: "#FBC02D" },
    { label: "ES02", value: 69, color: "#FBC02D" },
    { label: "ES03", value: 82, color: "#FBC02D" },
    { label: "ES04", value: 98, color: "#FBC02D" },
    { label: "ES05", value: 71, color: "#FBC02D" },
    { label: "ES06", value: 76, color: "#FBC02D" },
    { label: "ES07", value: 65, color: "#FBC02D" },
    { label: "ES08", value: 88, color: "#FBC02D" },
    { label: "ES09", value: 64, color: "#FBC02D" },
    // ET Attributes (5) - Blue
    { label: "ET01", value: 79, color: "#1976D2" },
    { label: "ET02", value: 70, color: "#1976D2" },
    { label: "ET03", value: 83, color: "#1976D2" },
    { label: "ET04", value: 77, color: "#1976D2" },
    { label: "ET05", value: 86, color: "#1976D2" },
  ];

  // Mock analytics data as fallback
  const mockAnalyticsData: AnalyticsData = {
    scopeMetrics: familyMetrics,
    erisAttributes: [
      { label: "COCO", value: 75 },
      { label: "CODO", value: 68 },
      { label: "DODO", value: 82 },
    ],
    scoreTotal: 71.2,
    stationData: allAttributesData,
  };

  // Transform API response to analytics format
  const analyticsData: AnalyticsData = useMemo(() => {
    if (!statistics) return mockAnalyticsData;

    return {
      scopeMetrics: [
        { label: "EP", value: Math.round((statistics.ep?.total || 0) * 100), color: "#D32F2F" },
        { label: "ES", value: Math.round((statistics.es?.total || 0) * 100), color: "#FBC02D" },
        { label: "ET", value: Math.round((statistics.et?.total || 0) * 100), color: "#1976D2" },
      ],
      erisAttributes: [
        { label: "DODO", value: 22 },
        { label: "CODO", value: 20 },
        { label: "COCO", value: 56 },
      ],
      scoreTotal: statistics.total_score_mean || 66.0,
      stationData: statistics.station_code ? [
        { station: statistics.station_code, value: Math.round(statistics.total_score_mean * 100) || 66 },
      ] : mockAnalyticsData.stationData,
    };
  }, [statistics]);

  // Filter data based on selected filters
  const filteredData = useMemo(() => {
    let filtered = { ...analyticsData };

    if (filters.stationCode) {
      filtered.stationData = filtered.stationData.filter((d) => {
        const key = (d as any).label || (d as any).station;
        return key.toLowerCase().includes(filters.stationCode.toLowerCase());
      });
    }

    return filtered;
  }, [analyticsData, filters]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleReset = () => {
    setFilters({
      date: "2025-08-31",
      subZone: "",
      ace: "",
      stationCode: "",
      stationName: "",
      managementMode: "CODO",
      segmentation: "S1",
    });
  };

  const COLORS = ["#D32F2F", "#F57C00", "#FBC02D", "#388E3C"];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Analyse Graphique
            </h1>
            <p className="text-muted-foreground">Visualisez plus simplement vos KPI</p>
          </div>
          <button className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium whitespace-nowrap">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
              />
            </svg>
            <span>Exporter</span>
          </button>
        </div>

        {/* Summary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Stations Inspectées</p>
                <p className="text-3xl font-bold text-foreground">20</p>
              </div>
              <svg className="w-5 h-5 text-te-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5.217m0 0a9.01 9.01 0 00-5.218-3m5.218 3a9 9 0 010 18m-9-18h-.217m0 0a9.01 9.01 0 00-5.218 3m5.218-3h0" />
              </svg>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Score Moyen Global</p>
                <p className="text-3xl font-bold text-te-blue">71.2%</p>
              </div>
              <svg className="w-5 h-5 text-te-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Score Max</p>
                <p className="text-3xl font-bold text-te-red">98% (ES04)</p>
              </div>
              <svg className="w-5 h-5 text-te-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-muted-foreground text-sm mb-1">Score Min</p>
                <p className="text-3xl font-bold text-te-orange">37% (EP02)</p>
              </div>
              <svg className="w-5 h-5 text-te-orange" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4v.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Three Charts Aligned Horizontally */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Scope Par Famille Invariants - Family Metrics */}
              <div className="bg-card rounded-xl p-0 border border-border shadow-sm overflow-hidden">
                <h3 className="text-sm font-semibold text-foreground mb-1 px-6 pt-6">Scope Par Famille Invariants %</h3>
                <ResponsiveContainer width="100%" height={320}>
                  <BarChart
                    data={familyMetrics}
                    margin={{ top: 5, right: 10, left: 40, bottom: 50 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="label"
                      tick={{ fontSize: 12, fontWeight: "bold" }}
                    />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={48}>
                      {familyMetrics.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* ERIS Attributes */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <h3 className="text-sm font-semibold text-foreground mb-3">sCORE PAR MODE DE MANAGEMENT</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={filteredData.erisAttributes}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ label, value }) => `${label}: ${value}%`}
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {filteredData.erisAttributes.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Score Moyen Global */}
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm flex flex-col items-center justify-center">
                <h3 className="text-sm font-semibold text-foreground mb-3">Score Inv. Prioritaires</h3>
                <div style={{ position: "relative", height: "120px", width: "120px" }}>
                  <ResponsiveContainer width="100%" height={120}>
                      <PieChart>
                        <Pie
                          data={[
                            { name: "Score", value: filteredData.scoreTotal },
                            { name: "Remaining", value: 100 - filteredData.scoreTotal },
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={35}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          <Cell fill="#003f7f" />
                          <Cell fill="#e0e0e0" />
                        </Pie>
                      </PieChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-2xl font-bold text-te-blue mt-2">
                  {filteredData.scoreTotal.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">Score moyen</p>
              </div>
            </div>

            {/* Conformité par invariant % */}
            <div className="bg-card rounded-xl p-0 border border-border shadow-sm overflow-hidden">
              <h3 className="text-lg font-semibold text-foreground mb-1 px-6 pt-6">Conformité par invariant %</h3>
              <ResponsiveContainer width="100%" height={420}>
                <BarChart
                  data={allAttributesData}
                  margin={{ top: 20, right: 30, left: 0, bottom: 70 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="label"
                    angle={-45}
                    textAnchor="end"
                    height={100}
                    tick={{ fontSize: 11 }}
                    interval={0}
                  />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} barSize={23}>
                    {allAttributesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm sticky top-24">
              <h3 className="text-lg font-semibold text-foreground mb-6">Filters</h3>

              <div className="space-y-4">
                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Date</label>
                  <input
                    type="date"
                    value={filters.date}
                    onChange={(e) => handleFilterChange("date", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-background text-foreground"
                  />
                </div>

                {/* Sub Zone */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Sub Zone
                  </label>
                  <select
                    value={filters.subZone}
                    onChange={(e) => handleFilterChange("subZone", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-background text-foreground"
                  >
                    <option value="">Select Zone</option>
                    <option value="AFO">AFO</option>
                    <option value="NIG">NIG</option>
                    <option value="MOI">MOI</option>
                    <option value="ASNE">ASNE</option>
                  </select>
                </div>

                {/* ACE */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">ACE</label>
                  <select
                    value={filters.ace}
                    onChange={(e) => handleFilterChange("ace", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-background text-foreground"
                  >
                    <option value="">Select ACE</option>
                    <option value="ace-1">ACE 1</option>
                    <option value="ace-2">ACE 2</option>
                  </select>
                </div>

                {/* Station Code */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Station Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., E01"
                    value={filters.stationCode}
                    onChange={(e) => handleFilterChange("stationCode", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Station Name */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Station Name
                  </label>
                  <input
                    type="text"
                    placeholder="Station name"
                    value={filters.stationName}
                    onChange={(e) => handleFilterChange("stationName", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-background text-foreground placeholder:text-muted-foreground"
                  />
                </div>

                {/* Management Mode */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Management Mode
                  </label>
                  <select
                    value={filters.managementMode}
                    onChange={(e) => handleFilterChange("managementMode", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-background text-foreground"
                  >
                    <option value="CODO">CODO</option>
                    <option value="COCO">COCO</option>
                    <option value="DODO">DODO</option>
                  </select>
                </div>

                {/* Segmentation */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Segmentation
                  </label>
                  <select
                    value={filters.segmentation}
                    onChange={(e) => handleFilterChange("segmentation", e.target.value)}
                    className="w-full px-3 py-2 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-background text-foreground"
                  >
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                    <option value="S3">S4</option>
                  </select>
                </div>

                {/* Reset Button */}
                <button
                  onClick={handleReset}
                  className="w-full mt-6 px-4 py-2 bg-gradient-to-r from-te-red to-te-orange hover:shadow-lg text-white rounded-lg font-medium transition-all"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reference Example Section */}
        <div className="mt-12">
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="text-2xl font-bold text-foreground mb-2">Exemple concret de Rapport Complet</h2>
              <p className="text-muted-foreground">Voici un exemple complet de rapport d'analyse intégrant tous les graphiques disponibles</p>
            </div>
            <div className="p-6">
              <img
                src="https://cdn.builder.io/api/v1/image/assets%2F87d5dc682ccd44479e11bda69be135b5%2F67d233f1c6ae41ae8585017f4567fbf1?format=webp&width=800"
                alt="Rapport d'Analyse Complet"
                className="w-full rounded-lg border border-border shadow-sm hover:shadow-md transition-shadow"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
