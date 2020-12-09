import slash from "slash";
import {resolve as _resolve} from "path";

export function resolve(...location: string[]): string {
    return slash(_resolve(...location));
}
