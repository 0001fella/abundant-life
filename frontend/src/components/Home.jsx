import React from "react";
import Hero from "./Hero";
import About from "./About";
import Testimonials from "./Testimonials";


const Home = () => {
  return (
    <div className="pt-24 space-y-10 bg-theme text-theme">
      <Hero />
      <About />
      <Testimonials />
    
    </div>
  );
};

export default Home;