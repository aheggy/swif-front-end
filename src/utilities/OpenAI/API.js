import axios from "axios";
import { structure, structureExample } from "./StudyGuideStructure";

export async function getCompletionAxios(prompt, studyDays, hoursPerDay, age, curriculumLevel) {
    try {
        const modifiedStructureExample = `
            Curriculum Level: ${curriculumLevel}
            Total Study Period and Average Daily Hours: ${studyDays * (hoursPerDay / 7).toFixed(1)} weeks, ${hoursPerDay} hours daily
            ${structureExample}`;

        const response = await axios.post(
            "https://api.openai.com/v1/completions",
            {
                model: "gpt-3.5-turbo-instruct",
                prompt: `
                    generate a study guide based on this example structure:

                    ${modifiedStructureExample}

                    to learn this topic: ${prompt}

                    Age of the learner: ${age}
                `,
                temperature: 0.7,
                max_tokens: 2048,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.REACT_APP_OPEN_AI_API_KEY}`,
                },
            }
        );
        return response;
    } catch (error) {
        console.error('Error fetching study guide:', error);
        return undefined;
    }
}
