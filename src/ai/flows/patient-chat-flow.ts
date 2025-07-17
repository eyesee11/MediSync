
'use server';
/**
 * @fileOverview A patient assistance chatbot.
 *
 * - patientChat - A function that handles the patient's chat queries.
 * - PatientChatInput - The input type for the patientChat function.
 * - PatientChatOutput - The return type for the patientChat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getLocationTool } from '../tools/location-tool';

const PatientChatInputSchema = z.object({
  query: z.string().describe('The patient query.'),
  latitude: z.number().optional().describe("The user's current latitude."),
  longitude: z.number().optional().describe("The user's current longitude."),
});
export type PatientChatInput = z.infer<typeof PatientChatInputSchema>;

const PatientChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the patient's query."),
});
export type PatientChatOutput = z.infer<typeof PatientChatOutputSchema>;

export async function patientChat(input: PatientChatInput): Promise<PatientChatOutput> {
  return patientChatFlow(input);
}

const prompt = ai.definePrompt({
  name: 'patientChatPrompt',
  input: { schema: PatientChatInputSchema },
  output: { schema: PatientChatOutputSchema },
  tools: [getLocationTool],
  prompt: `You are a helpful and empathetic AI, acting as a certified doctor.
Your role is to provide informative and safe medical information to patients.
While you can offer general advice and explanations of medical concepts, you must always prioritize patient safety.

If the user asks to find doctors, hospitals, or clinics near them, you MUST use the 'getUserLocation' tool to get their coordinates.
If you have the user's location (latitude: {{{latitude}}}, longitude: {{{longitude}}}), use that information to answer their query about nearby facilities.
When providing information about nearby hospitals or clinics, format the response as a structured list and include a Google Maps link for directions for each item. For example:

Here are some hospitals near you:
*   [Hospital Name 1](https://www.google.com/maps/search/?api=1&query=Hospital+Name+1)
*   [Another Hospital](https://www.google.com/maps/search/?api=1&query=Another+Hospital)
*   [Medical Center](https://www.google.com/maps/search/?api=1&query=Medical+Center)

You must provide markdown links for each location.

You must not provide a definitive diagnosis or prescribe medication.
Always preface advice with a disclaimer like "As an AI, I cannot provide a diagnosis, but..." and conclude by strongly recommending the patient consult with a human healthcare professional for a formal diagnosis and treatment plan.

Patient's question: {{{query}}}
`,
});

const patientChatFlow = ai.defineFlow(
  {
    name: 'patientChatFlow',
    inputSchema: PatientChatInputSchema,
    outputSchema: PatientChatOutputSchema,
  },
  async input => {
    const { output } = await prompt(input);
    return output!;
  }
);
