import {
  firebaseAdmin,
  getToken,
  getUser,
  verifySession,
} from "$lib/Firebase/firebase.server";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import type { DecodedIdToken } from "firebase-admin/auth";

export const POST = (async ({ request, cookies }) => {
  const authorized = await verifySession(cookies.get("__session"));

  if (authorized) {
    const token: DecodedIdToken = (await getToken(
      cookies.get("__session") as string,
    )) as DecodedIdToken;

    await firebaseAdmin.getAuth().revokeRefreshTokens(token.sub); //tldr signs out all devices

    cookies.delete("session", { path: "/" });

    return json({ deletion: "success" });
  } else {
    throw error(403, "AUTHORIZED");
  }
}) satisfies RequestHandler;
