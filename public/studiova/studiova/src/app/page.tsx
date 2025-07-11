import { Metadata } from "next";
import Aboutus from "./components/home/about-us";
import AboutUsCorporativo from "./components/home/aboutus-corporativo";
import Faq from "./components/home/faq";
import HeroSection from "./components/home/hero";
import Portfolio from "./components/home/portfolio";
import Services from "./components/home/services";
import StatsFacts from "./components/home/stats-facts";
import Testimonial from "./components/home/testimonial";

export const metadata: Metadata = {
    title: "Studiova",
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsFacts/>
      <Portfolio/>
      <Services/>
      <Aboutus/>
      <Testimonial/>
      <Faq/>
      <AboutUsCorporativo/>
    </>
  );
}
