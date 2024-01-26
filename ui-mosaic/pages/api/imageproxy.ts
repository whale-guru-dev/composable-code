// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
// req: NextApiRequest
// https://www.akmittal.dev/posts/nextjs-image-use-any-domain/

import { NextApiRequest } from "next";

const imageApi = async (req: NextApiRequest, res: any) => {
  const url = decodeURIComponent(req.query.url as string);
  const result = await fetch(url);
  const body = result.body;

  if (body !== null) {
    (body as any).pipe(res);
  }
};

export default imageApi;
