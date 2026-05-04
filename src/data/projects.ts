 export interface Project {
  id: string;
  projectId: string; // URL slug
  title: string;
  category: string;
  client: string | null;
  year: string | null;
  award?: string;
  description: string;
  thumbnailUrl: string; // Image for the grid
  videoEmbed?: string; // YouTube embed URL
  galleryVideoUrls?: string[]; // Additional Vimeo URLs for Behind the Scenes
  galleryImageUrls?: string[]; // Additional images
}

export const projects: Project[] = [
  {
    id: "01",
    projectId: "house-of-david-season-1",
    title: "House of David Season 1",
    category: "Compositing",
    client: "Amazon MGM Studios",
    year: "2025",
    award: "Director's Guild of Canada Award",
    description: "The once-mighty King Saul falls victim to his own pride, as an outcast shepherd boy, David, is anointed as the second king.",
    thumbnailUrl: "/projects/house-of-david-season-1.webp",
    galleryImageUrls: []
  },
  {
    id: "02",
    projectId: "leo",
    title: "Leo",
    category: "Creature FX(CFX)",
    client: "Netflix Animation Studios",
    year: "2023",
    award: "Annie Award; Family Film Awards; Kids choice awards, USA; HPA Award",
    description: "A 74-year-old lizard named Leo and his turtle friend decide to escape from the terrarium of a Florida school classroom where they have been living for decades.",
    thumbnailUrl: "/projects/leo.webp",
    galleryImageUrls: [],
  },
  {
    id: "03",
    projectId: "superman-and-lois-season-3",
    title: "Superman and Lois Season 3",
    category: "Compositing",
    client: "Warner Bros",
    year: "2023",
    award: "Dan Curtis Legacy Award; Saturn Award",
    description: "The world's most famous superhero and comic books' most famous journalist face the pressures and complexities that come with balancing work, justice, and parenthood in today's society.",
    thumbnailUrl: "/projects/superman-and-lois-season-3.webp",
    galleryImageUrls: [],
  },
  {
    id: "04",
    projectId: "bad-monkey",
    title: "Bad Monkey",
    category: "Compositing",
    client: "Apple TV",
    year: "2024",
    award: "-",
    description: "A detective turned restaurant inspector in Key West is pulled into a world of greed and corruption after a tourist finds a severed arm while fishing. And yes, there's a monkey.",
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
    award: "People Choice Award, USA; AACTA Award",
    description: "On an island of haves and have-nots, teen John B enlists his three best friends to hunt for a legendary treasure linked to his father's disappearance.",
    thumbnailUrl: "/projects/outer-banks-season-3.webp",
    galleryImageUrls: [],
  },
  {
    id: "06",
    projectId: "under-wraps-2",
    title: "Under Wraps 2",
    category: "Compositing",
    client: "Disney",
    year: "2022",
    description: "While Amy is preparing for her father's Halloween-themed wedding, she, Gilbert and Marshall discover that Harold and Rose may be in danger. An evil mummy is unexpectedly awakened and out for revenge.",
    thumbnailUrl: "/projects/under-wraps-2.webp",
    galleryImageUrls: [],
  },
  {
    id: "07",
    projectId: "project-car-chase",
    title: "Project Car Chase",
    category: "CGI & Animation",
    client: "Personal Project",
    year: "2026",
    description: "A high-octane vehicle sequence featuring photorealistic practical effects, environment extensions, and invisible compositing work across hundreds of shots.",
    videoEmbed: "https://www.youtube.com/embed/CTP3JAeZN0I?controls=0&modestbranding=1&rel=0",
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
