import {resolve} from "./scripts/utilities";
import cloner from "./scripts/cloner";
import chalk from "chalk";
import {execSync} from "child_process";
import {sync as rimraf} from "rimraf";

console.log(chalk.blue("Setting up RepoMaker."));

const targetFolder = resolve(__dirname, "targets");
const outputFolder = resolve(__dirname, "civrepo");

// Clean repo folder
console.log("Resetting repo folder");
try {
    rimraf(outputFolder);
}
catch (error) {
    console.warn(chalk.yellow("Could not remove repo folder."));
    process.exit(1);
}

// Clone repo folder
try {
    console.log("Cloning Repo");
    cloner(__dirname, "https://github.com/civrepo/civrepo.github.io.git", "civrepo");
    console.log("Successfully cloned.");
}
catch (error) {
    console.warn(chalk.yellow(error.message));
    process.exit(1);
}

// Clone Parent POM
try {
    console.log("Cloning ParentPOM");
    cloner(targetFolder, "https://github.com/civrepo/parent-pom.git");
    console.log("Successfully cloned.");
}
catch (error) {
    console.warn(chalk.yellow(error.message));
    process.exit(1);
}

// Clone MegaRepo
try {
    console.log("Cloning MegaRepo");
    cloner(targetFolder, "https://github.com/civrepo/megarepo.git");
    console.log("Successfully cloned.");
}
catch (error) {
    console.warn(chalk.yellow(error.message));
    process.exit(1);
}

// Install MegaRepo dependencies
try {
    console.log("Installing MegaRepo dependencies");
    const folder = resolve(targetFolder, "megarepo");
    execSync("npm install", {cwd: folder, stdio: "ignore", encoding: "utf8"});
    console.log("Dependencies installed.");
}
catch (error) {
    console.warn(chalk.yellow(error.message));
    process.exit(1);
}

// Clone MegaRepo plugins
try {
    console.log("Downloading MegaRepo plugins");
    const folder = resolve(targetFolder, "megarepo");
    execSync("npm run clone", {cwd: folder, stdio: "ignore", encoding: "utf8"});
    console.log("Plugins downloaded.");
}
catch (error) {
    console.warn(chalk.yellow(error.message));
    process.exit(1);
}

// Install everything
try {
    console.log("Deploying...");
    const deploy = "-DaltDeploymentRepository=localcivrepo::default::file://" + outputFolder;
    execSync("mvn clean deploy -Dcheckstyle.skip -Dmaven.javadoc.skip=true --fail-at-end " + deploy,
        {cwd: targetFolder, stdio: "inherit", encoding: "utf8"});
    console.log("Deploy completed.");
}
catch (error) {
    console.warn(chalk.yellow(error.message));
    process.exit(1);
}

console.log(chalk.blue("Done."));
