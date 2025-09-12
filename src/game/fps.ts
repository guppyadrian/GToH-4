export class FPSCounter {
    frameCount: number;
    startTime: number;
    endTime: number;
    tickTime: number;
    idleTime: number;
    fpsTimes: number[];
    measureRate: number;
    
    get fps() {
        return Math.round(this.fpsTimes.reduce((acc, cur) => acc + cur) / this.fpsTimes.length * 10) / 10;
    }

    /**
     * 
     * @param measureRate amount of times to measure per second
     */
    constructor(measureRate: number = 2) {
        this.measureRate = measureRate;
        this.frameCount = 0;
        this.startTime = Date.now();
        this.endTime = Date.now();
        this.tickTime = 0;
        this.idleTime = 0;
        this.fpsTimes = [];
        setInterval(this.measureFPS.bind(this), 1000 / measureRate);
    }

    destroy() {
        // TODO: clear interval
    }

    measureFPS() {
        this.fpsTimes.push(this.frameCount * this.measureRate);
        if (this.fpsTimes.length > 8) this.fpsTimes.shift();  
        this.frameCount = 0;
    }

    tickStarted() {
        this.startTime = Date.now();
        this.idleTime = this.startTime - this.endTime;
    }

    tickEnded() {
        this.endTime = Date.now();
        this.tickTime = this.endTime - this.startTime;
        this.frameCount++;
    }
}