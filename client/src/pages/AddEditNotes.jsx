import React, { useState, useContext } from 'react'
import TagInput from '../components/TagInput'
import { MdClose } from 'react-icons/md'
import axios from 'axios'
import { AppContext } from '../context/AppContext.jsx'
import { toast } from 'react-toastify'

const AddEditNotes = ({noteData, onClose, type, getAllNotes}) => {

    const [title, setTitle] = useState(noteData?.title || '')
    const [content, setContent] = useState(noteData?.content || '')
    const [tags, setTags] = useState(noteData?.tags || [])

    const {backendUrl} = useContext(AppContext)

    const addNewNotes = async () => {
        try {
            axios.defaults.withCredentials = true

            const {data} = await axios.post(backendUrl + '/api/auth/add-notes', {title, content, tags});

            if(data.success) {
                toast.success(data.message);
                getAllNotes();
                onClose();
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const editNotes = async () => {

        const noteId = noteData._id;

        try {
            axios.defaults.withCredentials = true

            const {data} = await axios.put(backendUrl + '/api/auth/edit-notes/' + noteId, {title, content, tags});

            if(data.success) {
                toast.success(data.message);
                getAllNotes();
                onClose();
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

  return (
    <div className='relative'>
        <button onClick={onClose} className='w-10 h-10 rounded-full flex items-center justify-center absolute -top-3 -right-3 hover:bg-slate-50'>
            <MdClose className='text-xl text-slate-400' />
        </button>
        <div className='flex flex-col gap-2'>
            <label className='input-label'>TITLE</label>
            <input type="text" placeholder='TITLE' value={title} onChange={e => setTitle(e.target.value)} className='text-2xl text-slate-950 outline-none' rows={10} />
        </div>
        <div className='flex flex-col gap-2 mt-4'>
            <label className='input-label'>CONTENT</label>
            <textarea type='text' value={content} onChange={e => setContent(e.target.value)} className='text-sm text-slate-950 outline-none bg-slate-50 p-2 rounded' placeholder='Content' rows={10}></textarea>
        </div>
        <div className='mt-3'>
            <label className='input-label'>TAGS</label>
            <TagInput tags={tags} setTags={setTags} />
        </div>
        <button onClick={type === 'edit' ? editNotes : addNewNotes} className='btn-primary font-medium mt-5 p-3'>{type === 'edit' ? 'UPDATE' : 'ADD'}</button>
    </div>
  )
}

export default AddEditNotes