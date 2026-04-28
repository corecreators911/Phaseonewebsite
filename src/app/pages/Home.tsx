import React from "react";
import { Hero } from "../components/Hero";
import { SectionDivider } from "../components/SectionDivider";
import { Showreel } from "../components/Showreel";
import { Services } from "../components/Services";
import { Crew } from "../components/Crew";
import { Projects } from "../components/Projects";
import { About } from "../components/About";
import { Contact } from "../components/Contact";

export const Home = () => {
  return (
    <>
      <Hero />
      <SectionDivider />
      <Services />
      <SectionDivider />
      <Crew />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <Showreel />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Contact />
    </>
  );
};
