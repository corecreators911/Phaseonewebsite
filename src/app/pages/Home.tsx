import React from "react";
import { Hero } from "../components/Hero";
import { SectionDivider } from "../components/SectionDivider";
import { Showreel } from "../components/Showreel";
import { Services } from "../components/Services";
import { Projects } from "../components/Projects";
import { About } from "../components/About";
import { Contact } from "../components/Contact";

export const Home = () => {
  return (
    <>
      <Hero />
      <SectionDivider />
      <Showreel />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Contact />
    </>
  );
};
