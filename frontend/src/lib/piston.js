// Piston API client for code execution
const PISTON_API = 'https://emkc.org/api/v2/piston';

const languageMap = {
    javascript: 'javascript',
    python: 'python',
    java: 'java',
    cpp: 'c++',
};

export const executeCode = async (language, code) => {
    try {
        const response = await fetch(`${PISTON_API}/execute`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                language: languageMap[language] || language,
                version: '*',
                files: [
                    {
                        content: code,
                    },
                ],
            }),
        });

        const data = await response.json();

        if (data.run) {
            return {
                success: !data.run.stderr,
                output: data.run.stdout || data.run.stderr || 'No output',
                error: data.run.stderr,
            };
        }

        return {
            success: false,
            output: '',
            error: 'Failed to execute code',
        };
    } catch (error) {
        console.error('Code execution error:', error);
        return {
            success: false,
            output: '',
            error: error.message || 'Failed to execute code',
        };
    }
};
