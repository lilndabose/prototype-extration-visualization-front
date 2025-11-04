export default function TableHeader() {
  return (
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
            <th scope="col" className="px-6 py-3 text-transparent">
                file icon
            </th>
            <th scope="col" className="px-6 py-3">
                Nom du fichier
            </th>
            <th scope="col" className="px-6 py-3">
                Taille
            </th>
            <th scope="col" className="px-6 py-3">
                Type de fichier
            </th>
            <th scope="col" className="px-6 py-3">
                Date de création
            </th>
            <th scope="col" className="px-6 py-3">
                Date de depot
            </th>
            <th scope="col" className="px-6 py-3">
                Actions
            </th>
        </tr>
    </thead>
  )
}
