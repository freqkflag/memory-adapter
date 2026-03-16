export function createTrajectory(points) {
    return points.sort((a, b) => a.timestamp - b.timestamp);
}
