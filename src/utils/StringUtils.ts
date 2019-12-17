export class StringUtils {
    static numberToVideoMinutes(value: number) {
        const minute = Math.trunc(value);
        let seconds = Math.round((value - minute) * 60).toString();
        if (seconds.length < 2) seconds += '0';
        return `${minute}:${seconds}`
    };
}