import { pathToFileURL } from "node:url";
import { resolve as pathResolve } from "node:path";
export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) return nextResolve(pathToFileURL(pathResolve(specifier.slice(2) + ".js")).href, context);
  if (specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) {
    try { return await nextResolve(specifier + ".js", context); } catch {}
  }
  return nextResolve(specifier, context);
}
