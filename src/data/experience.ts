import { SkillNames } from "./skills";

export type Experience = {
    id: number;
    startDate: string;
    endDate: string;
    title: string;
    company: string;
    description: string[];
    skills: SkillNames[];
};

// TODO: Update with your actual experience details
export const EXPERIENCE: Experience[] = [
    {
        id: 1,
        startDate: "Jan 2024",
        endDate: "Present",
        title: "Full Stack Developer",
        company: "Your Current Company",
        description: [
            "Built and maintained scalable web applications using Next.js and React",
            "Implemented RESTful APIs and backend services with Node.js and PostgreSQL",
            "Collaborated with design team to create responsive, accessible UI components",
            "Optimized application performance, reducing load times by 40%",
        ],
        skills: [
            SkillNames.NEXTJS,
            SkillNames.TS,
            SkillNames.REACT,
            SkillNames.NODEJS,
            SkillNames.POSTGRES,
            SkillNames.TAILWIND,
        ],
    },
    {
        id: 2,
        startDate: "Jun 2022",
        endDate: "Dec 2023",
        title: "Software Developer Intern",
        company: "Previous Company",
        description: [
            "Developed full-stack features for internal tools and client-facing applications",
            "Created automated testing pipelines improving code quality and deployment speed",
            "Built interactive dashboards and data visualization tools",
            "Participated in code reviews and agile development processes",
        ],
        skills: [
            SkillNames.REACT,
            SkillNames.JS,
            SkillNames.NODEJS,
            SkillNames.MONGODB,
            SkillNames.GIT,
            SkillNames.DOCKER,
        ],
    },
    {
        id: 3,
        startDate: "Jan 2021",
        endDate: "May 2022",
        title: "Freelance Developer",
        company: "Self-employed",
        description: [
            "Designed and built custom websites for small businesses and startups",
            "Created responsive web applications with modern frontend frameworks",
            "Managed client relationships and delivered projects on schedule",
            "Implemented SEO best practices and analytics tracking",
        ],
        skills: [
            SkillNames.HTML,
            SkillNames.CSS,
            SkillNames.JS,
            SkillNames.REACT,
            SkillNames.FIREBASE,
            SkillNames.VERCEL,
        ],
    },
];
