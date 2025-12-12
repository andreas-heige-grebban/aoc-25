/** Branded string type for device names */
export type DeviceName = string & { readonly __brand: 'DeviceName' };

/** Graph representation: maps device to its output connections */
export type DeviceGraph = Map<DeviceName, DeviceName[]>;

/** Raw puzzle input string */
export type RawInput = string & { readonly __brand: 'RawInput' };

/** Single input line */
export type InputLine = string;

/** Start device for path finding */
export const START_DEVICE = 'you' as DeviceName;

/** End device for path finding */
export const END_DEVICE = 'out' as DeviceName;
