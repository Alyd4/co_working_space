import React from 'react';
import Hero from '../components/Hero'; 
import Popular from '../components/Popular';
import Pricing from '../components/Pricing';
import FAQ from '../components/FAQ';
import Header from '../components/Header';
import Footer from '../components/Footer';


const Home = () => {
  return (
   <>
   <Header/>
   <Hero/>
   <Popular/>
   <Pricing/>
   <FAQ/>
   <Footer/>
   
   </>
  )
}

export default Home