export class Interval {
    static milliseconds(delay: number) {
        return new Promise((resolve, reject) => {
            setTimeout(() => resolve(), delay);
        });
    }
}