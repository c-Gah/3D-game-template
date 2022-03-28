
let currentTime: number = 100;

export function log(increment: number, threshold: number, printout: any) {
    currentTime += increment

    if (currentTime >= 2) {
        currentTime = 0;

        console.log(printout);
    }
}