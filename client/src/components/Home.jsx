import React from 'react'
import Navbar from './Navbar'
import Herosec from './Herosec'
import CategoryCarousel from './CategoryCarousel'
import Footer from './Footer'
import Latestestjob from './Latestestjob'

function Home() {
	return (
		<div>
		<Herosec/>
		<CategoryCarousel/>
		<Latestestjob/>
		<Footer/>
		</div>
	)
}

export default Home
