import * as publicServerFunctions from '../../server';
declare const serverFunctions: import("gas-client/dist/types/functions").ServerFunctions<typeof publicServerFunctions>;
export { serverFunctions };
