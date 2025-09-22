import jsPDF from 'jspdf';

interface Resource {
  label: string;
  href: string;
  type: string;
  category?: string;
}

interface Lesson {
  id: string;
  title: string;
  order: number;
  summary: string;
  whyItMatters: string;
  strategies: string[];
  resources?: Resource[];
}

interface Section {
  id: string;
  title: string;
  color: string;
  description: string;
  moduleIntroduction?: {
    summary: string;
    learningObjectives: string[];
    lessonOutline: string;
  };
  lessons: Lesson[];
}

interface CourseData {
  version: string;
  lastUpdated: string;
  title: string;
  description: string;
  sections: Section[];
}

export class BinderPDFGenerator {
  private doc: jsPDF;
  private currentY: number = 20;
  private pageHeight: number = 297; // A4 height in mm
  private pageWidth: number = 210; // A4 width in mm
  private margin: number = 20;
  private contentWidth: number;

  constructor() {
    this.doc = new jsPDF();
    this.contentWidth = this.pageWidth - (this.margin * 2);
  }

  private addNewPageIfNeeded(spaceNeeded: number = 20): void {
    if (this.currentY + spaceNeeded > this.pageHeight - this.margin) {
      this.doc.addPage();
      this.currentY = this.margin;
    }
  }

  private addText(text: string, fontSize: number = 11, isBold: boolean = false, isItalic: boolean = false): void {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', isBold ? 'bold' : (isItalic ? 'italic' : 'normal'));

    const lines = this.doc.splitTextToSize(text, this.contentWidth);
    const lineHeight = fontSize * 0.4;

    this.addNewPageIfNeeded(lines.length * lineHeight + 5);

    this.doc.text(lines, this.margin, this.currentY);
    this.currentY += lines.length * lineHeight + 5;
  }

  private addTitle(title: string, level: number = 1): void {
    const fontSize = level === 1 ? 18 : (level === 2 ? 16 : 14);
    this.addNewPageIfNeeded(30);
    this.currentY += level === 1 ? 10 : 5;
    this.addText(title, fontSize, true);
    this.currentY += 5;
  }

  private addSection(title: string): void {
    this.addNewPageIfNeeded(50);
    this.currentY += 10;
    this.doc.setFillColor(240, 240, 240);
    this.doc.rect(this.margin, this.currentY - 5, this.contentWidth, 15, 'F');
    this.addText(title, 16, true);
    this.currentY += 5;
  }

  private addBulletPoints(points: string[]): void {
    points.forEach(point => {
      this.addText(`• ${point}`, 11);
    });
    this.currentY += 5;
  }

  private addTableOfContents(courseData: CourseData): void {
    this.addTitle('Table of Contents');
    this.currentY += 10;

    // Page numbers would be handled here if needed

    courseData.sections.forEach((section, sectionIndex) => {
      this.addText(`${sectionIndex + 1}. ${section.title}`, 12, true);
      this.currentY += 3;

      section.lessons.forEach((lesson, lessonIndex) => {
        this.addText(`   ${sectionIndex + 1}.${lessonIndex + 1} ${lesson.title}`, 11);
        this.currentY += 2;
      });

      this.currentY += 5;
    });

    this.doc.addPage();
    this.currentY = this.margin;
  }

  private addCoverPage(courseData: CourseData): void {
    // Title
    this.currentY = 60;
    this.doc.setFontSize(24);
    this.doc.setFont('helvetica', 'bold');
    const titleLines = this.doc.splitTextToSize(courseData.title, this.contentWidth);
    this.doc.text(titleLines, this.margin, this.currentY, { align: 'left' });
    this.currentY += titleLines.length * 10 + 20;

    // Description
    this.addText(courseData.description, 14);
    this.currentY += 20;

    // Version info
    this.addText(`Version: ${courseData.version}`, 12);
    this.addText(`Last Updated: ${courseData.lastUpdated}`, 12);

    // Generated info
    this.currentY += 30;
    this.addText(`Generated on: ${new Date().toLocaleDateString()}`, 11, false, true);

    this.doc.addPage();
    this.currentY = this.margin;
  }

  public async generatePDF(courseData: CourseData): Promise<void> {
    // Cover page
    this.addCoverPage(courseData);

    // Table of contents
    this.addTableOfContents(courseData);

    // Content
    courseData.sections.forEach((section, sectionIndex) => {
      // Section header
      this.addSection(`${sectionIndex + 1}. ${section.title}`);
      this.addText(section.description, 12);
      this.currentY += 5;

      // Module introduction if available
      if (section.moduleIntroduction) {
        this.addTitle('Module Introduction', 3);
        this.addText(section.moduleIntroduction.summary, 11);
        this.currentY += 5;

        if (section.moduleIntroduction.learningObjectives?.length > 0) {
          this.addTitle('Learning Objectives', 3);
          this.addBulletPoints(section.moduleIntroduction.learningObjectives);
        }

        if (section.moduleIntroduction.lessonOutline) {
          this.addTitle('Lesson Outline', 3);
          this.addText(section.moduleIntroduction.lessonOutline, 11);
          this.currentY += 10;
        }
      }

      // Lessons
      section.lessons.forEach((lesson, lessonIndex) => {
        this.addTitle(`${sectionIndex + 1}.${lessonIndex + 1} ${lesson.title}`, 2);

        if (lesson.summary) {
          this.addTitle('Summary', 3);
          this.addText(lesson.summary, 11);
        }

        if (lesson.whyItMatters) {
          this.addTitle('Why It Matters', 3);
          this.addText(lesson.whyItMatters, 11);
        }

        if (lesson.strategies?.length > 0) {
          this.addTitle('Key Strategies', 3);
          this.addBulletPoints(lesson.strategies);
        }

        if (lesson.resources?.length > 0) {
          this.addTitle('Resources', 3);
          lesson.resources.forEach(resource => {
            this.addText(`• ${resource.label}${resource.category ? ` (${resource.category})` : ''}`, 11);
          });
          this.currentY += 5;
        }

        this.currentY += 10;
      });

      // Add some space between sections
      this.currentY += 15;
    });

    // Save the PDF
    this.doc.save('EAP_Facilitator_Development_Binder.pdf');
  }
}

export async function generateBinderPDF(): Promise<void> {
  try {
    const response = await fetch('/data/course.json');
    const courseData: CourseData = await response.json();

    const generator = new BinderPDFGenerator();
    await generator.generatePDF(courseData);

    console.log('PDF generated successfully!');
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
}