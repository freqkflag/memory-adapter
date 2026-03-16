"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTrajectory = createTrajectory;
function createTrajectory(points) {
    return points.sort((a, b) => a.timestamp - b.timestamp);
}
