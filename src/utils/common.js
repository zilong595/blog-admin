export const generateUniqueId = () => {
    return `${Date.now()}${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 1000000000000000)}`;
}

export const getIndexInArray = (arr, key, value) => {
    for (let index in arr) {
        if (arr[index][key] == value) {
            return index;
        }
    }
}