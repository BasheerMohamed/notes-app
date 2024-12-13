import React, { useEffect, useState, useContext } from 'react'
import { AppContext } from '../context/AppContext.jsx'
import Navbar from '../components/Navbar'
import NoteCard from '../components/NoteCard'
import { MdAdd } from 'react-icons/md'
import AddEditNotes from './AddEditNotes'
import Modal from 'react-modal'
import axios from 'axios'
import { toast } from 'react-toastify'
import assests from '../assets/notebook.png'

const Home = () => {

  const {backendUrl} = useContext(AppContext)
  const [notes, setNotes] = useState([])
  const [openAddEditModal, setOpenAddEditModal] = useState({isShown: false, type: 'add', data: null})
  const [isSearch, setIsSearch] = useState(false)

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShown: true, data: noteDetails, type: 'edit'});
  }

  const clearNotes = () => {
    setNotes([]);
  }

  const getAllNotes = async () => {
    try {
      axios.defaults.withCredentials = true
      
      const {data} = await axios.get(backendUrl + '/api/auth/get-notes');
      setNotes(data.notes || [])
    } catch (error) {
      toast.error(error.message)
    }
  }

  const deleteNotes = async (data) => {
      const noteId = data._id;
    
      try {
          const {data} = await axios.delete(backendUrl + '/api/auth/delete-notes/' + noteId);

          if(data.success) {
            toast.success(data.message);
            getAllNotes();
          }
      } catch (error) {
        toast.error(error.message)
      }
  }

  const searchNotes = async (query) => {
    try {
      const { data } = await axios.get(backendUrl + '/api/auth/search-notes', { params: { query } });
  
      if (data.success) {
        setIsSearch(true);
        setNotes(data.notes || []);
  
        if (data.notes.length > 0) {
          toast.success(`${data.notes.length} notes found!`);
        } else {
          toast.info('No notes found!');
          getAllNotes()
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const updateIdPinned = async (notesData) => {
    const noteId = notesData._id;

    try {
        axios.defaults.withCredentials = true

        const {data} = await axios.put(backendUrl + '/api/auth/update-pin/' + noteId, {isPinned: !notesData.isPinned,});

        if(data.success) {
            toast.success(data.message);
            getAllNotes();
        }
    } catch (error) {
        toast.error(error.message)
    }
  }
  

  useEffect(() => {
    getAllNotes()
  }, [])

  return (
    <>
      <Navbar onSearchNotes={searchNotes} getAllNotes={getAllNotes} clearNotes={clearNotes}/>
      <div className='container mx-auto px-8'>
        {notes?.length > 0 ?
          <div className='grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2 md:grid-cols-3'>
          {notes.map((item) => (
            <NoteCard key={item._id}
            title={item.title} 
            date={item.createdOn}
            content={item.content}
            tags={item.tags}
            isPinned={item.isPinned}
            onEdit = {() => handleEdit(item)}
            onDelete = {() => deleteNotes(item)}
            onPinNote = {() => updateIdPinned(item)} />
          ))}
        </div> : 
        <div className='flex flex-col items-center justify-center mt-56 px-10'>
          <img src={assests} alt="" className='w-52' />
          <p className='lg:w-1/2 text-xl font-medium text-slate-700 text-center leading-7 mt-10'>Start creating your first note! Click the '<span className='text-primary'>Add</span>' button to jot down your thoughts, ideas, or reminders. Let's get started!</p>
        </div>}
      </div>
      <button className='w-12 h-12 flex items-center justify-center rounded-md bg-primary hover:bg-blue-600 fixed right-10 bottom-10' 
      onClick={() => {setOpenAddEditModal({isShown: true, type: 'add', data: null})}}>
        <MdAdd className='text-[26px] text-white' />
      </button>
      <Modal isOpen={openAddEditModal.isShown} ariaHideApp={false} onRequestClose={() => setOpenAddEditModal({ isShown: false, type: 'add', data: null })} 
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          },
        }}
        contentLabel='' className='w-[40%] max-h-3/4 bg-white rounded-md p-5 overflow-auto shadow-lg'>
        <AddEditNotes type={openAddEditModal.type} noteData={openAddEditModal.data} getAllNotes={getAllNotes} onClose={() => {setOpenAddEditModal({isShown: false, type: "add", data: null})}} />
      </Modal>
    </>
  )
}

export default Home