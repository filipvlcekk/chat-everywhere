import { NextApiRequest, NextApiResponse } from 'next';

import {
  fetchUserProfileWithAccessTokenServerless,
  unauthorizedResponseServerless,
} from '@/utils/server/auth';
import { getBucket } from '@/utils/server/gcpBucket';

import { v4 as uuidv4 } from 'uuid';

export const config = {
  maxDuration: 60,
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { body, method } = req;
  if (method !== 'POST') {
    return res.status(405).json('Method not allowed');
  }
  const fileName = body.fileName;

  if (!fileName) {
    return res.status(400).json('File name is required');
  }

  const userProfile = await fetchUserProfileWithAccessTokenServerless(req);

  if (!userProfile || userProfile.plan !== 'ultra')
    return unauthorizedResponseServerless(res);

  const folderPath = userProfile.id;
  const randomUUID = uuidv4();
  const fileWithPath = `${folderPath}/${fileName}_${randomUUID}`;

  const bucket = await getBucket();
  const file = bucket.file(fileWithPath);

  const options = {
    expires: Date.now() + 5 * 60 * 1000,
    fields: {
      'x-goog-meta-user-id': userProfile.id,
      'x-goog-meta-file-name': fileName,
    },
  };
  const [response] = await file.generateSignedPostPolicyV4(options);
  return res.status(200).json(response);
}
