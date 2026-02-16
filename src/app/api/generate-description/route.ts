import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Generate project description API
 * 
 * Per plan rules:
 * - Allowed: Clarity, Compression, Neutral tone
 * - Not Allowed: Feature invention, Impact inflation, Buzzwords
 * - Response: title, problem (≤20 words), solution (≤20 words), 
 *   impact (optional, measurable only), tags, primaryLanguage
 */

interface GenerateDescriptionRequest {
    repoUrl: string;
}

interface GenerateDescriptionResponse {
    title: string;
    problem: string;       // ≤20 words
    solution: string;      // ≤20 words
    impact: string | null; // Optional, measurable only
    tags: string[];
    primaryLanguage: string;
    aiGenerated: true;     // Always true for transparency
}

// Parse GitHub URL to extract owner and repo
function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
    const patterns = [
        /github\.com\/([^\/]+)\/([^\/\?#]+)/,
        /github\.com:([^\/]+)\/([^\/\?#]+)/,
    ];

    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match) {
            return {
                owner: match[1],
                repo: match[2].replace(/\.git$/, ''),
            };
        }
    }
    return null;
}

export async function POST(request: Request) {
    try {
        const body: GenerateDescriptionRequest = await request.json();
        const { repoUrl } = body;

        if (!repoUrl) {
            return NextResponse.json(
                { error: 'Repository URL is required' },
                { status: 400 }
            );
        }

        const geminiApiKey = process.env.GEMINI_API_KEY;
        const githubToken = process.env.GITHUB_TOKEN;

        if (!geminiApiKey) {
            return NextResponse.json(
                { error: 'GEMINI_API_KEY not configured. Add it to your .env file.' },
                { status: 500 }
            );
        }

        // Parse GitHub URL
        const parsed = parseGitHubUrl(repoUrl);
        if (!parsed) {
            return NextResponse.json(
                { error: 'Invalid GitHub URL format. Expected: https://github.com/owner/repo' },
                { status: 400 }
            );
        }

        const { owner, repo } = parsed;

        // Fetch repository metadata from GitHub
        const headers: HeadersInit = {
            'Accept': 'application/vnd.github.v3+json',
            'User-Agent': 'Portfolio-Description-Generator',
        };
        if (githubToken) {
            headers['Authorization'] = `Bearer ${githubToken}`;
        }

        // Fetch repo info
        const repoResponse = await fetch(
            `https://api.github.com/repos/${owner}/${repo}`,
            { headers }
        );

        if (!repoResponse.ok) {
            return NextResponse.json(
                { error: `Repository not found: ${owner}/${repo}` },
                { status: 404 }
            );
        }

        const repoData = await repoResponse.json();

        // Fetch README
        let readmeContent = '';
        try {
            const readmeResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/readme`,
                { headers }
            );
            if (readmeResponse.ok) {
                const readmeData = await readmeResponse.json();
                readmeContent = Buffer.from(readmeData.content, 'base64').toString('utf-8');
                // Limit to first 800 characters for context
                readmeContent = readmeContent.substring(0, 800);
            }
        } catch {
            // README not available
        }

        // Fetch languages
        let languages: string[] = [];
        try {
            const languagesResponse = await fetch(
                `https://api.github.com/repos/${owner}/${repo}/languages`,
                { headers }
            );
            if (languagesResponse.ok) {
                const languagesData = await languagesResponse.json();
                languages = Object.keys(languagesData);
            }
        } catch {
            // Languages not available
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(geminiApiKey);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        // Strict prompt per plan requirements
        const prompt = `You are a technical writer generating a project description for a developer portfolio.

STRICT RULES:
- Use NEUTRAL, FACTUAL tone only
- NO buzzwords, NO marketing language, NO exaggeration
- NO feature invention - only describe what actually exists
- NO impact inflation - only include measurable impact if data is available
- Be CONCISE and DIRECT

Repository: ${repoData.name}
Description: ${repoData.description || 'None provided'}
Primary Language: ${languages[0] || 'Unknown'}
Languages: ${languages.join(', ') || 'Not specified'}
Topics: ${(repoData.topics || []).join(', ') || 'None'}
Stars: ${repoData.stargazers_count}
Forks: ${repoData.forks_count}
README excerpt: ${readmeContent || 'Not available'}

Generate a JSON response with EXACTLY this structure:
{
  "problem": "What need or problem this project addresses. MAXIMUM 20 words. Be specific, not generic.",
  "solution": "What the project does technically. MAXIMUM 20 words. Describe the actual implementation.",
  "impact": "Measurable outcome if available (e.g., 'Used by X developers', 'Reduces Y by Z%'). Set to null if no measurable data available. NEVER fabricate metrics.",
  "tags": ["1-2 relevant tags from: Web, API, CLI, Data, DevOps, AI/ML, Mobile, Library, Tool"]
}

Respond ONLY with valid JSON. No markdown, no explanation, no code blocks.`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text().trim();

        // Parse the JSON response
        let parsedResponse;
        try {
            // Clean any potential markdown
            const cleanedText = text
                .replace(/```json\n?/g, '')
                .replace(/```\n?/g, '')
                .trim();
            parsedResponse = JSON.parse(cleanedText);
        } catch {
            console.error('Failed to parse Gemini response:', text);
            return NextResponse.json(
                { error: 'Failed to parse AI response. Please try again.' },
                { status: 500 }
            );
        }

        // Validate and construct response
        const descriptionResponse: GenerateDescriptionResponse = {
            title: repoData.name,
            problem: (parsedResponse.problem || '').slice(0, 200), // Safety limit
            solution: (parsedResponse.solution || '').slice(0, 200),
            impact: parsedResponse.impact || null,
            tags: Array.isArray(parsedResponse.tags) ? parsedResponse.tags.slice(0, 3) : [],
            primaryLanguage: languages[0] || 'Unknown',
            aiGenerated: true,
        };

        return NextResponse.json(descriptionResponse);
    } catch (error) {
        console.error('Generate description error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Failed to generate description' },
            { status: 500 }
        );
    }
}
