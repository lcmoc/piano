import './styles.css';

import React, { useEffect } from 'react';

const KEY_NOTES = {
  a: 'C',
  q: 'C#',
  s: 'D',
  w: 'D#',
  d: 'E',
  e: 'E#',
  f: 'F',
  r: 'F#',
  g: 'G',
  c: 'A',
  t: 'A#',
  v: 'B',
  h: 'C',
  n: 'D',
  j: 'E',
  k: 'F',
  l: 'G',
  ö: 'A',
  ä: 'B',
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

const isAvailableKey = (pressedKey) => {
  return Object.keys(KEY_NOTES).includes(pressedKey.toLocaleLowerCase());
};

const getOctave = (note) => {
  const hasOctaveValue = note.length === 2;
  const octaveNumber = parseInt(note.charAt(1));

  return (hasOctaveValue && octaveNumber) || 0;
};

const PianoNotes = () => {
  const stopSound = (oscillator) => {
    oscillator.stop();
  };

  const makeSound = (pressedNote) => {
    const [oscillator, gainNode] = createAudio();
    const note = KEY_NOTES[pressedNote];
    const noteChar = note.charAt(0);
    const octave = getOctave(note);
    oscillator.frequency.value = calculateNoteFrequency(noteChar, octave);
    oscillator.connect(gainNode);
    oscillator.start();

    document.addEventListener('keyup', (event) => {
      if (event.repeat) return;
      isAvailableKey(event.key) && stopSound(oscillator);
    });
  };

  useEffect(() => {
    window.addEventListener('keydown', (event) => {
      if (event.repeat) return;
      const pressedKey = event.key;

      isAvailableKey(pressedKey) && makeSound(pressedKey);
      return () => {
        window.removeEventListener(
          'keydown',
          isAvailableKey(pressedKey) && makeSound(pressedKey),
        );
      };
    });
  }, []);

  return (
    <div className="NoteContainer">
      {Object.values(KEY_NOTES).map((note, index) => {
        const keyboardKey = Object.keys(KEY_NOTES).find(
          (key) => KEY_NOTES[key] === note,
        );
        return (
          <button
            className="Note"
            key={`note-${note}-keyboardKey-${keyboardKey}-index-${index}`}
            id={`note-${note}-keyboardKey-${keyboardKey}-index-${index}`}
          ></button>
        );
      })}
    </div>
  );
};

export default PianoNotes;
