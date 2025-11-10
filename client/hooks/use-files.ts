import { useState, useCallback } from 'react';
import { useUser } from '@/contexts/user-context';
import { filesAPI } from '@/services/api';

// Fallback mock data
const mockFiles: FileItem[] = [
  {
    id: 1,
    filename: "ERIS_Report_Extract1_.xlsx",
    filetype: "Excel",
    file_size: "2.50 MB",
    date_created: "2025-09-15",
    upload_date: "2025-09-15T14:32:00",
    updated_at: "2025-09-15T14:32:00",
  },
  {
    id: 2,
    filename: "ERIS_Report_Extract_.xlsx",
    filetype: "Excel",
    file_size: "2.72 MB",
    date_created: "2025-09-30",
    upload_date: "2025-09-30T09:15:00",
    updated_at: "2025-09-30T09:15:00",
  },
];

export interface FileItem {
  id: number;
  filename: string;
  filetype: string;
  file_size: string;
  date_created: string;
  upload_date: string;
  updated_at: string;
}

interface UseFilesResult {
  files: FileItem[];
  loading: boolean;
  error: string | null;
  getFiles: () => Promise<void>;
  uploadFile: (file: File, dateCreation?: string) => Promise<void>;
  deleteFile: (fileId: number) => Promise<void>;
  refetch: () => Promise<void>;
}


export const useFiles = (): UseFilesResult => {
  const { user } = useUser();
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getFiles = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await filesAPI.getFiles(user.id);
      setFiles(response.data.files || []);
    } catch (err) {
      // Fallback to mock data if API is unavailable
      console.log("API unavailable, using mock files data");
      setFiles(mockFiles);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const uploadFile = useCallback(
    async (file: File, dateCreation?: string) => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        const dateToUse = dateCreation || new Date().toISOString().split('T')[0];
        await filesAPI.uploadFile(file, user.id, dateToUse);
        await getFiles();
      } catch (err) {
        // Fallback to mock upload if API is unavailable
        console.log("API unavailable, using mock file upload");
        const newFile: FileItem = {
          id: Math.max(...mockFiles.map(f => f.id), 0) + 1,
          filename: file.name,
          filetype: file.type.split('/')[1] || file.name.split('.').pop() || 'Unknown',
          file_size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
          date_created: dateCreation || new Date().toISOString().split('T')[0],
          upload_date: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        mockFiles.push(newFile);
        setFiles([...mockFiles]);
      } finally {
        setLoading(false);
      }
    },
    [user?.id, getFiles]
  );

  const deleteFile = useCallback(
    async (fileId: number) => {
      if (!user?.id) return;

      setLoading(true);
      setError(null);

      try {
        await filesAPI.deleteFile(fileId, user.id);
        await getFiles();
      } catch (err) {
        // Fallback to mock deletion if API is unavailable
        console.log("API unavailable, using mock file deletion");
        const index = mockFiles.findIndex(f => f.id === fileId);
        if (index > -1) {
          mockFiles.splice(index, 1);
          setFiles([...mockFiles]);
        }
      } finally {
        setLoading(false);
      }
    },
    [user?.id, getFiles]
  );

  const refetch = useCallback(async () => {
    await getFiles();
  }, [getFiles]);

  return {
    files,
    loading,
    error,
    getFiles,
    uploadFile,
    deleteFile,
    refetch,
  };
};
