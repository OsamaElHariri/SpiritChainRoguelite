export class ArrayUtils {
    static random<T>(array: T[]) {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    static randomGroups = function* (array: any[]) {
        const numbers = [];
        for (let i = 0; i < array.length; i++) numbers.push(i);

        const randomOrder = [];
        for (let i = 0; i < array.length; i++) {
            const index = Math.floor(Math.random() * numbers.length);
            randomOrder.push(numbers[index]);
            numbers.splice(index, 1);
        }

        let elements: any[] = [];
        let target: number = (yield null) || array.length;
        for (let i = 0; i < array.length; i++) {
            if (i == target) {
                target = i + (yield elements) || array.length;
                elements = [];
            }
            elements.push(array[randomOrder[i]]);
        }
        yield elements;
    }

    static randomGroups2<T>(array: T[]) {
        const numbers = [];
        for (let i = 0; i < array.length; i++) numbers.push(i);

        const randomOrder = [];
        for (let i = 0; i < array.length; i++) {
            const index = Math.floor(Math.random() * array.length);
            randomOrder.push(numbers[index]);
            numbers.splice(index, 1);
        }

    }
}