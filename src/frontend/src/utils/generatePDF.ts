import { type Project, SubscriptionStatus } from "../backend";

type GenerateFormat = "standard" | "ieee";

export async function generatePDF(
  project: Project,
  isPremium: boolean,
  format: GenerateFormat = "standard",
): Promise<void> {
  const jsPDFModule = await new Promise<any>((resolve, reject) => {
    if ((window as any).jspdf) {
      resolve((window as any).jspdf);
      return;
    }
    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
    script.onload = () => resolve((window as any).jspdf);
    script.onerror = reject;
    document.head.appendChild(script);
  });

  const { jsPDF } = jsPDFModule;
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = format === "ieee" ? 15 : 20;

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

  const addWatermark = () => {
    if (!isPremium) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(40);
      doc.setTextColor(200, 200, 200);
      doc.saveGraphicsState();
      doc.setGState(new (doc as any).GState({ opacity: 0.3 }));
      doc.text("FREE PLAN", pageWidth / 2, pageHeight / 2, {
        align: "center",
        angle: 45,
      });
      doc.restoreGraphicsState();
    }
  };

  if (format === "ieee") {
    await generateIEEEPDF(
      doc,
      project,
      isPremium,
      margin,
      pageWidth,
      pageHeight,
      domainLabel,
      addWatermark,
    );
  } else {
    await generateStandardPDF(
      doc,
      project,
      isPremium,
      margin,
      pageWidth,
      pageHeight,
      domainLabel,
      addWatermark,
    );
  }

  const suffix = format === "ieee" ? "_IEEE" : "";
  doc.save(`${project.title.replace(/\s+/g, "_")}${suffix}_Report.pdf`);
}

async function generateStandardPDF(
  doc: any,
  project: Project,
  _isPremium: boolean,
  margin: number,
  pageWidth: number,
  pageHeight: number,
  domainLabel: (d: any) => string,
  addWatermark: () => void,
) {
  let y = margin;
  const contentWidth = pageWidth - margin * 2;

  // Title page
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.setTextColor(15, 23, 42);
  const titleLines = doc.splitTextToSize(project.title, contentWidth);
  doc.text(titleLines, pageWidth / 2, 60, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105);
  doc.text(`Domain: ${domainLabel(project.domain)}`, pageWidth / 2, 80, {
    align: "center",
  });
  doc.text("Project Report", pageWidth / 2, 90, { align: "center" });

  addWatermark();
  doc.addPage();

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

  y = margin;
  for (const section of sections) {
    if (y > pageHeight - 40) {
      addWatermark();
      doc.addPage();
      y = margin;
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(30, 58, 138);
    doc.text(section.title, margin, y);
    y += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(30, 41, 59);
    const lines = doc.splitTextToSize(section.content, contentWidth);
    for (const line of lines) {
      if (y > pageHeight - 20) {
        addWatermark();
        doc.addPage();
        y = margin;
      }
      doc.text(line, margin, y);
      y += 5;
    }
    y += 8;
  }

  addWatermark();
}

async function generateIEEEPDF(
  doc: any,
  project: Project,
  _isPremium: boolean,
  margin: number,
  pageWidth: number,
  pageHeight: number,
  domainLabel: (d: any) => string,
  addWatermark: () => void,
) {
  const colGap = 5;
  const colWidth = (pageWidth - margin * 2 - colGap) / 2;
  let y = margin;

  // IEEE Header
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  const titleLines = doc.splitTextToSize(project.title, pageWidth - margin * 2);
  doc.text(titleLines, pageWidth / 2, y, { align: "center" });
  y += titleLines.length * 7 + 4;

  doc.setFont("times", "italic");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Author Name, Institution Name, City, Country", pageWidth / 2, y, {
    align: "center",
  });
  y += 5;
  doc.text(`Domain: ${domainLabel(project.domain)}`, pageWidth / 2, y, {
    align: "center",
  });
  y += 8;

  // Divider
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

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

  // Two-column layout
  let col = 0; // 0 = left, 1 = right
  let leftY = y;
  let rightY = y;

  const getColX = (c: number) =>
    c === 0 ? margin : margin + colWidth + colGap;

  for (const section of ieeeSections) {
    const currentY = col === 0 ? leftY : rightY;
    const colX = getColX(col);

    // Section header
    doc.setFont("times", "bold");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text(`${section.num} ${section.title.toUpperCase()}`, colX, currentY);
    let sectionY = currentY + 5;

    // Section content
    doc.setFont("times", "normal");
    doc.setFontSize(9);
    doc.setTextColor(30, 30, 30);
    const lines = doc.splitTextToSize(section.content, colWidth);

    for (const line of lines) {
      if (sectionY > pageHeight - 20) {
        if (col === 0) {
          leftY = sectionY;
          col = 1;
          sectionY = rightY;
        } else {
          // Both columns full, new page
          addWatermark();
          doc.addPage();
          leftY = margin;
          rightY = margin;
          col = 0;
          sectionY = margin;
        }
      }
      doc.text(line, getColX(col), sectionY);
      sectionY += 4.5;
    }

    sectionY += 5;
    if (col === 0) {
      leftY = sectionY;
    } else {
      rightY = sectionY;
    }

    // Alternate columns
    if (col === 0 && leftY > pageHeight * 0.5) {
      col = 1;
    } else if (col === 1 && rightY > pageHeight - 20) {
      addWatermark();
      doc.addPage();
      leftY = margin;
      rightY = margin;
      col = 0;
    }
  }

  addWatermark();
}
