import OpenAI from 'openai';

interface Summary {
  title: string;
  narrative: string;
  keyPoints: string[];
}

export async function generateSummary(transcription: string, apiKey: string, style: 'brief' | 'detailed' = 'brief'): Promise<Summary> {
  if (!transcription || transcription.trim().length === 0) {
    throw new Error('No transcription provided for summarization');
  }

  console.log('Generating summary for transcription:', transcription.substring(0, 100) + '...');

  const openai = new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const prompt = `Please analyze the following transcription and provide a summary with the following format:

Title: Generate a clear, descriptive title that captures the main topic or theme (max 60 characters)
Narrative: A ${style === 'brief' ? 'concise' : 'detailed'} summary of the main points and key takeaways
Key Points:
- First key point
- Second key point
[etc.]

Important: The title should be descriptive and meaningful, reflecting the actual content of the transcription.

Transcription:
${transcription}`;

  try {
    console.log('Sending request to OpenAI for summarization...');
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that creates clear, concise summaries. Always format your response exactly as requested, with Title, Narrative, and Key Points sections. The title should be meaningful and descriptive of the content.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    console.log('Received response from OpenAI:', content);

    // Parse the response
    const titleMatch = content.match(/Title:\s*([^\n]+)/);
    const narrativeMatch = content.match(/Narrative:\s*([^#]+)(?=Key Points:|$)/s);
    const keyPointsMatch = content.match(/Key Points:\s*((?:[-•]\s*[^\n]+\n*)+)/s);

    if (!titleMatch || !narrativeMatch || !keyPointsMatch) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse OpenAI response into expected format');
    }

    const title = titleMatch[1].trim();
    const narrative = narrativeMatch[1].trim();
    const keyPointsText = keyPointsMatch[1];
    const keyPoints = keyPointsText
      .split('\n')
      .map(point => point.replace(/^[-•]\s*/, '').trim())
      .filter(point => point.length > 0);

    // Ensure we have a valid title
    if (!title || title.length === 0) {
      throw new Error('Generated title is empty');
    }

    const summary = {
      title,
      narrative,
      keyPoints
    };

    console.log('Successfully generated summary:', summary);
    return summary;
  } catch (error) {
    console.error('Error generating summary:', error);
    throw new Error(`Failed to generate summary: ${error instanceof Error ? error.message : String(error)}`);
  }
}