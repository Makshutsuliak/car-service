import React from 'react'

function Map(){
  return (
    <div className='md:m-10  my-10 grid grid-cols-1 md:grid-cols-2 justify-center '>
        <div className='' > <h2 className=' text-[3vw] '>Ви можете знайти нас за адресою:</h2>
        </div>
        
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d605.5635218307791!2d25.76283140334419!3d48.452349792167794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x473155b4e3a0821b%3A0x5e7b1eacf4401215!2z0KjQuNC90L7QvNC-0L3RgtCw0LYgVG9jaGthIEtpdHNtYW4!5e1!3m2!1suk!2sua!4v1739808875156!5m2!1suk!2sua" width="100%" height="100%"  className='m-5 min-h-[300px]   min-w-[200px]  self-center'></iframe>
    </div>
  )
}

export default Map 