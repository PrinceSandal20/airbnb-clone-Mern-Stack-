import axios from 'axios';
import React,{useContext, useState} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { UserContext } from '../UserContext';

export default function LoginPage() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const [redirect,setRedirect] = useState('');
  const {setUser} = useContext(UserContext);
  async function handleLoginSubmit(event){
    event.preventDefault();
    try {
       const {data} =  await axios.post("/login",{
            email,
            password,
        });
        setUser(data);
        alert("Login successfull");
        setRedirect(true);
    } catch (error) {
        alert("Login failed . try again later");
    }
  }
  if(redirect){
    return <Navigate to={'/'} />
  }
  return (
    <div className='mt-4 grow flex items-center justify-around'>
        <div className='mb-64'>
        <h1 className='text-4xl text-center mb-4'>Login</h1>
        <form className='max-w-md mx-auto' onSubmit={handleLoginSubmit}>
            <input 
            type='email' 
            placeholder='your@email.com' 
            value={email}
            onChange={(event)=>setEmail(event.target.value)}
            />
            <input 
            type='password' 
            placeholder='password' 
            value={password}
            onChange={(event)=>setPassword(event.target.value)}
            />
            <button className='primary'>Login</button>
            <div className='text-center py-2 text-gray-500'>
            don't have an account yet?
                <Link className='underline text-bn' to={'/register'}>Register now</Link>
            </div>
        </form>
        </div>
    </div>
  )
}
