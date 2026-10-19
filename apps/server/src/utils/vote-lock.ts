import type { Prisma } from "../generated/prisma/client";

const VOTE_WRITE_LOCK_KEY = 728001;

const acquireVoteWriteLock = async (
  tx: Prisma.TransactionClient,
): Promise<void> => {
  await tx.$executeRaw`SELECT pg_advisory_xact_lock(${VOTE_WRITE_LOCK_KEY})`;
};

export { VOTE_WRITE_LOCK_KEY, acquireVoteWriteLock };
