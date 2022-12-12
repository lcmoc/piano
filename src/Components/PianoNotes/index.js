import './styles.css';

import React from 'react';

const PianoNotes = () => {
  const KEY_NOTES = {
    a: 'A',
    b: 'B',
    c: 'C',
    d: 'D',
    e: 'E',
    f: 'F',
    g: 'G',
  };

  const OCTAVE_RATIOS = [
    1, 1.059463094359, 1.122462048309, 1.1892071150027, 1.25992104989487,
  ];
  const BASE_FREQUENCY = 440;

  const HALF_STEPS_FROM_A = {
    C: -9,
    'C#': -8,
    D: -7,
    'D#': -6,
    E: -5,
    F: -4,
    'F#': -3,
    G: -2,
    'G#': -1,
    A: 0,
    'A#': 1,
    B: 2,
  };

  const calculateNoteFrequency = (note, octave) => {
    const halfSteps = octave - 4 + HALF_STEPS_FROM_A[note];
    const frequency =
      BASE_FREQUENCY * Math.pow(2, halfSteps / 12) * OCTAVE_RATIOS[octave];

    return frequency;
  };

  const createAudio = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    const gainNode = context.createGain();
    gainNode.connect(context.destination);

    return [oscillator, gainNode];
  };

  const stopSound = (oscillator, currentNoteElement) => {
    currentNoteElement.style.backgroundColor = 'transparent';
    oscillator.stop();
  };

  const makeSound = (note) => {
    const [oscillator, gainNode] = createAudio();
    const currentNote =
      (note.length === 1 && KEY_NOTES[note]) || note.toUpperCase();
    const char = currentNote.charAt(0);
    const octave =
      (currentNote.length === 2 && parseInt(currentNote.charAt(1))) || 0;
    const frequency = calculateNoteFrequency(char, octave);
    oscillator.frequency.value = frequency;

    oscillator.connect(gainNode);
    oscillator.start();

    const currentNoteElement = document.getElementById(
      currentNote.toLocaleLowerCase(),
    );

    currentNoteElement.style.backgroundColor = '#313a4c';

    document.addEventListener('mouseup', (event) => {
      if (event.repeat) return;
      stopSound(oscillator, currentNoteElement);
    });

    document.addEventListener('keyup', (event) => {
      if (event.repeat) return;
      const pressedKey = event.key;
      isAvailableKey(pressedKey) && stopSound(oscillator, currentNoteElement);
    });
  };

  const isAvailableKey = (pressedKey) => {
    return Object.keys(KEY_NOTES).includes(pressedKey.toLocaleLowerCase());
  };

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const pressedKey = event.key;

    isAvailableKey(pressedKey) && makeSound(pressedKey);
  });

  return (
    <div className="NoteContainer">
      {Object.values(KEY_NOTES).map((note) => {
        const currentNote = note.toLowerCase();
        return (
          <button
            className="Note"
            key={`note-${currentNote}`}
            onMouseDown={() => makeSound(currentNote)}
            id={currentNote}
          >
            {note}
          </button>
        );
      })}
    </div>
  );
};

export default PianoNotes;
