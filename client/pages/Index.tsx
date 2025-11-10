import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { cn } from "@/lib/utils";
import { useFiles } from "@/hooks/use-files";
import { FileUploadModal } from "@/components/FileUploadModal";

export default function Index() {
  const navigate = useNavigate();
  const { files, getFiles, uploadFile, deleteFile, loading } = useFiles();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [uploadModalOpen, setUploadModalOpen] = useState(false);

  useEffect(() => {
    getFiles();
  }, [getFiles]);

  // Mock data for when no files are uploaded yet
  const mockRecentFiles = [
    {
      id: "1",
      name: "ERIS_Report_Extract1_.xlsx",
      path: "/rapports/2025/septembre/",
      type: "Excel",
      size: "2.50 MB",
      rows: "~1,245 lignes",
      modified: "Il y a 2 heures",
      date: "15/09/2025 14:32",
    },
    {
      id: "2",
      name: "ERIS_Report_Extract_.xlsx",
      path: "/rapports/2025/septembre/",
      type: "Excel",
      size: "2.72 MB",
      rows: "~1,456 lignes",
      modified: "Il y a 1 jour",
      date: "30/09/2025 09:15",
    },
    {
      id: "3",
      name: "Energy_Analysis_2025.xlsx",
      path: "/analyses/2025/",
      type: "Excel",
      size: "3.15 MB",
      rows: "~2,100 lignes",
      modified: "Il y a 3 jours",
      date: "28/09/2025 11:45",
    },
    {
      id: "4",
      name: "Production_Data.csv",
      path: "/donnees/production/",
      type: "CSV",
      size: "1.85 MB",
      rows: "~5,432 lignes",
      modified: "Il y a 1 semaine",
      date: "22/09/2025 16:20",
    },
  ];

  const recentFiles = files.length > 0 ? files.map((file) => ({
    id: file.id.toString(),
    name: file.filename,
    path: "/",
    type: file.filetype,
    size: file.file_size,
    rows: "-",
    modified: new Date(file.upload_date).toLocaleDateString("fr-FR"),
    date: new Date(file.upload_date).toLocaleString("fr-FR"),
  })) : mockRecentFiles;

  const filteredFiles = useMemo(() => {
    let results = recentFiles;

    // Filter by search query
    if (searchQuery) {
      results = results.filter((file) =>
        file.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by type
    if (filterType !== "all") {
      results = results.filter((file) => {
        if (filterType === "excel") return file.type === "Excel";
        if (filterType === "csv") return file.type === "CSV";
        return true;
      });
    }

    // Sort
    if (sortBy === "recent") {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "name") {
      results.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "size") {
      results.sort((a, b) => parseFloat(b.size) - parseFloat(a.size));
    }

    return results;
  }, [searchQuery, filterType, sortBy]);

  return (
    <Layout>
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6 md:mb-8">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-foreground mb-1 md:mb-2">
            Tableau de bord
          </h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            {recentFiles.length > 0
              ? `Vos ${recentFiles.length} fichiers`
              : "Aucun fichier pour le moment"}
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex gap-2 md:gap-3 w-full md:w-auto">
          <button
            onClick={() => setUploadModalOpen(true)}
            disabled={loading}
            className="flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl border border-border bg-background hover:bg-muted transition-colors text-xs md:text-sm font-medium disabled:opacity-50"
          >
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
                d="M12 4v16m8-8H4"
              />
            </svg>
            <span className="hidden sm:inline">Uploader</span>
            <span className="sm:hidden">Partager</span>
          </button>
          <button onClick={() => navigate("/analytics")} className="flex-1 md:flex-none flex items-center justify-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-te-red to-te-orange text-white hover:shadow-lg transition-all text-xs md:text-sm font-medium">
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
                d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
              />
            </svg>
            <span className="hidden sm:inline">Visualiser</span>
            <span className="sm:hidden">Voir</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-6 md:mb-8">
        <StatCard
          label="Fichiers actifs"
          value="12"
          icon="📁"
          trend="↑ 8%"
          trendType="up"
        />
        <StatCard
          label="Espace utilisé"
          value="48.7 MB"
          icon="💾"
          trend="↑ 15%"
          trendType="up"
        />
        <StatCard
          label="Dernière mise à jour"
          value="Aujourd'hui"
          icon="🕐"
          trend="2 nouveaux fichiers"
          trendType="up"
        />
        <StatCard
          label="Collaborateurs"
          value="5"
          icon="👥"
          trend="↑ 2 cette semaine"
          trendType="up"
        />
      </div>

      {/* Files Section */}
      <div className="bg-card rounded-xl md:rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-b from-muted/30 to-transparent border-b border-border p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-2 sm:gap-3 md:gap-4">
            {/* Search */}
            <div className="w-full relative">
              <svg
                className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 sm:pl-10 pr-3 sm:pr-4 py-1.5 sm:py-2 md:py-2.5 bg-background border border-border rounded-lg md:rounded-xl text-xs sm:text-sm focus:outline-none focus:border-te-orange focus:ring-2 focus:ring-te-orange/10 transition-all"
              />
            </div>

            {/* Filters row */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 md:gap-3">
              {/* Filter by type */}
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-background border border-border rounded-lg md:rounded-xl text-xs sm:text-sm focus:outline-none focus:border-te-orange transition-colors cursor-pointer"
              >
                <option value="all">Tous les types</option>
                <option value="excel">Excel (.xlsx)</option>
                <option value="csv">CSV (.csv)</option>
                <option value="pdf">PDF (.pdf)</option>
              </select>

              {/* Sort by */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-2.5 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 bg-background border border-border rounded-lg md:rounded-xl text-xs sm:text-sm focus:outline-none focus:border-te-orange transition-colors cursor-pointer"
              >
                <option value="recent">Plus récent</option>
                <option value="old">Plus ancien</option>
                <option value="name">Nom (A-Z)</option>
                <option value="size">Taille</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gradient-to-b from-muted/20 to-transparent">
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fichier
                </th>
                <th className="hidden sm:table-cell px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Taille
                </th>
                <th className="hidden md:table-cell px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Modifié
                </th>
                <th className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.slice(0, 4).map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-border hover:bg-muted/40 transition-colors"
                >
                  <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-lg bg-gradient-to-br from-te-green/10 to-te-green/5 border border-te-green/20 flex items-center justify-center text-te-green flex-shrink-0">
                        <svg
                          className="w-4 sm:w-5 h-4 sm:h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-xs sm:text-sm text-foreground truncate">
                          {file.name}
                        </div>
                        <div className="text-xs text-muted-foreground hidden sm:block truncate">
                          {file.path}
                        </div>
                        <div className="text-xs text-muted-foreground sm:hidden">
                          {file.size}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-3 md:px-6 py-2 sm:py-3 md:py-4">
                    <span className="inline-flex items-center px-2 md:px-3 py-0.5 md:py-1 rounded-lg text-xs font-semibold bg-te-green/10 text-te-green border border-te-green/20">
                      {file.type}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {file.size}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {file.rows}
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {file.modified}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {file.date}
                      </div>
                    </div>
                  </td>
                  <td className="px-2 sm:px-3 md:px-6 py-2 sm:py-3 md:py-4">
                    <div className="flex gap-0.5 sm:gap-1 md:gap-2">
                      <button className="p-1 sm:p-1.5 md:p-2 rounded-lg border border-border hover:bg-muted hover:border-te-orange transition-all text-muted-foreground hover:text-te-orange">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                      <button className="p-1 sm:p-1.5 md:p-2 rounded-lg border border-border hover:bg-muted hover:border-te-orange transition-all text-muted-foreground hover:text-te-orange">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
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
                      </button>
                      <button
                        onClick={() => deleteFile(file.id)}
                        disabled={loading}
                        className="p-1 sm:p-1.5 md:p-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive transition-all text-muted-foreground hover:text-destructive disabled:opacity-50 hidden sm:inline-flex">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <button className="p-1 sm:p-1.5 md:p-2 rounded-lg border border-border hover:bg-muted hover:border-te-orange transition-all text-muted-foreground hover:text-te-orange hidden sm:inline-flex">
                        <svg
                          className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                          />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-8 md:py-12">
            <svg
              className="w-8 md:w-12 h-8 md:h-12 mx-auto text-muted-foreground/30 mb-2 md:mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
              />
            </svg>
            <p className="text-muted-foreground text-xs md:text-sm">
              Aucun fichier ne correspond à votre recherche
            </p>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setUploadModalOpen(true)}
        disabled={loading}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 w-12 md:w-14 h-12 md:h-14 rounded-full md:rounded-2xl bg-gradient-to-r from-te-red to-te-orange text-white shadow-lg hover:shadow-xl hover:scale-110 transition-all flex items-center justify-center disabled:opacity-50"
      >
        <svg className="w-5 md:w-6 h-5 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* File Upload Modal */}
      <FileUploadModal
        open={uploadModalOpen}
        onOpenChange={setUploadModalOpen}
        onUpload={uploadFile}
        loading={loading}
      />
    </Layout>
  );
}

function StatCard({
  label,
  value,
  icon,
  trend,
  trendType,
}: {
  label: string;
  value: string;
  icon: string;
  trend: string;
  trendType: "up" | "down";
}) {
  return (
    <div className="bg-card rounded-xl md:rounded-2xl border border-border p-3 md:p-6 hover:border-te-orange/50 transition-all hover:shadow-md group relative">
      {/* Top border accent */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-te-red to-te-orange rounded-t-xl md:rounded-t-2xl scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />

      <div className="flex justify-between items-start mb-3 md:mb-4">
        <div>
          <div className="text-xl md:text-3xl font-bold text-foreground mb-0.5 md:mb-1">{value}</div>
          <div className="text-xs md:text-sm text-muted-foreground">{label}</div>
        </div>
        <div className="text-xl md:text-2xl">{icon}</div>
      </div>

      <div
        className={cn(
          "inline-flex items-center gap-0.5 md:gap-1 text-xs font-semibold px-2 md:px-2.5 py-1 md:py-1.5 rounded-lg",
          trendType === "up"
            ? "bg-te-green/10 text-te-green"
            : "bg-te-red/10 text-te-red"
        )}
      >
        <span>{trendType === "up" ? "↑" : "↓"}</span>
        <span className="text-xs">{trend}</span>
      </div>
    </div>
  );
}
