import numpy as np
import scipy.special

class Neuralnetwork:
    def __init__(self, layer_list, learning_rate=0.02):
        self.layers = layer_list
        self.lr = learning_rate
        self.weights = [np.random.normal(0.0, pow(layer_list[i + 1], -0.5), (layer_list[i + 1], layer_list[i])) for i in range(len(layer_list) - 1)]
        self.activate = lambda x: scipy.special.expit(x)
        
    
    def train(self, input_data, output_data):
        input_data = np.array(input_data, ndmin=2).T
        output_data = np.array(output_data, ndmin=2).T
        preds = [input_data]

        # 순전파
        for i in range(len(self.layers) - 1):
            pred = np.dot(self.weights[i], preds[i])
            pred = self.activate(pred)
            preds.append(pred)
        
        # 오차
        errors = [output_data - pred]
        for i in range(len(self.layers) - 1, 0, -1):
            errors.append(np.dot(self.weights[i - 1].T, errors[len(errors) - 1]))

        # 역전파
        for i in range(len(self.layers) - 1, 0, -1):
            reversed_i = len(self.layers) - 1 - i
            computed1 = errors[reversed_i] * preds[i] * (1.0 - preds[i])
            computed2 = np.transpose(preds[i - 1])
            self.weights[i - 1] += self.lr * np.dot(computed1, computed2)

    def query(self, input_data):
        input_data = np.array(input_data, ndmin=2).T
        pred = input_data
        # 순전파
        for i in range(len(self.layers) - 1):
            pred = np.dot(self.weights[i], pred)
            pred = self.activate(pred)
        
        return list(pred.T[0])