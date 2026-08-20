#!/usr/bin/env node

/**
 * Keep `devEngines.packageManager` aligned with the npm major version declared
 * by the root's exact `packageManager` field.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const packageJsonPath = fileURLToPath(
    new URL("../package.json", import.meta.url)
);
const npmVersionPattern = String.raw`(?<version>(?<major>0|[1-9]\d*)\.(?:0|[1-9]\d*)\.(?:0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?)`;
const packageManagerPattern = new RegExp(`^npm@${npmVersionPattern}$`, "u");
const workflowPackageManagerPattern = new RegExp(
    `npm install --global --ignore-scripts npm@${npmVersionPattern}`,
    "gu"
);
const workflowPackageManagerTargets = [
    {
        expectedOccurrences: 2,
        path: fileURLToPath(
            new URL("../.github/workflows/ci.yml", import.meta.url)
        ),
    },
    {
        expectedOccurrences: 1,
        path: fileURLToPath(
            new URL("../.github/workflows/release.yml", import.meta.url)
        ),
    },
];

/**
 * @param {unknown} value
 *
 * @returns {value is Record<string, unknown>}
 */
const isRecord = (value) => typeof value === "object" && value !== null;

const parseArguments = () => {
    const arguments_ = process.argv.slice(2);
    const check = arguments_.includes("--check");
    const unsupportedArguments = arguments_.filter(
        (argument) => argument !== "--check"
    );

    if (unsupportedArguments.length > 0) {
        throw new TypeError(
            `Unsupported argument(s): ${unsupportedArguments.join(", ")}. Supported arguments: --check`
        );
    }

    return { check };
};

const readPackageJson = async () => {
    try {
        return JSON.parse(await readFile(packageJsonPath, "utf8"));
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new TypeError(
            `Failed to read package.json at ${packageJsonPath}: ${message}`,
            { cause: error }
        );
    }
};

/**
 * @param {string} path
 *
 * @returns {Promise<string>}
 */
const readWorkflow = async (path) => {
    try {
        return await readFile(path, "utf8");
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new TypeError(`Failed to read workflow at ${path}: ${message}`, {
            cause: error,
        });
    }
};

/**
 * Resolve and validate package-manager metadata from package.json.
 *
 * @param {Record<string, unknown>} packageJson
 *
 * @returns {{
 *     devEngines: Record<string, unknown>;
 *     expectedPackageManager: {
 *         name: string;
 *         onFail: string;
 *         version: string;
 *     };
 *     metadataAligned: boolean;
 *     npmVersion: string;
 *     packageManager: string;
 * }}
 */
const resolvePackageManagerState = (packageJson) => {
    const packageManager = packageJson["packageManager"];

    if (typeof packageManager !== "string") {
        throw new TypeError(
            "Expected package.json packageManager to be an exact npm version such as npm@12.0.2"
        );
    }

    const match = packageManagerPattern.exec(packageManager);
    const npmVersion = match?.groups?.["version"];
    const npmMajorVersion = match?.groups?.["major"];

    if (!npmVersion || !npmMajorVersion) {
        throw new TypeError(
            `Expected package.json packageManager to be an exact npm version such as npm@12.0.2; received ${JSON.stringify(packageManager)}`
        );
    }

    const devEngines = packageJson["devEngines"];

    if (!isRecord(devEngines)) {
        throw new TypeError(
            "Expected package.json devEngines to contain an object"
        );
    }

    const expectedPackageManager = {
        name: "npm",
        version: npmMajorVersion,
        onFail: "error",
    };
    const existingPackageManager = devEngines["packageManager"];
    const metadataAligned =
        isRecord(existingPackageManager) &&
        existingPackageManager["name"] === expectedPackageManager.name &&
        existingPackageManager["version"] === expectedPackageManager.version &&
        existingPackageManager["onFail"] === expectedPackageManager.onFail;

    return {
        devEngines,
        expectedPackageManager,
        metadataAligned,
        npmVersion,
        packageManager,
    };
};

/**
 * Read and validate the npm pins in one workflow.
 *
 * @param {{ expectedOccurrences: number; path: string }} target
 * @param {string} npmVersion
 *
 * @returns {Promise<{
 *     aligned: boolean;
 *     contents: string;
 *     expectedOccurrences: number;
 *     path: string;
 * }>}
 */
const readWorkflowState = async (target, npmVersion) => {
    const contents = await readWorkflow(target.path);
    const versions = [...contents.matchAll(workflowPackageManagerPattern)]
        .map((workflowMatch) => workflowMatch.groups?.["version"])
        .filter((version) => version !== undefined);

    if (versions.length !== target.expectedOccurrences) {
        throw new TypeError(
            `Expected ${target.expectedOccurrences} exact npm install pin(s) in ${target.path}; found ${versions.length}`
        );
    }

    return {
        ...target,
        aligned: versions.every((version) => version === npmVersion),
        contents,
    };
};

/**
 * Write a managed file with contextual error reporting.
 *
 * @param {string} path
 * @param {string} contents
 * @param {string} description
 *
 * @returns {Promise<void>}
 */
const writeManagedFile = async (path, contents, description) => {
    try {
        await writeFile(path, contents, "utf8");
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        throw new TypeError(`Failed to write ${description}: ${message}`, {
            cause: error,
        });
    }
};

/**
 * Update one workflow when its npm pin is stale.
 *
 * @param {{ aligned: boolean; contents: string; path: string }} workflow
 * @param {string} npmVersion
 *
 * @returns {Promise<void>}
 */
const updateWorkflow = async (workflow, npmVersion) => {
    if (workflow.aligned) {
        return;
    }

    const updatedContents = workflow.contents.replace(
        workflowPackageManagerPattern,
        `npm install --global --ignore-scripts npm@${npmVersion}`
    );

    await writeManagedFile(
        workflow.path,
        updatedContents,
        `workflow at ${workflow.path}`
    );
};

const main = async () => {
    const { check } = parseArguments();
    const packageJson = await readPackageJson();

    if (!isRecord(packageJson)) {
        throw new TypeError("Expected package.json to contain an object");
    }

    const {
        devEngines,
        expectedPackageManager,
        metadataAligned,
        npmVersion,
        packageManager,
    } = resolvePackageManagerState(packageJson);
    const workflowStates = await Promise.all(
        workflowPackageManagerTargets.map((target) =>
            readWorkflowState(target, npmVersion)
        )
    );
    const workflowsAligned = workflowStates.every(
        (workflow) => workflow.aligned
    );

    if (metadataAligned && workflowsAligned) {
        console.log(
            `Package-manager metadata and workflow pins already aligned with ${packageManager}`
        );
        return;
    }

    if (check) {
        throw new TypeError(
            `Package-manager metadata or workflow pins are out of sync. Run "npm run sync:package-manager-version" to align them with ${packageManager}.`
        );
    }

    if (!metadataAligned) {
        devEngines["packageManager"] = expectedPackageManager;

        await writeManagedFile(
            packageJsonPath,
            `${JSON.stringify(packageJson, null, 4)}\n`,
            `package.json at ${packageJsonPath}`
        );
    }

    await Promise.all(
        workflowStates.map((workflow) => updateWorkflow(workflow, npmVersion))
    );

    console.log(
        `Aligned devEngines.packageManager and workflow pins with ${packageManager}`
    );
};

try {
    await main();
} catch (error) {
    console.error("Failed to synchronize npm package-manager metadata:", error);
    process.exitCode = 1;
}
