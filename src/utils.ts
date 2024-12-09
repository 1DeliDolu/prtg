/**
 * Global helper functions
 * 
 * 
 */


/**
 * pad date parts and optionally add one
 */
export function pad(idx: number, val: boolean): string {
    if (val) {
        return ("0" + (idx + 1)).slice(-2)
    };
    return ("0" + idx).slice(-2);
}