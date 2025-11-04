// import React, { useState } from 'react';
// import { format } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Search, ArrowUpDown, Download, Trash2, ExternalLink, FileText, Image, File as FileIcon } from "lucide-react";
// import { Skeleton } from "@/components/ui/skeleton";
// import { File } from "@/entities/File";

// const formatFileSize = (bytes: number) => {
//   if (bytes === 0) return '0 Bytes';
//   const k = 1024;
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   const i = Math.floor(Math.log(bytes) / Math.log(k));
//   return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
// };

// const getFileIcon = (fileType: string) => {
//   if (fileType?.startsWith('image/')) return Image;
//   if (fileType?.includes('pdf')) return FileText;
//   return FileIcon;
// };

// export default function FileTable({ files, isLoading, onFileDeleted }) {
//   const [searchQuery, setSearchQuery] = useState("");
//   const [sortBy, setSortBy] = useState("date");
//   const [sortOrder, setSortOrder] = useState("desc");
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   // Real-time search filtering
//   const filteredFiles = files.filter(file =>
//     file.name.toLowerCase().includes(searchQuery.toLowerCase())
//   );

//   // Sorting
//   const sortedFiles = [...filteredFiles].sort((a, b) => {
//     let comparison = 0;
    
//     if (sortBy === "name") {
//       comparison = a.name.localeCompare(b.name);
//     } else if (sortBy === "size") {
//       comparison = (a.file_size || 0) - (b.file_size || 0);
//     } else if (sortBy === "date") {
//       comparison = new Date(a.created_date).getTime() - new Date(b.created_date).getTime();
//     }

//     return sortOrder === "asc" ? comparison : -comparison;
//   });

//   // Pagination
//   const totalPages = Math.ceil(sortedFiles.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const paginatedFiles = sortedFiles.slice(startIndex, endIndex);

//   const handleSort = (field) => {
//     if (sortBy === field) {
//       setSortOrder(sortOrder === "asc" ? "desc" : "asc");
//     } else {
//       setSortBy(field);
//       setSortOrder("asc");
//     }
//   };

//   const handleDelete = async (fileId) => {
//     if (confirm("Are you sure you want to delete this file?")) {
//       try {
//         await File.delete(fileId);
//         onFileDeleted();
//       } catch (error) {
//         console.error("Error deleting file:", error);
//       }
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="space-y-4">
//         <Skeleton className="h-10 w-full" />
//         {Array(5).fill(0).map((_, i) => (
//           <Skeleton key={i} className="h-16 w-full" />
//         ))}
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4">
//       {/* Search and Sort Controls */}
//       <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
//         <div className="relative flex-1 max-w-md">
//           <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
//           <Input
//             placeholder="Search by file name..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="pl-10 bg-white border-slate-200 focus:border-blue-400 focus:ring-blue-400/20"
//           />
//         </div>

//         <div className="flex items-center gap-2">
//           <span className="text-sm text-slate-600">Sort by:</span>
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button variant="outline" className="gap-2">
//                 <ArrowUpDown className="w-4 h-4" />
//                 {sortBy === "name" ? "Name" : sortBy === "size" ? "Size" : "Date"}
//                 <span className="text-xs text-slate-500">
//                   ({sortOrder === "asc" ? "↑" : "↓"})
//                 </span>
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end">
//               <DropdownMenuItem onClick={() => handleSort("name")}>
//                 Name {sortBy === "name" && `(${sortOrder === "asc" ? "↑" : "↓"})`}
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleSort("size")}>
//                 Size {sortBy === "size" && `(${sortOrder === "asc" ? "↑" : "↓"})`}
//               </DropdownMenuItem>
//               <DropdownMenuItem onClick={() => handleSort("date")}>
//                 Date {sortBy === "date" && `(${sortOrder === "asc" ? "↑" : "↓"})`}
//               </DropdownMenuItem>
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="rounded-lg border border-slate-200 overflow-hidden bg-white">
//         <Table>
//           <TableHeader>
//             <TableRow className="bg-slate-50">
//               <TableHead className="w-12"></TableHead>
//               <TableHead>File Name</TableHead>
//               <TableHead>Size</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Uploaded</TableHead>
//               <TableHead className="text-right">Actions</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {paginatedFiles.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={6} className="text-center py-12">
//                   <FileIcon className="w-12 h-12 mx-auto mb-3 text-slate-300" />
//                   <p className="text-slate-500">
//                     {searchQuery ? "No files found matching your search" : "No files uploaded yet"}
//                   </p>
//                 </TableCell>
//               </TableRow>
//             ) : (
//               paginatedFiles.map((file) => {
//                 const FileIconComponent = getFileIcon(file.file_type);
//                 return (
//                   <TableRow key={file.id} className="hover:bg-slate-50/50 transition-colors">
//                     <TableCell>
//                       <div className="p-2 bg-blue-50 rounded-lg">
//                         <FileIconComponent className="w-5 h-5 text-blue-600" />
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <div>
//                         <p className="font-semibold text-slate-900">{file.name}</p>
//                         {file.description && (
//                           <p className="text-xs text-slate-500 mt-1">{file.description}</p>
//                         )}
//                       </div>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant="secondary" className="font-mono text-xs">
//                         {formatFileSize(file.file_size)}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       <span className="text-sm text-slate-600">
//                         {file.file_type?.split('/')[1]?.toUpperCase() || 'FILE'}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <div className="text-sm">
//                         <p className="text-slate-900">
//                           {format(new Date(file.created_date), 'MMM d, yyyy')}
//                         </p>
//                         <p className="text-xs text-slate-500">
//                           {format(new Date(file.created_date), 'h:mm a')}
//                         </p>
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-right">
//                       <div className="flex items-center justify-end gap-2">
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => window.open(file.file_url, '_blank')}
//                           title="View file"
//                         >
//                           <ExternalLink className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => {
//                             const link = document.createElement('a');
//                             link.href = file.file_url;
//                             link.download = file.name;
//                             link.click();
//                           }}
//                           title="Download file"
//                         >
//                           <Download className="w-4 h-4" />
//                         </Button>
//                         <Button
//                           variant="ghost"
//                           size="icon"
//                           onClick={() => handleDelete(file.id)}
//                           className="text-red-600 hover:text-red-700 hover:bg-red-50"
//                           title="Delete file"
//                         >
//                           <Trash2 className="w-4 h-4" />
//                         </Button>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {totalPages > 1 && (
//         <div className="flex items-center justify-between pt-4">
//           <p className="text-sm text-slate-600">
//             Showing {startIndex + 1} to {Math.min(endIndex, sortedFiles.length)} of {sortedFiles.length} files
//           </p>
//           <div className="flex items-center gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(currentPage - 1)}
//               disabled={currentPage === 1}
//             >
//               Previous
//             </Button>
//             <div className="flex items-center gap-1">
//               {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
//                 <Button
//                   key={page}
//                   variant={currentPage === page ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setCurrentPage(page)}
//                   className={currentPage === page ? "bg-blue-600 hover:bg-blue-700" : ""}
//                 >
//                   {page}
//                 </Button>
//               ))}
//             </div>
//             <Button
//               variant="outline"
//               size="sm"
//               onClick={() => setCurrentPage(currentPage + 1)}
//               disabled={currentPage === totalPages}
//             >
//               Next
//             </Button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }