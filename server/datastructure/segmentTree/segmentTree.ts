// limit for array size 
// Max size of tree 










export class SegmentTree {

    arr: number[] = [];
    n: number = 0;
    tree: Array<number> = new Array<number>(1);
    arr_index: Array<number> = new Array<number>(1);


    constructor(_n: number) {
        this.n = _n;
        this.tree = new Array<number>(4 * _n);
        this.tree.fill(1e9);
        this.arr_index = new Array<number>(4 * _n);

        let x = _n; while (x--) this.arr.push(0);
        this.build();
    }





    build() {

        // insert leaf nodes in tree 
        for (let i = 0; i < this.n; i++) {
            this.tree[this.n + i] = this.arr[i];
            this.arr_index[this.n + i] = i;
        }

        // build the tree by calculating 
        // parents 
        for (let i = this.n - 1; i > 0; --i) {
            this.tree[i] = Math.min(this.tree[i << 1], this.tree[i << 1 | 1]);
            this.arr_index[i] = this.arr_index[i << 1];
            if (this.tree[i << 1] > this.tree[i << 1 | 1]) this.arr_index[i] = this.arr_index[i << 1 | 1];
        }

    }

    // function to update a tree node 
    updateTreeNode(p: number, value: number) {
        // set value at position p 
        this.tree[p + this.n] += value;
        this.arr[p] += value;
        p = p + this.n;

        // move upward and update parents 
        for (let i = p; i > 1; i >>= 1) {
            this.tree[i >> 1] = Math.min(this.tree[i], this.tree[i ^ 1]);
            this.arr_index[i >> 1] = this.arr_index[i];
            if (this.tree[i] > this.tree[i ^ 1]) this.arr_index[i >> 1] = this.arr_index[i ^ 1];
        }
    }

    // function to get sum on 
    // interval [l, r) 
    query(l: number, r: number) {
        r++;
        let res = 1e9;
        let index = 0;
        // loop to find the sum in the range 

        for (l += this.n, r += this.n; l < r;
            l >>= 1, r >>= 1) {
            if ((l & 1) > 0) {
                if (this.tree[l] < res) {
                    index = this.arr_index[l];
                }
                res = Math.min(res, this.tree[l++]);
            }

            if ((r & 1) > 0) {

                if (this.tree[--r] < res) {
                    index = this.arr_index[r];
                }
                res = Math.min(res, this.tree[r]);
            }

        }

        return {
            index: index,
            value: res
        };
    }
}



// let tree: SegmentTree = new SegmentTree(5);

// tree.updateTreeNode(2, 5);
// tree.updateTreeNode(1, 4);
// tree.updateTreeNode(3, 6);
// console.log(tree.query(1, 3));


let mp: number[][] = [[]];
// mp[0] = [];
// mp[1] = [];
// mp[1][1] = 1;
// console.log(mp);




