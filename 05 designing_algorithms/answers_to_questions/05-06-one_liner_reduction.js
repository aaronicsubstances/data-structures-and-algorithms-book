
(function(arr) {
    const totalWidth3 = ((tab) => {
        /*const partial = [0];
        tab.forEach((v, i) => {
            partial[i + 1] = partial[i] + v;
        });*/
        const partial = blocks.reduce((a, c, i) => ((a[i + 1] = a[i] + c), a),
            [0]);
        return (from, to) => partial[to + 1] - partial[from];
    })(arr);
})