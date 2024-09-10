
export default function (number) {
    if (number >= 100000000) {
        return number / 100000000 + 'kw'
    }
    if (number >= 10000) {
        return number / 10000 + 'w'
    }
    if (number < 10000) {
        return number;
    }
}