import * as trpcExpress from "@trpc/server/adapters/express";
import { inferAsyncReturnType } from "@trpc/server";

const createContextInner = ({
	req,
	res,
}: trpcExpress.CreateExpressContextOptions) => {
	return {};
};

export const createContext = (
	opts: trpcExpress.CreateExpressContextOptions
) => {
	return createContextInner(opts);
};

export type Context = inferAsyncReturnType<typeof createContext>;
