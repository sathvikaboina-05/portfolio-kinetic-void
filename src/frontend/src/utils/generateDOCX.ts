import type { Project } from "../backend";

type GenerateFormat = "standard" | "ieee";

export function generateDOCX(
  project: Project,
  isPremium: boolean,
  format: GenerateFormat = "standard",
): void {
  const domainLabel = (d: any) => {
    const map: Record<string, string> = {
      cse: "CSE",
      aiml: "AI/ML",
      ds: "Data Science",
      iot: "IoT",
      cybersecurity: "Cybersecurity",
    };
    return map[d] || String(d);
  };

  const watermarkNotice = !isPremium
    ? "{\\pard\\qc\\b\\fs28 [FREE PLAN - UPGRADE FOR FULL ACCESS]\\par}\n"
    : "";

  let rtfContent = "";

  if (format === "ieee") {
    rtfContent = generateIEEERTF(project, domainLabel, watermarkNotice);
  } else {
    rtfContent = generateStandardRTF(project, domainLabel, watermarkNotice);
  }

  const blob = new Blob([rtfContent], { type: "application/rtf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const suffix = format === "ieee" ? "_IEEE" : "";
  a.download = `${project.title.replace(/\s+/g, "_")}${suffix}_Report.rtf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeRTF(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/\{/g, "\\{")
    .replace(/\}/g, "\\}")
    .replace(/\n/g, "\\par\n");
}

function generateStandardRTF(
  project: Project,
  domainLabel: (d: any) => string,
  watermarkNotice: string,
): string {
  const sections = [
    { title: "Abstract", content: project.generatedContent.abstract },
    { title: "Introduction", content: project.generatedContent.introduction },
    {
      title: "Literature Review",
      content: project.generatedContent.literature_review,
    },
    { title: "Methodology", content: project.generatedContent.methodology },
    { title: "System Design", content: project.generatedContent.system_design },
    { title: "Results", content: project.generatedContent.results },
    { title: "Discussion", content: project.generatedContent.discussion },
    { title: "References", content: project.generatedContent.references },
  ];

  let body = "";
  for (const section of sections) {
    body += `{\\pard\\sb240\\b\\fs26\\cf1 ${escapeRTF(section.title)}\\par}\n`;
    body += `{\\pard\\sb120\\fs20 ${escapeRTF(section.content)}\\par}\n`;
  }

  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fswiss\\fcharset0 Arial;}}
{\\colortbl;\\red30\\green58\\blue138;\\red0\\green0\\blue0;}
\\f0\\fs24\\widowctrl\\hyphauto
{\\pard\\qc\\b\\fs36\\cf1 ${escapeRTF(project.title)}\\par}
{\\pard\\qc\\fs24 Domain: ${escapeRTF(domainLabel(project.domain))}\\par}
{\\pard\\qc\\fs24 Project Report\\par}
${watermarkNotice}
{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par}
${body}
}`;
}

function generateIEEERTF(
  project: Project,
  domainLabel: (d: any) => string,
  watermarkNotice: string,
): string {
  const ieeeSections = [
    {
      num: "I.",
      title: "Abstract",
      content: project.generatedContent.abstract,
    },
    {
      num: "II.",
      title: "Introduction",
      content: project.generatedContent.introduction,
    },
    {
      num: "III.",
      title: "Literature Review",
      content: project.generatedContent.literature_review,
    },
    {
      num: "IV.",
      title: "Methodology",
      content: project.generatedContent.methodology,
    },
    {
      num: "V.",
      title: "System Design",
      content: project.generatedContent.system_design,
    },
    { num: "VI.", title: "Results", content: project.generatedContent.results },
    {
      num: "VII.",
      title: "Discussion",
      content: project.generatedContent.discussion,
    },
    {
      num: "VIII.",
      title: "References",
      content: `${project.generatedContent.references}\n[1] Author, "Title," Journal, vol. X, no. Y, pp. Z, Year.\n[2] Author, "Title," Conference, Year.`,
    },
  ];

  let body = "";
  for (const section of ieeeSections) {
    body += `{\\pard\\sb240\\b\\fs22\\cf1 ${escapeRTF(`${section.num} ${section.title.toUpperCase()}`)}\\par}\n`;
    body += `{\\pard\\sb120\\fs20 ${escapeRTF(section.content)}\\par}\n`;
  }

  return `{\\rtf1\\ansi\\deff0
{\\fonttbl{\\f0\\froman\\fcharset0 Times New Roman;}{\\f1\\fswiss\\fcharset0 Arial;}}
{\\colortbl;\\red0\\green0\\blue128;\\red0\\green0\\blue0;}
\\f0\\fs22\\widowctrl\\hyphauto
{\\pard\\qc\\b\\fs32\\cf1 ${escapeRTF(project.title)}\\par}
{\\pard\\qc\\i\\fs20 Author Name, Institution Name, City, Country\\par}
{\\pard\\qc\\fs20 Domain: ${escapeRTF(domainLabel(project.domain))}\\par}
${watermarkNotice}
{\\pard\\brdrb\\brdrs\\brdrw10\\brsp20 \\par}
${body}
}`;
}
