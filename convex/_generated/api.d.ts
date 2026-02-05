import type {
  ApiFromModules,
} from "convex/server";
import type * as exams from "../exams.js";

export type API = ApiFromModules<{
  exams: typeof exams;
}>;

export declare const api: API;
export declare const internal: API;
