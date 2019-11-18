export class CircleUtils {
    static rotationTowardsTargetTheta(current: number, target: number) {
        current = this.putOnPositiveCircle(current);
        target = this.putOnPositiveCircle(target);
        const diff = target - current;
        const absDiff = Math.abs(diff);
        if (absDiff == Math.PI) return Math.random() < 0.5 ? -1 : 1;

        if (absDiff > Math.PI) {
            if (diff < 0) target += Math.PI * 2;
            else target -= Math.PI * 2;
        }
        return target - current;
    }

    private static putOnPositiveCircle(x: number) {
        const factor = x / (Math.PI * 2);
        if (x < 0) {
            return Math.abs(Math.floor(factor)) * (Math.PI * 2) + x;
        } else {
            return (factor - Math.floor(factor)) * Math.PI * 2;
        }
    }
}