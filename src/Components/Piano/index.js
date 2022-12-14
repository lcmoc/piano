import './styles.css';

import React, { useEffect, useState } from 'react';

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
  z: 'C#',
  n: 'D',
  u: 'D#',
  j: 'E',
  k: 'F',
  i: 'F#',
  l: 'G',
  o: 'G#',
  ö: 'A',
  p: 'A#',
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
  const [clickedKeys, setClickedKeys] = useState([]);

  const stopSound = (oscillator, note) => {
    const inUseKeys =
      (note.length > 1 &&
        clickedKeys.filter((currentNote) => currentNote !== note)) ||
      [];

    setClickedKeys([inUseKeys]);
    oscillator.stop();
  };

  const makeSound = (pressedKey) => {
    const [oscillator, gainNode] = createAudio();
    const note = KEY_NOTES[pressedKey];
    const noteChar = note.charAt(0);
    const octave = getOctave(note);
    oscillator.frequency.value = calculateNoteFrequency(noteChar, octave);
    oscillator.connect(gainNode);
    oscillator.start();

    setClickedKeys([...clickedKeys, pressedKey]);

    document.addEventListener('keyup', (event) => {
      if (event.repeat) return;
      isAvailableKey(event.key) && stopSound(oscillator, note);
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
      {Object.keys(KEY_NOTES).map((key) => {
        const note = KEY_NOTES[key];
        return (
          <button
            className="Note"
            key={`note-${note}-keyboardKey-${key}`}
            id={`note-${note}-keyboardKey-${key}`}
            style={{
              backgroundColor: clickedKeys.includes(key) && '#313a4c',
            }}
          ></button>
        );
      })}
    </div>
  );
};

export default PianoNotes;
