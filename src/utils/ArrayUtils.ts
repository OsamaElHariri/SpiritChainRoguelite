export class ArrayUtils {
    static random<T>(array: T[]) {
        const index = Math.floor(Math.random() * array.length);
        return array[index];
    }

    static randomGroups = function* (array: any[]) {
        const numbers = [];
        for (let i = 0; i < array.length; i++) numbers.push(i);
        const randomOrder = this.shuffle(numbers);

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

    static pullWithLittleRepetition = function* (array: any[]) {
        const items = this.shuffle(array);
        const randomStep = 1 / (items.length - 1);
        while (true) {
            for (let i = 0; i < items.length; i++) {
                let shouldPull = Math.random() < randomStep * (i + 1);

                if (shouldPull) {
                    const item = items[i];
                    items.splice(i, 1)
                    items.push(item);
                    yield item;
                    break;
                }
            }
        }
    }

    static shuffle<T>(array: T[]) {
        const numbers = [];
        for (let i = 0; i < array.length; i++) numbers.push(i);

        const randomOrder: number[] = [];
        for (let i = 0; i < array.length; i++) {
            const index = Math.floor(Math.random() * numbers.length);
            randomOrder.push(numbers[index]);
            numbers.splice(index, 1);
        }
        return randomOrder.map(order => array[order]);
    }
}