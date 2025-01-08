
export class IdPool {
    queue: number[] = [];
    mx_size = 0;
    constructor(n: number) {
        this.mx_size = n;
        for (let i = 0; i < n; i++) this.queue.push(i);
    }
    add(value: number) {
        this.queue.push(value);
    }
    front(): number {
        let x = this.queue.shift();
        if (x) return x;
        else {
            for (let i = this.mx_size + 1; i <= this.mx_size * 2; i++)this.queue.push(i);
            this.mx_size *= 2;
            let x = this.queue.shift();
            if (x) return x;
            else return -1;
        }
    }
}
