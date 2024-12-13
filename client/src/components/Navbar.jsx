import React, { useState, useContext } from 'react'
import { GoArrowRight } from "react-icons/go";
import { FaMagnifyingGlass } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext.jsx'
import axios from 'axios'
import { toast } from 'react-toastify'
import assests from '../assets/letter-n.png'

const Navbar = ({onSearchNotes, getAllNotes, clearNotes}) => {

  const navigate = useNavigate()
  const [search, setSearch] = useState('');

  const {userData, backendUrl, setUserData, setIsLoggedIn, isLoggedIn} = useContext(AppContext)

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true
      
      const {data} = await axios.post(backendUrl + '/api/auth/logout')

      data.success && setIsLoggedIn(false)
      data.success && setUserData(false)

      toast.success(data.message)
      clearNotes();
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleSearch = () => {
    if (search.trim()) {
      onSearchNotes(search);
    } else {
      toast.info("Please enter a search term.");
      getAllNotes();
    }
    setSearch('');
  };

  return (
    <div className='w-full flex justify-between items-center gap-5 p-5 md:px-24 border-b-2'>
      <div className='flex gap-2 items-center justify-center'>
        <img src={assests} alt="" className='min-w-9 w-9' />
        <h2 className='text-2xl font-medium text-black cursor-pointer hidden sm:block'>Notes.</h2>
      </div>
      {isLoggedIn && <div className='w-80 flex items-center px-4 bg-slate-100 rounded-md'>
        <input type="text" onChange={e => setSearch(e.target.value)} value={search} placeholder='Search Notes' className='w-full text-sm bg-transparent py-[11px] pr-1 outline-none' />
        <FaMagnifyingGlass onClick={handleSearch} className='text-slate-400 cursor-pointer hover:text-black' />
      </div>}
      {userData ? 
        <div className='w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group flex-shrink-0'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
            <ul className='list-none m-0 p-2 bg-gray-100 text-sm'>
              <li onClick={logout} className='py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10'>Logout</li>
            </ul>
          </div>
        </div> :
        <button onClick={() => navigate('/login')} className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login
        <GoArrowRight size={18} />
      </button>}
  </div>
  )
}

export default Navbar