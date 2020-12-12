import {basename} from "path";
import {resolve} from "./utilities";
import fs from "fs";
import {sync as rimraf} from "rimraf";
import {execSync} from "child_process";

export default function cloner(folder: string, remote: string, name?: string) {
    name = name ?? basename(remote, ".git");
    const cloneFolder = resolve(folder, name);
    if (fs.existsSync(cloneFolder)) {
        try {
            rimraf(cloneFolder);
        }
        catch (ignored) {
            throw new Error("Failed to reset!");
        }
    }
    try {
        execSync("git clone " + remote + " " + name,
            {cwd: folder, stdio: "ignore", encoding: "utf8"});
    }
    catch (ignored) {
        throw new Error("Failed to clone!");
    }
}


