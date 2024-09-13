import axios from 'axios'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { logout, setOnlineUser, setUser } from '../redux/userSlice'
import Sidebar from '../components/Sidebar'
import logo from '../assets/logo1.png'
import { useSocket } from '../context/socketContext'

const Home = () => {
  const {socket, initializeSocket } = useSocket();
  const user = useSelector(state => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  //console.log('user',user)
  const fetchUserDetails = async()=>{
    try {
        const URL = `${process.env.REACT_APP_BACKEND_URL}/api/user-details`
        const response = await axios({
          url : URL,
          withCredentials : true
        })

        dispatch(setUser(response.data.data))

        if(response.data.data.logout){
            dispatch(logout())
            navigate("/email")
        }
        //console.log("current user Details",response)
    } catch (error) {
        console.log("error",error)
    }
  }
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/email'); 
    }
  }, []);

  useEffect(()=>{
    fetchUserDetails()
  },[])


  /***socket connection */
  useEffect(()=>{
    const socket = initializeSocket();
    // Listen to the 'onlineUser' event
    socket.on('onlineUser', (data) => {
      dispatch(setOnlineUser(data));
      //console.log("data",data);
    });


    return () => {
      //localStorage.removeItem('token');
      socket.disconnect();
    };
    
  },[])


  const basePath = location.pathname === '/'
  return (
    <div className='grid lg:grid-cols-[300px,1fr] h-screen max-h-screen'>
        <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
           <Sidebar/>
        </section>

        {/**message component**/}
        <section className={`${basePath && "hidden"}`} >
            <Outlet/>
        </section>


        <div className={`justify-center items-center flex-col gap-2 hidden ${!basePath ? "hidden" : "lg:flex" }`}>
            <div>
              <img
                src={logo}
                width={250}
                alt='logo'
              />
            </div>
            <p className='text-lg mt-2 text-slate-500'>Select user to send message</p>
        </div>
    </div>
  )
}

export default Home
