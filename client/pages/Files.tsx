import { useState, useMemo } from "react";
import { Layout } from "@/components/Layout";
import { cn } from "@/lib/utils";
import { useFiles } from "@/hooks/use-files";

interface FileItem {
  id: string;
  name: string;
  path: string;
  type: string;
  size: string;
  rows: string;
  modified: string;
  date: string;
}

const allFiles: FileItem[] = [
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
  {
    id: "5",
    name: "Q3_Financial_Report.xlsx",
    path: "/rapports/2025/q3/",
    type: "Excel",
    size: "4.20 MB",
    rows: "~3,200 lignes",
    modified: "Il y a 5 jours",
    date: "26/09/2025 13:10",
  },
  {
    id: "6",
    name: "Supply_Chain_Metrics.csv",
    path: "/metriques/supply/",
    type: "CSV",
    size: "1.45 MB",
    rows: "~2,890 lignes",
    modified: "Il y a 1 semaine",
    date: "20/09/2025 10:30",
  },
  {
    id: "7",
    name: "Employee_Performance_H2.xlsx",
    path: "/rh/2025/",
    type: "Excel",
    size: "2.95 MB",
    rows: "~1,678 lignes",
    modified: "Il y a 2 semaines",
    date: "15/09/2025 09:45",
  },
  {
    id: "8",
    name: "Market_Analysis_Sept.pdf",
    path: "/analyses/marche/",
    type: "PDF",
    size: "3.50 MB",
    rows: "~180 pages",
    modified: "Il y a 10 jours",
    date: "12/09/2025 14:20",
  },
  {
    id: "9",
    name: "Regional_Sales_Data.csv",
    path: "/ventes/2025/",
    type: "CSV",
    size: "2.10 MB",
    rows: "~4,120 lignes",
    modified: "Il y a 2 semaines",
    date: "10/09/2025 11:00",
  },
  {
    id: "10",
    name: "Annual_Compliance_Report.xlsx",
    path: "/conformite/2025/",
    type: "Excel",
    size: "5.30 MB",
    rows: "~4,550 lignes",
    modified: "Il y a 3 semaines",
    date: "05/09/2025 16:15",
  },
];

export default function Files() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const { deleteFile, loading } = useFiles();

  const filteredFiles = useMemo(() => {
    let results = allFiles;

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
        if (filterType === "pdf") return file.type === "PDF";
        return true;
      });
    }

    // Sort
    if (sortBy === "recent") {
      results.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    } else if (sortBy === "old") {
      results.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Mes fichiers
          </h1>
          <p className="text-muted-foreground text-sm">
            Accédez à l'intégralité de vos fichiers de données
          </p>
        </div>

        {/* Header Actions */}
        <div className="flex gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-background hover:bg-muted transition-colors text-sm font-medium">
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
            <span>Télécharger</span>
          </button>
        </div>
      </div>

      {/* Files Section */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-b from-muted/30 to-transparent border-b border-border p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground"
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
                placeholder="Rechercher dans vos fichiers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-te-orange focus:ring-2 focus:ring-te-orange/10 transition-all"
              />
            </div>

            {/* Filter by type */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-te-orange transition-colors cursor-pointer"
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
              className="px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:border-te-orange transition-colors cursor-pointer"
            >
              <option value="recent">Plus récent</option>
              <option value="old">Plus ancien</option>
              <option value="name">Nom (A-Z)</option>
              <option value="size">Taille</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="px-6 py-4 bg-muted/20 border-b border-border flex gap-6 text-sm">
          <div>
            <span className="text-muted-foreground">Total: </span>
            <span className="font-semibold text-foreground">{allFiles.length} fichiers</span>
          </div>
          <div>
            <span className="text-muted-foreground">Résultats: </span>
            <span className="font-semibold text-foreground">{filteredFiles.length} fichier(s)</span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-gradient-to-b from-muted/20 to-transparent">
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fichier
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Taille
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Modifié
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-border hover:bg-muted/40 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-te-green/10 to-te-green/5 border border-te-green/20 flex items-center justify-center text-te-green">
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium text-sm text-foreground">
                          {file.name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {file.path}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-te-green/10 text-te-green border border-te-green/20">
                      {file.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {file.size}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {file.rows}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm">
                      <div className="font-medium text-foreground">
                        {file.modified}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {file.date}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex gap-2">
                      <button className="p-2 rounded-lg border border-border hover:bg-muted hover:border-te-orange transition-all text-muted-foreground hover:text-te-orange">
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
                      <button className="p-2 rounded-lg border border-border hover:bg-muted hover:border-te-orange transition-all text-muted-foreground hover:text-te-orange">
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
                      </button>
                      <button
                        onClick={() => deleteFile(parseInt(file.id))}
                        disabled={loading}
                        className="p-2 rounded-lg border border-border hover:bg-destructive/10 hover:border-destructive transition-all text-muted-foreground hover:text-destructive disabled:opacity-50"
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
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                      <div className="relative">
                        <button
                          onClick={() => setOpenMenuId(openMenuId === file.id ? null : file.id)}
                          className="p-2 rounded-lg border border-border hover:bg-muted hover:border-te-orange transition-all text-muted-foreground hover:text-te-orange"
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
                              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                            />
                          </svg>
                        </button>
                        {openMenuId === file.id && (
                          <div className="absolute right-0 mt-1 w-48 bg-popover border border-border rounded-lg shadow-md z-10">
                            <button
                              onClick={() => {
                                // Handle share action
                                console.log("Share file:", file.name);
                                setOpenMenuId(null);
                              }}
                              className="w-full text-left px-4 py-2 hover:bg-muted transition-colors flex items-center gap-2 text-sm"
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
                                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-6.148 6.148M15.716 13.342A9.004 9.004 0 0021 12a9.004 9.004 0 00-5.284-1.342m0 2.684a3 3 0 110-2.684"
                                />
                              </svg>
                              Partager
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty state */}
        {filteredFiles.length === 0 && (
          <div className="text-center py-12">
            <svg
              className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4"
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
            <p className="text-muted-foreground text-sm">
              Aucun fichier ne correspond à votre recherche
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}
