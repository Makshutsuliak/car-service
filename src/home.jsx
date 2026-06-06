
import React from 'react'
import Header from './components/header'
import Info from './components/info'
import Footer from './components/footer'
import Map from './components/map'

function Home() {
  return (
    <div Classname="justify-center flex align-top" width={300}>
      
      <Header/>
      <Info/>
      <Map/>      
      <Footer/>
    </div>
  )
}

export default Home