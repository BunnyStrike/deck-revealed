import type { NextApiRequest, NextApiResponse } from "next";
import { renderTrpcPanel } from "trpc-panel";
import { appRouter } from '@revealed/api'

const getBaseUrl = () => {
  return getEnvVar('VITE_VERCEL_URL') || 'https://revealed-tau.vercel.app' // ?? `http://localhost:3000` // dev SSR should use localhost
}

export default async function handler(_: NextApiRequest, res: NextApiResponse) {
  res.status(200).send(
    renderTrpcPanel(appRouter, {
      url: "http://localhost:3000/api/trpc",
      transformer: "superjson",
    })
  );
}