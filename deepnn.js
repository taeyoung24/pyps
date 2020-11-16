"use strict";

class Matrixcompute {
    random(row, col) {
        let retm = [];
        for (let i = 0; i < row; i++) {
            let inn = [];
            for (let j = 0; j < col; j++) {
                inn[j] = Math.random() * 2 - 1;
            }
            retm[i] = inn;
        }
        return retm;
    }

    constant(number=0, row, col) {
        let retm = [];
        for (let i = 0; i < col; i++) {
            let inn = [];
            for (let j = 0; j < row; j++) inn[j] = number;
            retm[i] = inn;
        }
        return retm;
    }

    array2(list) {
        return [list];
    }

    T(matrix) {
        let retm = [];
        for (let r = 0; r < matrix[0].length; r++) {
            let inn = [];
            for (let c = 0; c < matrix.length; c++) inn[c] = matrix[c][r];
            retm[r] = inn;
        }
        return retm;
    }

    dot(matrix1, matrix2) {
        const targlen = {r: matrix2[0].length, c: matrix1.length};
        let retm = [];
        for (let col = 0; col < targlen.c; col++) {
            let inn = [];
            for (let row = 0; row < targlen.r; row++) {
                let sum = 0;
                for (let i = 0; i < matrix1[0].length; i++) {
                    sum += matrix1[col][i] * matrix2[i][row]
                };
                inn[row] = sum;
            }
            retm[col] = inn;
        }
        return retm;
    }

    sub(matrix1, matrix2) {
        let retm = [];
        if (typeof matrix1 == 'number') matrix1 = this.constant(matrix1, matrix2[0].length, matrix2.length);
        else if (typeof matrix2 == 'number') matrix2 = this.constant(matrix2, matrix1[0].length, matrix1.length);
        for (let c = 0; c < matrix1.length; c++) {
            let inn = [];
            for (let r = 0; r < matrix1[0].length; r++) inn[r] = matrix1[c][r] - matrix2[c][r];
            retm[c] = inn; 
        }
        return retm;
    }

    add(matrix1, matrix2) {
        let retm = [];
        if (typeof matrix1 == 'number') matrix1 = this.constant(matrix1, matrix2[0].length, matrix2.length);
        else if (typeof matrix2 == 'number') matrix2 = this.constant(matrix2, matrix1[0].length, matrix1.length);
        for (let c = 0; c < matrix1.length; c++) {
            let inn = [];
            for (let r = 0; r < matrix1[0].length; r++) inn[r] = matrix1[c][r] + matrix2[c][r];
            retm[c] = inn; 
        }
        return retm;
    }

    mul(matrix1, matrix2) {
        let retm = [];
        if (typeof matrix1 == 'number') matrix1 = this.constant(matrix1, matrix2[0].length, matrix2.length);
        else if (typeof matrix2 == 'number') matrix2 = this.constant(matrix2, matrix1[0].length, matrix1.length);
        for (let c = 0; c < matrix1.length; c++) {
            let inn = [];
            for (let r = 0; r < matrix1[0].length; r++) inn[r] = matrix1[c][r] * matrix2[c][r];
            retm[c] = inn; 
        }
        return retm;
    }
}


class Neuralnetwork extends Matrixcompute {
    constructor(layer_list, learning_rate=0.02, name='') {
        super();
        this.name = name;
        this.layers = layer_list;
        this.lr = learning_rate;
        let w = [];
        for (let i = 0; i < layer_list.length - 1; i++) w[i] = this.random(layer_list[i + 1], layer_list[i]);
        this.weights = w;
    }

    activate(matrix) {
        let retm = [];
        matrix.forEach(e => {
            let inn = [];
            e.forEach(v => {
                inn.push(1 / (1 + Math.pow(Math.E, -1 * v)))
            });
            retm.push(inn);
        });
        return retm;
    }

    train(input_data, output_data) {
        input_data = this.T(this.array2(input_data));
        output_data = this.T(this.array2(output_data));
        let preds = [input_data];
        let pred;
        // 순전파
        for (let i = 0; i < this.layers.length - 1; i++) {
            pred = this.dot(this.weights[i], preds[i]);
            pred = this.activate(pred);
            preds.push(pred);
        }

        // 오차
        let errors = [this.sub(output_data, pred)];
        for (let i = this.layers.length - 1; i > 0; i--) {
            errors.push(this.dot(this.T(this.weights[i - 1]), errors[errors.length - 1]));
        }

        // 역전파
        for (let i = this.layers.length - 1; i > 0; i--) {
            let reversed_i = this.layers.length - 1 - i;
            let computed1 = this.mul(this.mul(errors[reversed_i], preds[i]), this.sub(1, preds[i]));
            let computed2 = this.T(preds[i - 1]);
            this.weights[i - 1] = this.add(this.weights[i - 1], this.mul(this.lr, this.dot(computed1, computed2)));
        }
    }

    frontprop(input_data, counts=this.weights.length) {
        input_data = this.T(this.array2(input_data));
        let pred = input_data;
        // 순전파
        for (let i = 0; i < counts; i++) {
            pred = this.dot(this.weights[i], pred);
            pred = this.activate(pred);
        }
        return this.T(pred)[0];
    }

    query(input_data) {
        input_data = this.T(this.array2(input_data));
        let pred = input_data;
        // 순전파
        for (let i = 0; i < this.layers.length - 1; i++) {
            pred = this.dot(this.weights[i], pred);
            pred = this.activate(pred);
        }
        return this.T(pred)[0];
    }
}

class NaturalLanguage extends Neuralnetwork {
    constructor(vector_len, Words, lr=0.1) {
        super([Words.len, vector_len, Words.len], lr);
        this.vector_len = vector_len;
        this.Words = Words;
    }

    train(split_sentence_array, counts=1000) {
        let ssa = split_sentence_array;
        let train_set = [];

        for (let i = 0; i < ssa.length; i++) {
            if (this.Words.set.indexOf(ssa[i]) == -1) continue;
            const one1 = i == 0 ? 0 : [this.Words.onehot(ssa[i - 1])];
            const one2 = i == ssa.length - 1 ? 0 : [this.Words.onehot(ssa[i + 1])];
            const onefin = this.Words.onehot(ssa[i]);
            train_set.push([super.add(one1, one2)[0], onefin]);
        }

        for (let i = 0; i < counts; i++) {
            for (let j = 0; j < train_set.length; j++){
                super.train(train_set[j][0], train_set[j][1]);
            }
        }
    }

    vector(word) {
        return super.frontprop(this.Words.onehot(word), 1);
    }
}

class Words {
    constructor(word_set) {
        this.set = word_set;
        this.len = word_set.length;
    }

    onehot(word) {
        let retl = [];
        const idx = this.set.indexOf(word);
        for (let i = 0; i < this.len; i++) {
            if (i != idx) retl[i] = 0;
            else retl[i] = 1;
        }
        return retl;
    }
}

module.exports.Neuralnetwork = Neuralnetwork;
module.exports.Words = Words;
module.exports.NaturalLanguage = NaturalLanguage;
