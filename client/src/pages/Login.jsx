import React, { useState, useContext, useEffect } from 'react'
import { FaRegEye, FaRegEyeSlash } from 'react-icons/fa6'
import { AppContext } from '../context/AppContext.jsx'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Login = () => {

  const {backendUrl, setIsLoggedIn, getUserData, isLoggedIn} = useContext(AppContext)

  const [state, setState] = useState('Login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isShowPassword, setIsShowPassword] = useState(false)

  const navigate = useNavigate()

  const toggleShowPassword = () => {
    setIsShowPassword(!isShowPassword)
  }

  const onSubmitHandler = async (e) => {

    e.preventDefault()

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailRegex.test(email)) {
      toast.error('Please enter a valid email address');
      return;
    }

    try {
      e.preventDefault();

      axios.defaults.withCredentials = true

      if(state === 'Sign Up') {
        const {data} = await axios.post(backendUrl + '/api/auth/register', {name, email, password})

        if(data.success) {
          toast.success(data.message)
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      } else {
        const {data} = await axios.post(backendUrl + '/api/auth/login', {email, password})

        if(data.success) {
          toast.success(data.message)
          setIsLoggedIn(true)
          getUserData()
          navigate('/')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {

    }
  }


  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
    }
  }, [isLoggedIn, navigate]);

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0'>
      <h2 onClick={() => navigate('/')} className='absolute left-5 sm:left-20 top-5 text-2xl font-medium text-black cursor-pointer'>Notes.</h2>
      <div className='w-96 border rounded bg-white px-7 py-10'>
        <form autoComplete="off" onSubmit={onSubmitHandler}>
          <h4 className='text-2xl mb-7'>{state}</h4>
          { state === 'Sign Up' && (<input type="text" placeholder='Name' onChange={e => setName(e.target.value)} className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none' value={name} required/>)}
          <input type="email" autoComplete="off"  placeholder='Email' onChange={e => setEmail(e.target.value)} className='w-full text-sm bg-transparent border-[1.5px] px-5 py-3 rounded mb-4 outline-none' value={email} required/>
          <div className='flex items-center bg-transparent border-[1.5px] px-5 rounded mb-3'>
            <input type={isShowPassword ? 'text' : 'password'} autoComplete="new-password" placeholder='Password' onChange={e => setPassword(e.target.value)} 
              className='w-full text-sm bg-transparent py-3 mr-3 rounded outline-none' value={password} required/>
            {isShowPassword ? <FaRegEye size={22} className='text-primary cursor-pointer' onClick={toggleShowPassword}/> :
              <FaRegEyeSlash size={22} className='text-slate-400 cursor-pointer' onClick={toggleShowPassword}/>}
          </div>
          <button type='submit' className='btn-primary'>{state}</button>
          { state === 'Sign Up' ? 
          (<p className='text-sm text-center mt-4'>Already have an account?{' '}
            <span onClick={() => setState('Login')} className='font-medium text-primary underline cursor-pointer'>Login here</span>
          </p>) : 
          (<p className='text-sm text-center mt-4'>Don't have an account?{' '}
            <span onClick={() => setState('Sign Up')} className='font-medium text-primary underline cursor-pointer'>Sign Up</span>
          </p>)}
        </form>
      </div>
    </div>
  )
}

export default Login