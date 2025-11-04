import { useState, useEffect } from 'react'
import Navbar from '../components/Navbar';
import TableHeader from '../components/TableHeader';
import 'react-responsive-modal/styles.css';
import { Modal } from 'react-responsive-modal';
import TableRow from '../components/TableRow';
import FilePreviewer from '../components/FilePreviewer';
import { loader } from '../assets';
import axios from 'axios';
import { IoIosRefresh, IoMdAdd, IoMdStats } from "react-icons/io";
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FaFile } from 'react-icons/fa6';
import { Toast } from "flowbite-react";
import { TbDatabaseCog } from "react-icons/tb";
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

enum FileSortOptions {
  FILENAME = 'filename',
  FILESIZE = 'filesize',
  FILE_DATE_OF_CREATION = 'fileDateOfCreation',
  FILE_DATE_OF_UPLOAD = 'fileDateOfUpload'
}

enum ModalType {
  UPLOAD = 'upload',
  PREVIEW = 'preview'
}

export interface File {
  id: number;
  name: string;
  size: string;
  type: string;
  createdAt: string;
  uploadedAt: string;
  fileUrl?: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<File[]>([]);
  const [filesData, setFilesData] = useState<File[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isExtractionFinished, setIsExtractionFinished] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [sortOption, setSortOption] = useState(FileSortOptions.FILENAME);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileUploaded, setFileUploaded] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [circularValue, setCircularValue] = useState<number>(0);
  const [dateCreationFichier, setDateCreationFichier] = useState<string>("");

  const onOpenModal = (type: ModalType) => {
    if (type === ModalType.UPLOAD) {
      setShowUploadModal(true);
    } else if (type === ModalType.PREVIEW) {
      setShowPreviewModal(true);
    }
  };
  const onCloseModal = (type: ModalType) => {
    if (type === ModalType.UPLOAD) {
      setShowUploadModal(false);
    } else if (type === ModalType.PREVIEW) {
      setShowPreviewModal(false);
    }
  };

   useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    setIsLoading(true);
    let loggedUser = sessionStorage.getItem('loggedUser');
    if(!loggedUser){
      return window.location.href = "/login"
    }
    loggedUser = loggedUser ? JSON.parse(loggedUser) : null;
    axios.get(`${import.meta.env.VITE_API_URL}/files?user_id=${loggedUser?.id}`)
      .then(response => {
        if(response.status === 200) {
            const fileArrays = response.data.files.map((file: any) => ({
                id: file.id,
              name: file.filename,
              size: file.file_size,
              type: file.filetype.split("/")[1].toUpperCase(),
              createdAt: new Date(file.date_created).toLocaleDateString(),
              uploadedAt: new Date(file.upload_date).toLocaleDateString(),
              fileUrl: `${import.meta.env.VITE_API_URL}/uploads/${file.filename}`
            }));
            setFiles([...fileArrays]);
            setFilesData([...fileArrays]);
        }
      })
      .catch(error => {
        setError(error.response.data.error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    const sortedFiles = [...files].sort((a, b) => {
      switch (sortOption) {
        case FileSortOptions.FILENAME:
          return a.name.localeCompare(b.name);
        case FileSortOptions.FILESIZE:
          return parseFloat(b.size.replace(' MB', '')) - parseFloat(a.size.replace(' MB', ''));
        case FileSortOptions.FILE_DATE_OF_CREATION:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case FileSortOptions.FILE_DATE_OF_UPLOAD:
          return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        default:
          return 0;
      }
    });
    setFiles([...sortedFiles]);
  }, [sortOption]);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        onOpenModal(ModalType.UPLOAD);
        const file = e.target.files?.[0];
        if (file) {
            setFileUploaded(file);
        }
    };

    const uploadFile = () => {
        if(!fileUploaded) return;
        setIsUploading(true);
        let loggedUser = sessionStorage.getItem('loggedUser');
        loggedUser = loggedUser ? JSON.parse(loggedUser) : null;
        setTimeout(()=>{
            const formData = new FormData();
            formData.append("file", fileUploaded);
            axios.post(`${import.meta.env.VITE_API_URL}/upload?user_id=${loggedUser?.id}&date_creation=${dateCreationFichier}`, formData)
            .then(response => {
                if(response.status === 201 || response.status === 200) {
                    setSuccess("Fichier ajouté avec succès");
                    loadFiles();
                    onCloseModal(ModalType.UPLOAD);

                    launchFileExtraction()
                    setTimeout(() => {
                      setSuccess("")
                      setIsExtracting(true)
                    }, 1000);
                }
            })
            .catch(error => {
                setError(error.response.data.error);
                setTimeout(() => setError(""), 5000);
            })
            .finally(() => {
                setIsUploading(false);
            });
        }, 2000);
    }

