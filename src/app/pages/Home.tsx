import React from "react";
import { Hero } from "../components/Hero";
import { SectionDivider } from "../components/SectionDivider";
import { Showreel } from "../components/Showreel";
import { Departments } from "../components/Departments";
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
      <Departments />
      <SectionDivider />
      <Projects />
      <SectionDivider />
      <About />
      <SectionDivider />
      <Contact />
    </>
  );
};
