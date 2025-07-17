
'use server';
/**
 * @fileOverview A Genkit tool for retrieving the user's location.
 */
import { ai } from '@/ai/genkit';
import { z } from 'genkit';

export const getLocationTool = ai.defineTool(
    {
        name: 'getUserLocation',
        description: "Gets the user's current physical location (latitude and longitude) to find nearby services.",
        inputSchema: z.object({}),
        outputSchema: z.object({
            latitude: z.number().describe('The latitude of the user.'),
            longitude: z.number().describe('The longitude of the user.'),
        }),
    },
    async () => {
        // This is a placeholder. In a real application, the frontend would provide
        // the location, and this tool would just pass it through or validate it.
        // The LLM uses this tool's description to know WHEN to ask for location,
        // and the frontend intercepts this to provide the actual browser coordinates.
        console.log("Location tool called by LLM. Frontend should provide location.");
        // We throw an error here to signal to the frontend that it needs to supply the location data.
        throw new Error('NEEDS_LOCATION');
    }
);
