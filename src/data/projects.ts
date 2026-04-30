 export interface Project {
  id: string;
  projectId: string; // URL slug
  title: string;
  category: string;
  client: string | null;
  year: string | null;
  award?: string;
  description: string;
  heroVideoUrl: string; // Vimeo URL for the hero video
  thumbnailUrl: string; // Image for the grid
  videoEmbed?: string; // YouTube embed URL (overrides heroVideoUrl in detail view)
  galleryVideoUrls?: string[]; // Additional Vimeo URLs for Behind the Scenes
  galleryImageUrls?: string[]; // Additional images
}

export const projects: Project[] = [
  {
    id: "01",
    projectId: "house-of-david-season-1",
    title: "House of David Season 1",
    category: "CGI & Animation",
    client: "Amazon MGM Studios",
    year: "2025",
    award: "VES Award Winner",
    description: "An epic sci-fi adventure requiring extensive CGI environments, meticulous character animation, and groundbreaking simulations. Our team delivered over 200 VFX shots, creating highly detailed worlds and creatures that pushed the boundaries of visual fidelity.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "/projects/house-of-david-season-1.webp",
    galleryImageUrls: []
  },
  {
    id: "02",
    projectId: "leo",
    title: "Leo",
    category: "Environment Design",
    client: "Netflix",
    year: "2023",
    award: "BAFTA Nominated",
    description: "A cyberpunk thriller set in a sprawling, rain-slicked metropolis. We designed the entire cityscape from the ground up, blending procedural generation with handcrafted hero assets to create a dense, believable world dripping with atmosphere.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "/projects/leo.webp",
    galleryImageUrls: [],
  },
  {
    id: "03",
    projectId: "superman-and-lois-season-3",
    title: "Superman and Lois Season 3",
    category: "Simulation & VFX",
    client: "Warner Bros",
    year: "2023",
    award: "Academy Award Shortlist",
    description: "Deep-sea exploration featuring complex water dynamics, particulate rendering, and bioluminescent creature design. Our FX service developed novel fluid simulation pipelines to handle the massive scale and intricate interaction of the underwater environments.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "/projects/superman-and-lois-season-3.webp",
    galleryImageUrls: [],
  },
  {
    id: "04",
    projectId: "bad-monkey",
    title: "Bad Monkey",
    category: "Virtual Production",
    client: "Apple TV",
    year: "2024",
    award: "Cannes Selection",
    description: "Shot entirely on an LED volume, we provided real-time Unreal Engine environments and in-camera VFX. This project seamlessly blended physical sets with digital extensions, allowing for unprecedented creative freedom during principal photography.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "/projects/bad-monkey.webp",
    galleryImageUrls: [],
  },
  {
    id: "05",
    projectId: "outer-banks-season-3",
    title: "Outer Banks Season 3",
    category: "Compositing",
    client: "Netflix",
    year: "2023",
    description: "Seamless invisible effects and complex set extensions for a period drama piece, requiring historically accurate digital crowds and architectural replacements.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "/projects/outer-banks-season-3.webp",
    galleryImageUrls: [],
  },
  {
    id: "06",
    projectId: "under-wraps-2",
    title: "Under Wraps 2",
    category: "FX Simulation",
    client: "Disney",
    year: "2022",
    description: "Large scale destruction and pyro volumetric simulations rendered in Houdini, integrated seamlessly into live action plates.",
    heroVideoUrl: "https://player.vimeo.com/video/824804225?h=8fd15104be&title=0&byline=0&portrait=0",
    thumbnailUrl: "/projects/under-wraps-2.webp",
    galleryImageUrls: [],
  },
  {
    id: "07",
    projectId: "project-car-chase",
    title: "Project Car Chase",
    category: "FX Simulation",
    client: null,
    year: null,
    description: "A high-octane vehicle sequence featuring photorealistic practical effects, environment extensions, and seamless compositing work across hundreds of shots.",
    heroVideoUrl: "",
    videoEmbed: "https://www.youtube.com/embed/CTP3JAeZN0I",
    thumbnailUrl: "/projects/project-car-chase.webp",
    galleryImageUrls: [],
  }
];

export const getProjectBySlug = (slug?: string) => {
  return projects.find((p) => p.projectId === slug);
};

export const getFeaturedProjects = () => {
  return projects;
};
