 export interface Project {
  id: string;
  projectId: string; // URL slug
  title: string;
  category: string;
  client: string;
  year: string;
  award?: string;
  description: string;
  heroVideoUrl: string; // Vimeo URL for the hero video
  thumbnailUrl: string; // Image for the grid
  galleryVideoUrls?: string[]; // Additional Vimeo URLs for Behind the Scenes
  galleryImageUrls?: string[]; // Additional images
}

// These are placeholders based on the home page projects.
// The client can update this file easily when new projects arrive.
export const projects: Project[] = [
  {
    id: "01",
    projectId: "project-alpha",
    title: "Project Alpha",
    category: "CGI & Animation",
    client: "Netflix",
    year: "2025",
    award: "VES Award Winner",
    description: "An epic sci-fi adventure requiring extensive CGI environments, meticulous character animation, and groundbreaking simulations. Our team delivered over 200 VFX shots, creating highly detailed worlds and creatures that pushed the boundaries of visual fidelity.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0", // Replace with actual Vimeo ID
    thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    galleryImageUrls: [
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop",
    ]
  },
  {
    id: "02",
    projectId: "neon-echoes",
    title: "Neon Echoes",
    category: "Environment Design",
    client: "Warner Bros",
    year: "2025",
    award: "BAFTA Nominated",
    description: "A cyberpunk thriller set in a sprawling, rain-slicked metropolis. We designed the entire cityscape from the ground up, blending procedural generation with handcrafted hero assets to create a dense, believable world dripping with atmosphere.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2564&auto=format&fit=crop",
    galleryImageUrls: [],
  },
  {
    id: "03",
    projectId: "abyssal-plain",
    title: "Abyssal Plain",
    category: "Simulation & VFX",
    client: "Sony Pictures",
    year: "2024",
    award: "Academy Award Shortlist",
    description: "Deep-sea exploration featuring complex water dynamics, particulate rendering, and bioluminescent creature design. Our FX service developed novel fluid simulation pipelines to handle the massive scale and intricate interaction of the underwater environments.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=2574&auto=format&fit=crop",
    galleryImageUrls: [],
  },
  {
    id: "04",
    projectId: "star-dust",
    title: "Star Dust",
    category: "Virtual Production",
    client: "A24",
    year: "2024",
    award: "Cannes Selection",
    description: "Shot entirely on an LED volume, we provided real-time Unreal Engine environments and in-camera VFX. This project seamlessly blended physical sets with digital extensions, allowing for unprecedented creative freedom during principal photography.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2048&auto=format&fit=crop",
    galleryImageUrls: [],
  },
  // Placeholders for full archive list
  {
    id: "05",
    projectId: "chronos-drift",
    title: "Chronos Drift",
    category: "Compositing",
    client: "HBO",
    year: "2023",
    description: "Seamless invisible effects and complex set extensions for a period drama piece, requiring historically accurate digital crowds and architectural replacements.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?q=80&w=2564&auto=format&fit=crop",
    galleryImageUrls: [],
  },
  {
    id: "06",
    projectId: "solar-flare",
    title: "Solar Flare",
    category: "FX Simulation",
    client: "Amazon Studios",
    year: "2023",
    description: "Large scale destruction and pyro volumetric simulations rendered in Houdini, integrated seamlessly into live action plates.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?q=80&w=2564&auto=format&fit=crop",
    galleryImageUrls: [],
  }
];

export const getProjectBySlug = (slug?: string) => {
  return projects.find((p) => p.projectId === slug);
};

export const getFeaturedProjects = () => {
  return projects.slice(0, 4); // First 4
};
