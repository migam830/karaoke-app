import crepe
from scipy.io import wavfile
import numpy as np
import csv

sr, audio = wavfile.read('test.wav')
time, frequency, _, activation = crepe.predict(audio, sr, viterbi = False, step_size = 1000)

frequencyList = []

for t in np.arange(len(time)):
    print(time[t], frequency[t])
    temp = [int(time[t]), float(frequency[t])]
    frequencyList.append(temp)

print(frequencyList)