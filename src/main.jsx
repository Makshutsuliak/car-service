import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './home'
import Account from './components/account/account'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ClerkProvider } from '@clerk/clerk-react'
import Questions from './questions/questions'
import Contactform from './components/contactform/contactform'
import Complexservice from './components/complexservice/complexservice'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

const router=createBrowserRouter([
  
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/questions',
    element:<Questions/>
  },
  {
    path:'/contactform',
    element:<Contactform/>
  },
  {
    path:'/complexservice',
    element:<Complexservice/>
  },
  {

  
  path:"/account", 
  element:<Account/>
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
     <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">  
      <RouterProvider router={router}/>
    </ClerkProvider>
  </StrictMode>,
)
