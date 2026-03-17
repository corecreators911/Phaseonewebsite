import React, { Suspense, lazy } from "react";
import { Hero } from "../components/Hero";
import { SectionDivider } from "../components/SectionDivider";

const Showreel = lazy(() => import("../components/Showreel").then(m => ({ default: m.Showreel })));
const Departments = lazy(() => import("../components/Departments").then(m => ({ default: m.Departments })));
const Projects = lazy(() => import("../components/Projects").then(m => ({ default: m.Projects })));
const About = lazy(() => import("../components/About").then(m => ({ default: m.About })));
const Contact = lazy(() => import("../components/Contact").then(m => ({ default: m.Contact })));

export const Home = () => {
  return (
    <>
      <Hero />
      <Suspense fallback={null}>
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
      </Suspense>
    </>
  );
};
