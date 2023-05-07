import { nanoid } from "nanoid";
import { db } from "../../lib/fsdb";
import { generateRoomName } from "../../lib/utils";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const token = nanoid(128);

  const tokens = req.cookies.noteTokens
    ? req.cookies.noteTokens.split(",")
    : [];

  tokens.push(token);

  const cookie = serialize("noteTokens", tokens.join(","), {
    path: "/",
  });
  res.setHeader("Set-Cookie", cookie);

  const key = generateRoomName();
  await db.set(key, {
    token,
    content: "",
  });
  res.redirect(`/${key}`);
};
