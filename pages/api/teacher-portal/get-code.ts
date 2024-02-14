import { getOneTimeCode, getUserProfile } from '@/utils/server/supabase';

export const config = {
  runtime: 'edge',
};

const unauthorizedResponse = new Response('Unauthorized', { status: 401 });

const handler = async (req: Request): Promise<Response> => {
  try {
    const userId = req.headers.get('user-id');
    const invalidate = req.headers.get('invalidate') === 'true';
    if (!userId) return unauthorizedResponse;
    const userProfile = await getUserProfile(userId);

    if (!userProfile || !userProfile.isTeacherAccount)
      return unauthorizedResponse;

    const teacherCode = await getOneTimeCode(userId, invalidate);
    if (!teacherCode) return new Response('Error', { status: 500 });
    const { code, expiresAt, tempAccountProfiles } = teacherCode;

    return new Response(
      JSON.stringify({ code, expiresAt, tempAccountProfiles }),
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return new Response('Error', { status: 500 });
  }
};

export default handler;
