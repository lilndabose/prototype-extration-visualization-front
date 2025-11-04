import { FaFileCsv } from "react-icons/fa6";
import type { File } from "../pages/Dashboard";

export default function TableRow({onPreview, onDelete, file, index}: {onPreview: (index: number) => void, onDelete: (index: number) => void, file: File, index: number}) {
  return (
        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                <td className="px-6 py-4">
                    <FaFileCsv className="text-gray-400" />
                </td>
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {file.name}
                </th>
                <td className="px-6 py-4">
                    {file.size}
                </td>
                <td className="px-6 py-4">
                    {file.type.includes('SHEET') ? '.xlsx': ''}
                </td>
                <td className="px-6 py-4">
                    {file.createdAt}
                </td>
                <td className="px-6 py-4">
                    {file.uploadedAt}
                </td>
                <td className="flex items-center px-6 py-4">
                    <button onClick={() => onPreview(index)} className="font-medium text-blue-600 cursor-pointer hover:scale-105 outline-none border-0 dark:text-blue-500 hover:underline">Aperçu</button>
                    <a download={true} href={file.fileUrl} className="font-medium text-green-600 cursor-pointer hover:scale-105 outline-none border-0 hover:underline ml-4">Telecharger</a>
                    <button onClick={() => onDelete(index)} className="font-medium text-red-600 cursor-pointer hover:scale-105 outline-none border-0 dark:text-red-500 hover:underline ms-3">Supprimer</button>
                </td>
    </tr>
  )
}
