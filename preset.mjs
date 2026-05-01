import {
    createConfig as createSharedConfig,
    configs as sharedConfigs,
} from "./eslint.config.mjs";

export const presets = Object.freeze({
    all: sharedConfigs.all,
    base: sharedConfigs.base,
    recommended: sharedConfigs.recommended,
    withoutChunkyLint: sharedConfigs.withoutChunkyLint,
    withoutCopilot: sharedConfigs.withoutCopilot,
    withoutDocusaurus2: sharedConfigs.withoutDocusaurus2,
    withoutEtcMisc: sharedConfigs.withoutEtcMisc,
    withoutFileProgress2: sharedConfigs.withoutFileProgress2,
    withoutGithubActions2: sharedConfigs.withoutGithubActions2,
    withoutImmutable2: sharedConfigs.withoutImmutable2,
    withoutRepo: sharedConfigs.withoutRepo,
    withoutSdl2: sharedConfigs.withoutSdl2,
    withoutStylelint2: sharedConfigs.withoutStylelint2,
    withoutTsconfig: sharedConfigs.withoutTsconfig,
    withoutTsdocRequire2: sharedConfigs.withoutTsdocRequire2,
    withoutTypedoc: sharedConfigs.withoutTypedoc,
    withoutTypefest: sharedConfigs.withoutTypefest,
    withoutUptimeWatcher: sharedConfigs.withoutUptimeWatcher,
    withoutVite: sharedConfigs.withoutVite,
    withoutWriteGoodComments2: sharedConfigs.withoutWriteGoodComments2,
});

/**
 * Create the shared Nick2bad4u ESLint flat config.
 *
 * @type {typeof createSharedConfig}
 */
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types -- The public wrapper inherits its full call signature from createSharedConfig above.
export const createConfig = (options) => createSharedConfig(options);

const nickTwoBadFourU = Object.freeze({
    configs: presets,
    createConfig,
});

export default nickTwoBadFourU;
