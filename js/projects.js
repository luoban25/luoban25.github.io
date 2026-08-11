(() => {
  "use strict";

  const workProjects = [
    {
      slug: "echoes",
      number: "01",
      title: "ECHOES OF SILENCE",
      year: "2026",
      technology: "DIGITAL COMPOSITION",
      category: "VISUAL",
      description: "A quiet study of fragmented light and incomplete coordinates, composed as an editorial image field.",
      previewType: "image",
      embedUrl: "./assets/echoes-DGZS_zVb.png",
      detailUrl: "./project.html?slug=echoes",
      accent: "#a9acb4",
    },
    {
      slug: "wave-physics",
      number: "02",
      title: "WAVE PHYSICS LOADER",
      shortTitle: "WAVE PHYSICS",
      year: "2026",
      technology: "CANVAS / PHYSICS",
      category: "SIMULATION",
      description: "Designed cosine waves and restrained physical residuals carry a bouncing body across responsive columns.",
      previewType: "iframe",
      embedUrl: "./wave-physics-loader.html?embed=1&instance=works&theme=light",
      detailUrl: "./project.html?slug=wave-physics",
      accent: "#111111",
    },
    {
      slug: "spectra",
      number: "03",
      title: "SPECTRA",
      year: "2026",
      technology: "WEBGL / GLSL",
      category: "MATERIAL",
      description: "One responsive liquid material explored through six chromatic identities, from soft warmth to electric contrast.",
      previewType: "iframe",
      embedUrl: "./spectra-card/index.html?embed=1",
      detailUrl: "./project.html?slug=spectra",
      accent: "#ff6a7e",
    },
    {
      slug: "archive",
      number: "04",
      title: "THE ARCHIVE",
      year: "2026",
      technology: "CANVAS PARTICLE SYSTEM",
      category: "SYSTEM",
      description: "A geometric object reconstructed from incomplete coordinates, shifting between certainty, memory and simulation.",
      previewType: "iframe",
      embedUrl: "./particle-cube.html",
      detailUrl: "./project.html?slug=archive",
      accent: "#62656c",
    },
  ];

  const skillProjects = [
    {
      ...workProjects[1],
      number: "01",
      filters: ["visual", "simulation"],
      staticPreview: "./images/skills/wave-physics.jpg",
    },
    {
      slug: "fluid-dropdown",
      number: "02",
      title: "FLUID DROPDOWN",
      year: "2026",
      technology: "VUE 3 / UI INPUT",
      category: "UI / INPUT",
      filters: ["interaction", "system"],
      description: "A compact input study with fluid reveal motion, magnetic response and complete keyboard navigation.",
      previewType: "component",
      component: "fluid-dropdown",
      detailUrl: "./project.html?slug=fluid-dropdown",
      accent: "#111111",
    },
    {
      ...workProjects[2],
      number: "03",
      filters: ["visual", "generative"],
      staticPreview: "./images/skills/spectra.jpg",
    },
    {
      ...workProjects[3],
      number: "04",
      filters: ["visual", "generative", "system"],
      staticPreview: "./images/skills/archive.jpg",
    },
  ];

  const spectraProjects = [
    ["spectra-original", "01", "ORIGINAL", "./spectra-card/index.html?embed=1", ["#ff6a7e", "#ff8665", "#ffc2cf"]],
    ["spectra-ocean", "02", "OCEAN", "./spectra-card/spectra-blue.html?embed=1", ["#3157ff", "#37d7d2", "#8265ff"]],
    ["spectra-klein", "03", "KLEIN", "./spectra-card/spectra-klein.html?embed=1", ["#f05a18", "#070b13", "#173eae"]],
    ["spectra-ultraviolet", "04", "ULTRAVIOLET", "./spectra-card/spectra-violet-lime.html?embed=1", ["#858ae3", "#613dc1", "#d7f204"]],
    ["spectra-chrome", "05", "CHROME", "./spectra-card/spectra-chrome.html?embed=1", ["#151922", "#a8adb7", "#f4f4f6"]],
    ["spectra-plus", "06", "PLUS", "./spectra-card/spectra-plus.html?embed=1", ["#ff335b", "#ff7a21", "#f6c431"]],
  ].map(([slug, number, title, embedUrl, palette]) => ({
    slug,
    number,
    title,
    year: "2026",
    technology: "WEBGL / GLSL",
    category: "CHROMATIC MATERIAL",
    description: `${title} treats color as a living system: a responsive fluid surface that keeps folding, breathing and reorganising in real time.`,
    previewType: "iframe",
    embedUrl,
    detailUrl: `./project.html?slug=${slug}`,
    palette,
    accent: palette[0],
  }));

  const projectIndex = {};
  [...workProjects, ...skillProjects, ...spectraProjects].forEach((project) => {
    projectIndex[project.slug] = project;
  });

  window.AICreativeLabData = Object.freeze({
    workProjects: Object.freeze(workProjects),
    skillProjects: Object.freeze(skillProjects),
    spectraProjects: Object.freeze(spectraProjects),
    projectIndex: Object.freeze(projectIndex),
    skillFilters: Object.freeze(["all", "visual", "simulation", "interaction", "generative", "system"]),
  });
})();
