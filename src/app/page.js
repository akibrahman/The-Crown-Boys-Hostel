import AboutSectionOne from "@/Components/HomePage/AboutSectionOne";
import Blog from "@/Components/HomePage/Blog";
import Brands from "@/Components/HomePage/Brands";
import Contact from "@/Components/HomePage/Contact";
import Features from "@/Components/HomePage/Features";
import Hero from "@/Components/HomePage/Hero";
import Pricing from "@/Components/HomePage/Pricing";
import ScrollUp from "@/Components/HomePage/ScrollUp";
import Testimonials from "@/Components/HomePage/Testimonials";
import Video from "@/Components/HomePage/Video";
import MijanSection from "@/Components/HomePage/MijanSection";

export const metadata = {
  title: "The Crown Boys Hostel",
  description: "This is Home for The Crown Boys Hostel",
};

export default function Home() {
  return (
    <>
      <ScrollUp />
      <Hero />
      <MijanSection />
      <AboutSectionOne />
      <Testimonials />
      <Features />
      <Video />
      {/* <Brands /> */}
      <Pricing />
      {/* <Blog /> */}
      <Contact />
    </>
  );
}