const launchFileExtraction = () => {
  const cleanupAnimation = startAnimation(setCircularValue, 100, 30000);
  
  axios.get(`${import.meta.env.VITE_API_URL}/extract`)
    .then(response => {
      if(response.status === 201 || response.status === 200) {
        setIsExtractionFinished(true);
        setTimeout(() => setSuccess(""), 3000);
      }
    })
    .catch(error => {
      setError(error.response.data.error);
      setTimeout(() => setError(""), 5000);
      setIsExtracting(false);
      cleanupAnimation();
    })
    .finally(() => {
      setIsUploading(false);
      setTimeout(() => {
        setIsExtracting(false);
        setIsExtractionFinished(false);
        setFileUploaded(null);
        setCircularValue(0);
        cleanupAnimation();
      }, 60000);
    });
};

  const onSearchFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(!e.target.value) return;
    const query = e.target.value.toLowerCase();
    const filteredFiles = files.filter(file => file.name.toLowerCase().includes(query));
    setFiles([...filteredFiles]);
  }

  const onPreviewFile = (index: number) => {
    setSelectedFile(files[index]);
    onOpenModal(ModalType.PREVIEW);
  };

  const formatFileName = (name: string) => {
    if (name.length <= 20) return name;
    const extIndex = name.lastIndexOf('.');
    const ext = extIndex !== -1 ? name.slice(extIndex) : '';
    return name.slice(0, 20) + '...' + ext;
  }

  const onDeleteFile = (index: number) => {
    const fileToDelete = files[index];
    let loggedUser = sessionStorage.getItem('loggedUser');
    loggedUser = loggedUser ? JSON.parse(loggedUser) : null;
    const confirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer le fichier ${fileToDelete.name} ?`) &&
    axios.delete(`${import.meta.env.VITE_API_URL}/delete-file/${fileToDelete.id}?user_id=${loggedUser?.id}`)
      .then(response => {
        if(response.status === 200) {
            setSuccess("Fichier supprimé avec succès");
            loadFiles();
            setTimeout(() => setSuccess(""), 3000);
        }
      })
      .catch(error => {
        setError(error.response.data.error);
        setTimeout(() => setError(""), 5000);
      });
  }

  const startAnimation = (
  setCircularValue: React.Dispatch<React.SetStateAction<number>>,
  targetValue: number = 100,
  duration: number = 60000
) => {
  const startTime = Date.now();

  const interval = setInterval(() => {
    const elapsed = Date.now() - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const currentValue = progress * targetValue;
    setCircularValue(Math.round(currentValue));

    if (progress >= 1) {
      clearInterval(interval);
    }
  }, 100);

  return () => clearInterval(interval);
};

  return (
    <div className='flex min-h-full h-screen flex-col items-center justify-start bg-gray-50'>
        <Navbar />
        {/* Upload Modal */}
        <Modal open={showUploadModal} onClose={() => onCloseModal(ModalType.UPLOAD)} center>
            <div className='w-96 h-48 flex flex-col items-center justify-center space-y-4'>
                <h2>Ajouter un nouveau fichier</h2>
                {fileUploaded && (
                    <div className='text-center'>
                        <p className='font-bold'>{fileUploaded.name}</p>
                        <p className='text-sm text-gray-600'>Taille: {(fileUploaded.size / (1024*1024)).toFixed(4)} MB</p>
                        <div className='my-2 flex justify-center items-center'>
                          <p className='text-sm text-gray-600'>Date de création <span className='text-red-500'>*</span>:</p>
                          <input type="date" className='border border-gray-300 rounded p-1' value={dateCreationFichier} required onChange={(e) => setDateCreationFichier(e.target.value)} />
                        </div>
                        <button disabled={!dateCreationFichier} onClick={uploadFile} className='text-white bg-black rounded p-2 mt-2 hover:opacity-0.8 hover:cursor-pointer'>
                            {isUploading ? 'Sauvegarde en cour ...' : 'Sauvegarder le fichier'}
                            {isUploading && <img src={loader} className='h-4 w-4 inline-block ms-2 animate-spin'/>}
                        </button>
                    </div>
                )}
                {!fileUploaded && (
                    <input type="file" accept="xlsx" onChange={handleFileUpload} className='hover:cursor-pointer text-white bg-black rounded p-2'/>
                )}
            </div>
        </Modal>

        {/* Preview Modal */}
        <Modal open={showPreviewModal} onClose={() => onCloseModal(ModalType.PREVIEW)} center>
           <FilePreviewer file={selectedFile?.fileUrl}/>
        </Modal>

        <div className="w-full h-full flex flex-col items-center justify-center">
           <div className='flex w-[45%] h-auto justify-start items-start mb-4'>
           { (isExtracting || isExtractionFinished) &&
             <Toast className='flex justify-between'>
                <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${!isExtractionFinished ? 'bg-red-100 text-red-500': 'bg-green-100 text-green-500'} dark:bg-cyan-800 dark:text-cyan-200`}>
                  <TbDatabaseCog  className="h-5 w-5" />
                </div>
                <div className="ml-3 text-sm font-normal">
                  {`Extraction du fichier `}
                    <span className={`font-[600] ${!isExtractionFinished ? 'text-red-500':'text-green-500'}`}>{fileUploaded?.name} </span>
                  {!isExtractionFinished ? `en cours` : 'terminées'}
                </div>
                <div style={{ width: 40, height: 40 }}>
                  <CircularProgressbar  value={circularValue} text={`${circularValue}%`} styles={buildStyles({
                    textColor: isExtractionFinished ? 'green' : 'red',
                    pathColor:  isExtractionFinished ? `rgba(0, 226, 0, ${circularValue / 100})` : `rgba(226, 0, 0, ${circularValue / 100})`
                  })} />
                </div>
              </Toast>}
             {/* <ProgressBar completed={100}
             completedClassName='barCompleted'
              customLabelStyles={{
              width: '700px'
             }}/> */}
           </div>
           <div className='w-11/12 h-full bg-white rounded-lg border border-gray-200 p-6 shadow-md mb-4'>
                <div className='w-full h-auto p-1 flex justify-between'>
                  <div>
                    <h1 className='text-2xl font-bold'>Mes fichiers</h1>
                    <p className='text-gray-600 text-sm'>Gérer tous vos fichiers ici</p>
                  </div>
                  {
                  files.length > 0 && (
                  <button onClick={()=>{
                    window.location.href='/statistics'
                  }} className='p-1 flex items-center hover:bg-yellow-600 cursor-pointer justify-around rounded-md bg-yellow-500 text-white'>
                    <IoMdStats  size={20} color="white" />
                    Visualiser les données
                  </button>
                  )
                }
                </div>

                

                <div className='w-full h-auto flex items-center justify-center mb-2'>
                    {/* Search */}
                    <div className='w-10/12 flex items-center space-x-4 mt-6 mb-4'>
                        <div className="relative w-1/3">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                            </svg>
                        </div>
                        <input type="search" onChange={onSearchFile} id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Recherchez par nom du fichier ..." required />
                    </div>
                    <button className='flex h-full items-center justify-center text-sm text-black hover:underline' onClick={() => {loadFiles(); (document.getElementById("default-search") as HTMLInputElement).value = ""}}>
                        Rafraichir
                        <IoIosRefresh className='text-gray-400 hover:cursor-pointer ml-2' size={20} />
                    </button>
                    </div>

                    {/* Sort */}
                    <div className='flex items-center justify-center w-1/5'>
                        <span className='text-gray-600 text-sm mr-2'>Trier par :</span>
                        <select onChange={(e) => setSortOption(e.target.value as FileSortOptions)} className='border border-gray-300 rounded p-2 text-sm outline-none cursor-pointer'>
                            <option value={FileSortOptions.FILENAME}>Nom du fichiers</option>
                            <option value={FileSortOptions.FILESIZE}>Taille du fichiers</option>
                            <option value={FileSortOptions.FILE_DATE_OF_CREATION}>Date de creations</option>
                            <option value={FileSortOptions.FILE_DATE_OF_UPLOAD}>Date de depot</option>
                        </select>
                    </div>
                </div>

                {/* Table display */}
                

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    {error && <p className='text-red-500 text-md my-2 text-center'>{error}</p>}
                    {success && <p className='text-green-500 text-md my-2 text-center'>{success}</p>}
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <TableHeader />
                        <tbody>
                           {
                            files?.map((item: File, index) => (
                              <TableRow
                                key={index}
                                onPreview={onPreviewFile}
                                onDelete={onDeleteFile}
                                file={{ ...item, name: formatFileName(item.name) }}
                                index={index}
                              />
                            ))
                           }
                        </tbody>
                    </table>
                </div>

                <Fab
                  mainButtonStyles={{
                    backgroundColor: '#063bb7'
                  }}
                  style={{
                    bottom: 6,
                    right: 4,
                    
                  }}
                  icon={<IoMdAdd />}
                  // event={event}
                  alwaysShowTitle={true}
                >
                  <Action
                      text="Importer un fichier d’extraction"
                      onClick={handleFileUpload}
                      style={{
                        backgroundColor: '#1b5ffc'
                      }}
                    >
                    <FaFile />
                  </Action>
                </Fab>

           </div>
        </div>
    </div>
  )
}
