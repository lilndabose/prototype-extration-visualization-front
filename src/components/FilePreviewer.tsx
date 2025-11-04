import { useEffect, useState } from "react";
import Papa from "papaparse";
import * as XLSX from "xlsx";

export default function FilePreviewer({ file }: { file?: string }) {
  const [fileData, setFileData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const getFileExtension = (filename: string) => {
    return filename.split('.').pop()?.toLowerCase() || '';
  };

  const readFileContent = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setFileData([]);

    try {
      const fileExt = getFileExtension(file);

      if (fileExt === 'csv') {
        Papa.parse(file, {
          download: true,
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setFileData(results.data);
            setLoading(false);
          },
          error: (err) => {
            setError(`Erreur lors de l'analyse du CSV : ${err.message}`);
            setLoading(false);
          }
        });
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        // Handle Excel files with SheetJS
        const response = await fetch(file);
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        setFileData(jsonData);
        setLoading(false);
      } else {
        setError("Format de fichier non pris en charge. Veuillez télécharger un fichier CSV ou XLSX.");
        setLoading(false);
      }
    } catch (err) {
      setError(`Erreur lors de la lecture du fichier : ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      setLoading(false);
    }
  };

  useEffect(() => {
    readFileContent();
  }, [file]);

  if (!file) {
    return <div className="p-4 text-gray-500">Aucun fichier sélectionné</div>;
  }

  if (loading) {
    return <div className="p-4 text-blue-600">Chargement du fichier...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-600">{error}</div>;
  }

  if (fileData.length === 0) {
    return <div className="p-4 text-gray-500">Aucune donnée à afficher</div>;
  }

  return (
    <div className="p-4">
      <div className="mb-2 text-sm text-gray-600">
        Affichage de {fileData.length} lignes
      </div>
      
      <div className="mt-4 overflow-x-auto border rounded-lg">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              {Object.keys(fileData[0]).map((header, idx) => (
                <th 
                  key={idx} 
                  className="border-b border-r border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {fileData.map((row, i) => (
              <tr key={i} className="hover:bg-gray-50">
                {Object.values(row).map((val, j) => (
                  <td 
                    key={j} 
                    className="border-b border-r border-gray-200 px-4 py-2 text-sm"
                  >
                    {val as string}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}