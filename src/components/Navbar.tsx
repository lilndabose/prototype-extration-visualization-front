import { totalLogo } from '../assets'
import { AiOutlineLogout } from "react-icons/ai";

export default function Navbar() {
  return (
    <div className="w-full h-18 py-2 pl-10 flex items-center justify-start mb-10 bg-white shadow rounded-b-md">
            <div className='w-5/6 h-full flex items-start justify-start'>
                <img
                alt="Your Company"
                src={totalLogo}
                className="ml-5 mt-2 h-12 w-auto"
            />
            <div className='ml-4 mx-4'>
                <p className='text-2xl font-[600] text-[#e20000]'>Dashboard</p>
                <span className='text-gray-600 text-sm'>Déposez fichiers extractions ici</span>
            </div>
            </div>
            <div className='w-auto rounded h-3/4 p-1 flex items-center justify-end pr-2 cursor-pointer hover:opacity-70' onClick={()=>{
                sessionStorage.removeItem('loggedUser');
                window.location.replace("/login");
            }}>

            <AiOutlineLogout className='text-xl text-red-500' title='Se déconnecter' />
            <span className='text-red-500 ml-2'>Se déconnecter</span>

            </div>
        </div>
  )
}
