import crepe
from scipy.io import wavfile
import numpy as np
import csv
import math

def findNotes(wavFile):
    sr, audio = wavfile.read(wavFile)
    time, frequency, _, activation = crepe.predict(audio, sr, viterbi = False, step_size = 1000)

    timeList = []
    frequencyList = []

    for t in np.arange(len(time)):
        timeList.append(int(time[t]))
        frequencyList.append(float(frequency[t]))


    # notesArray = [[16.35, 32.70, 65.41, 130.81, 261.63, 523.25, 1046.50, 2093.00, 4186.01, 8372.02, 16744.04], [17.32, 34.65, 69.30, 138.59, 277.18, 554.37, 1108.73, 2217.46, 4434.92, 8869.84, 17739.69], [18.35, 36.71, 73.42, 146.83, 293.66, 587.33, 1174.66, 2349.32, 4698.64, 9397.27, 18794.54], [19.45, 38.89, 77.78, 155.56, 311.13, 622.25, 1244.51, 2489.02, 4978.03, 9956.06, 19912.13], [20.60, 41.20, 82.41, 164.81, 329.63, 659.26, 1318.51, 2637.02, 5274.04, 10548.08, 21096.16], [21.83, 43.65, 87.31, 174.61, 349.23, 698.46, 1396.91, 2793.83, 5587.65, 11175.30, 22350.61], [23.12, 46.25, 92.50, 185.00, 369.99, 739.99, 1479.98, 2959.96, 5919.91, 11839.82, 23679.64], [24.50, 49.00, 98.00, 196.00, 392.00, 783.99, 1567.98, 3135.96, 6271.93, 12543.85, 25087.71], [25.96, 51.91, 103.83, 207.65, 415.30, 830.61, 1661.22, 3322.44, 6644.88, 13289.75, 26579.50], [27.50, 55.00, 110.00, 220.00, 440.00, 880.00, 1760.00, 3520.00, 7040.00, 14080.00, 28160.00], [29.14, 58.27, 116.54, 233.08, 466.16, 932.33, 1864.66, 3729.31, 7458.62, 14917.24, 29834.48], [30.87, 61.74, 123.47, 246.94, 493.88, 987.77, 1975.53, 3951.07, 7902.13, 15804.27, 31608.53]]

    # notesArray = ['C', 'C#', 'D', 'D#', 'E', 'E#', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']

    userNotesList = []

    for t in timeList:
        notes = 12 * math.log(frequencyList[t]/440, 2)
        noteIndex = (69 + round(notes)) % 12
        # octave = round(((69 + round(notes))/12) - 1)

        userNotesList.append(noteIndex)

    return userNotesList

# Song chosen by user also needs to be passed in, so that the correct songNotesList file can be read.
def findScore(userNotesList, songChoice):

    noteDifference = 0
    songNotesList = []

    songFile = "song" + str(songChoice) + "Notes.wav"
    

    with open(songFile, "r") as file:
        for line in file:
            row = line.strip().split(",")
            songNotesList.append(row)

    
    for element in userNotesList:
        noteDifference += abs(userNotesList[element] - songNotesList[element])

    score = round(100 - (noteDifference / len(userNotesList) * 12))
    
    return(score)