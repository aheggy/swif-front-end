import axios from "axios";
import { structure, structureExample } from "./StudyGuideStructure";

export async function getCompletionAxios(prompt) {
	try {
		const response = await axios.post(
			"https://api.openai.com/v1/completions",
			{
				model: "gpt-3.5-turbo-instruct",
				prompt: `
                generate a study guide with this structure:

                ${structure} 

                to learn this topic: ${prompt}

				make sure to separate each part of the structure by a ';', and don't mention the name of each part, just the content, here is a example:
				${structureExample}

				The text in parentheses like "(this is a Topic's Importance)" is just so you understand the example, you should not put it in the structure you give me
				
				that will make more easy to procesing in my program
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
		return undefined;
	}
}
