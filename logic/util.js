export function objIncludes(obj, element) {
    let res = false;
    for (let value of Object.values(obj)) {
        if (value === element) {
            res = true;
            break;
        }
    }

    return res;
}
