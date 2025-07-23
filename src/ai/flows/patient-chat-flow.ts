"use server";
/**
 * @fileOverview A patient assistance chatbot.
 *
 * - patientChat - A function that handles the patient's chat queries.
 * - PatientChatInput - The input type for the patientChat function.
 * - PatientChatOutput - The return type for the patientChat function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { getLocationTool } from "../tools/location-tool";

const PatientChatInputSchema = z.object({
  query: z.string().describe("The patient query."),
  latitude: z.number().optional().describe("The user's current latitude."),
  longitude: z.number().optional().describe("The user's current longitude."),
});
export type PatientChatInput = z.infer<typeof PatientChatInputSchema>;

const PatientChatOutputSchema = z.object({
  response: z.string().describe("The AI's response to the patient's query."),
});
export type PatientChatOutput = z.infer<typeof PatientChatOutputSchema>;

export async function patientChat(
  input: PatientChatInput
): Promise<PatientChatOutput> {
  return patientChatFlow(input);
}

const prompt = ai.definePrompt({
  name: "patientChatPrompt",
  input: { schema: PatientChatInputSchema },
  output: {
    schema: PatientChatOutputSchema,
    format: "json",
  },
  tools: [getLocationTool],
  config: {
    temperature: 0.7,
    topP: 0.9,
    topK: 40,
    maxOutputTokens: 1000,
  },
  prompt: `You are a helpful and empathetic AI, acting as a certified doctor.
Your role is to provide informative and safe medical information to patients.
While you can offer general advice and explanations of medical concepts, you must always prioritize patient safety.

IMPORTANT: You must always respond with a valid JSON object containing a "response" field with your answer.

If the user asks to find doctors, hospitals, or clinics near them, you should use the 'getUserLocation' tool to get their coordinates and nearby healthcare facilities.
The location tool will automatically provide nearby hospitals and clinics with their details.

When displaying nearby healthcare facilities, format them as a clear, structured list with the following information:
- Hospital/Clinic name
- Type of facility
- Address
- Phone number
- Distance from user
- Direct links for maps and directions

Format example:
**Nearby Healthcare Facilities:**

🏥 **[Hospital Name](Google Maps URL)**
- Type: Multi-Specialty Hospital
- Address: Full Address
- Phone: Phone Number
- Distance: X.X km
- [Get Directions](Directions URL)

You must not provide a definitive diagnosis or prescribe medication.
Always preface advice with a disclaimer like "As an AI, I cannot provide a diagnosis, but..." and conclude by strongly recommending the patient consult with a human healthcare professional for a formal diagnosis and treatment plan.

For location-based queries, acknowledge the user's location (city, region) and provide relevant nearby facilities.

Always ensure your response is helpful, informative, and includes appropriate medical disclaimers.

Patient's question: {{{query}}}
User's location (if provided): latitude: {{{latitude}}}, longitude: {{{longitude}}}

Respond with a JSON object containing your medical advice in the "response" field.`,
});

const patientChatFlow = ai.defineFlow(
  {
    name: "patientChatFlow",
    inputSchema: PatientChatInputSchema,
    outputSchema: PatientChatOutputSchema,
  },
  async (input) => {
    try {
      const result = await prompt(input);

      // Handle various possible null/undefined cases
      if (!result || !result.output || typeof result.output !== "object") {
        console.warn("Invalid prompt result:", result);
        return {
          response:
            "I apologize, but I'm experiencing technical difficulties right now. Please try asking your question again, or consider consulting with a healthcare professional directly for immediate assistance.",
        };
      }

      const { output } = result;

      // Handle null or undefined output response
      if (!output.response || typeof output.response !== "string") {
        console.warn("Invalid output response:", output);
        return {
          response:
            "I apologize, but I'm experiencing technical difficulties right now. Please try asking your question again, or consider consulting with a healthcare professional directly for immediate assistance.",
        };
      }

      return output;
    } catch (error) {
      console.error("Error in patientChatFlow:", error);

      // Return a safe fallback response
      return {
        response:
          "I'm sorry, I'm having trouble processing your request right now. For immediate medical concerns, please contact your healthcare provider or emergency services. You can try asking your question again in a moment.",
      };
    }
  }
);
