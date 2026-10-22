import axiosClient from '@api/axiosClient';
import { API_ENDPOINTS } from '@constants/api';
import { MAX_HISTORY_TURNS } from '@constants/aiPrompt';

export type ChatTurn = { role: 'user' | 'model'; text: string };

export const generateAiReply = async (prompt: string, history: ChatTurn[] = []): Promise<string> => {
  const response = await axiosClient.post<{ reply: string }>(API_ENDPOINTS.aiChat, {
    message: prompt,
    history: history.slice(-MAX_HISTORY_TURNS),
  }, { timeout: 60000 });
  return response.data.reply;
};

export default generateAiReply;
