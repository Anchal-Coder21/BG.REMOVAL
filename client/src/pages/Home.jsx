import React, { Component } from 'react'
import Header from '../components/Header'
import Steps from '../components/steps'
import BgSlider from '../components/BgSlider'
import Testimonials from '../components/Testimonials'
import Upload from '../components/Upload'

const Home = () => {
  return (
    <div>
      <Header />
      <Steps />
      <BgSlider />
      <Testimonials />
      <Upload />
    </div>
  )
}

export default Home
