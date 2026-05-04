interface Service {
  name: string;
  description: string;
}

export interface ServiceCategory {
  category: string;
  services: Service[];
}

export const servicesData: ServiceCategory[] = [
  {
    category: "VFX COMPOSITING",
    services: [
      {
        name: "Split Screen",
        description:
          "Combining two or more separately shot plates into a single composite frame, with precision-matched lighting, motion, and perspective across every element.",
      },
      {
        name: "Keying",
        description:
          "Extracting foreground subjects from green or blue screen footage using advanced matte extraction techniques that preserve fine detail in hair, translucent fabrics, and atmospheric elements.",
      },
      {
        name: "CG Integration",
        description:
          "Embedding computer-generated characters, vehicles, and structures into live-action plates with physically accurate lighting, shadow, and motion matching to the original acquisition.",
      },
      {
        name: "Screen Replacement",
        description:
          "Replacing in-camera displays and monitor surfaces with dynamic digital content, precisely planar-tracked and relighting-matched to the practical environment.",
      },
      {
        name: "Set Extension",
        description:
          "Expanding practical sets and locations beyond their physical boundaries using photorealistic digital environment builds that are indistinguishable from what was captured on the day.",
      },
      {
        name: "Composite",
        description:
          "Merging CG renders, matte paintings, practical elements, and atmospheric passes into a final unified image with full colour, light, and depth integration.",
      },
    ],
  },
  {
    category: "CGI & 3D",
    services: [
      {
        name: "FX / Simulation",
        description:
          "Physically accurate simulations of fire, water, smoke, cloth, destruction, and large-scale environmental dynamics built for hero-quality close-up scrutiny.",
      },
      {
        name: "CFX",
        description:
          "Character effects including hero-quality hair, fur, feathers, and dynamic clothing that respond correctly to performance, wind, and interaction forces.",
      },
      {
        name: "3D Animation",
        description:
          "Keyframe and motion-capture-driven character and object performance delivered at feature-film quality, with full rig control and contact/secondary motion.",
      },
      {
        name: "Environment",
        description:
          "Fully CG environments built for primary camera passes — terrain, architecture, vegetation, and sky — constructed to hold up in any lighting condition or lens.",
      },
    ],
  },
  {
    category: "PAINT & CLEAN UP",
    services: [
      {
        name: "Beauty",
        description:
          "Per-frame digital retouching of talent skin, texture, and blemishes across moving footage, maintaining natural motion and avoiding the telltale softness of over-processed imagery.",
      },
      {
        name: "Wire / Rig Removal",
        description:
          "Digitally erasing wires, harnesses, cable rigs, and mechanical supports used on set, with full background reconstruction from adjacent frames and clean plates.",
      },
      {
        name: "Crew / Object Removal",
        description:
          "Removing incidental crew, equipment, vehicles, or unwanted set elements from shots, backed by clean-plate reference and motion-compensated background infill.",
      },
      {
        name: "Digital Make-Up",
        description:
          "Applying or modifying cosmetic looks digitally — ageing, wounds, tattoos, and continuity corrections — tracked accurately across cuts throughout a sequence.",
      },
      {
        name: "Clean Plate",
        description:
          "Generating pristine, empty reference frames of background elements by frame-blending, rotoscoping, and painting — the foundation for nearly every compositing workflow.",
      },
      {
        name: "Dust",
        description:
          "Frame-by-frame remediation of sensor dust, lens artifacts, film grain anomalies, and acquisition defects that require surgical per-pixel correction across footage.",
      },
    ],
  },
  {
    category: "EDITING",
    services: [
      {
        name: "Video Editing",
        description:
          "Picture assembly and pacing from raw acquisition through locked cut for narrative, documentary, commercial, and episodic content, with full media management and offline-to-online conform.",
      },
      {
        name: "Digital Intermediate (DI)",
        description:
          "Colour grading, HDR mastering, and deliverable preparation for all broadcast, streaming, and theatrical specifications including Dolby Vision, HDR10, and P3 D65.",
      },
      {
        name: "Motion Graphics",
        description:
          "Designing and animating graphic elements — titles, lower-thirds, infographics, and transitions — integrated with live-action or produced as standalone broadcast packages.",
      },
    ],
  },
  {
    category: "PRODUCTION (ON-SET)",
    services: [
      {
        name: "Data Wrangling",
        description:
          "On-set ingestion, verification, and redundant backup of all camera and audio media to approved RAID and offsite cloud standards, with daily delivery reports and metadata archiving.",
      },
      {
        name: "VFX Supervision",
        description:
          "Senior creative and technical oversight of all VFX requirements during principal photography, ensuring the director's vision is achievable in post and that every shot is acquired correctly.",
      },
      {
        name: "Cinematography",
        description:
          "Director of photography services covering camera strategy, lens selection, and lighting design for narrative and commercial productions, from pre-production planning through final day.",
      },
      {
        name: "Photography",
        description:
          "Unit stills and campaign photography integrated within the production schedule, delivering high-resolution master files retouched to final campaign or press-ready standard.",
      },
    ],
  },
  {
    category: "MATCHMOVE",
    services: [
      {
        name: "Camera Tracking",
        description:
          "Solving precise 3D camera path, focal length, and lens distortion data from live-action footage to enable geometrically accurate placement of CG elements within the scene.",
      },
      {
        name: "2D Tracking",
        description:
          "Planar and point-based tracking for screen replacements, stabilisation, and any compositing element that must move in locked reference to specific surfaces or features within the frame.",
      },
    ],
  },
  {
    category: "PRE-VISUALISATION",
    services: [
      {
        name: "Concept Art",
        description:
          "Original visual development illustrating environments, characters, creatures, and key sequences ahead of production — defining creative direction before a single frame is shot.",
      },
      {
        name: "Matte Painting",
        description:
          "High-resolution digital paintings used as photorealistic environment extensions, distant landscapes, and background replacement elements rendered at full production quality.",
      },
      {
        name: "Storyboard",
        description:
          "Sequential panel illustrations capturing shot composition, camera movement, staging, and narrative flow for pre-production planning and on-set communication.",
      },
    ],
  },
  {
    category: "WEB DEVELOPMENT",
    services: [
      {
        name: "Website Design",
        description:
          "Custom website design and development services for creative professionals, agencies, and studios in the film, television, and commercial production industries.",
      },
      {
        name: "Backend Development",
        description:
          "Server-side development for content management systems, media asset management, and custom web applications tailored to the needs of production companies and creative agencies.",
      },
    ],
  },
];
