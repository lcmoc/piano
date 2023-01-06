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

const context = new (window?.AudioContext || window?.webkitAudioContext)();
const oscillator = context.createOscillator();
oscillator.type = 'sine';
const gainNode = context.createGain();
gainNode.connect(context.destination);

const isAvailableKey = (pressedKey) => {
  return Object.keys(KEY_NOTES).includes(pressedKey.toLocaleLowerCase());
};

const PianoNotes = () => {
  const [clickedKeys, setClickedKeys] = useState();
  const [octave, setOctave] = useState(0);

  const stopSound = (note) => {
    const inUseKeys =
      (note.length > 1 &&
        clickedKeys.filter((currentNote) => currentNote !== note)) ||
      [];
    setClickedKeys(inUseKeys);
    oscillator.disconnect();
  };

  // const OCTAVE_KEYS = ['1', '2'];

  // const controlOctave = (pressedKey) => {
  //   const minus = pressedKey === '1';
  //   const plus = pressedKey === '2';

  //   const newOctave = (minus && octave - 1) || (plus && octave + 1) || octave;

  //   setOctave(newOctave);
  // };

  const makeSound = (pressedKey) => {
    const note = KEY_NOTES[pressedKey];
    const noteChar = note.charAt(0);
    const frequency = calculateNoteFrequency(noteChar, octave);
    oscillator.frequency.value = frequency;

    console.log('frequency', oscillator.frequency.value);
    oscillator.connect(gainNode);

    setClickedKeys(pressedKey);
    oscillator.start();

    window.addEventListener('keyup', (event) => {
      if (event.repeat) return;
      isAvailableKey(event.key) && stopSound(oscillator, note);
    });
  };

  useEffect(() => {
    console.log('eventlistener keydown added');
    window.addEventListener('keydown', (event) => {
      if (event.repeat) return;
      const pressedKey = event.key;

      isAvailableKey(pressedKey) && makeSound(pressedKey.toLowerCase());
    });

    return () => {
      window.removeEventListener('keydown', makeSound);
      console.log('eventlistener keydown removed');
    };
  }, [octave]);

  return (
    <div className="Container NotePosition">
      <div className="OctaveContainer">
        <label htmlFor="octave">Octave</label>
        <input
          type="range"
          name="octave"
          min="0"
          max="4"
          value={octave}
          onChange={(event) => setOctave(event?.target?.value)}
        />
        {octave}
      </div>
      <div className="NoteContainer">
        {Object.keys(KEY_NOTES).map((key) => {
          const note = KEY_NOTES[key];
          return (
            <button
              className="Note"
              key={`note-${note}-keyboardKey-${key}`}
              id={`note-${note}-keyboardKey-${key}`}
              style={{
                background: clickedKeys === key && '#526F9B',
                color: clickedKeys === key && 'white',
              }}
            >
              <p>{note}</p>
              <p>{key}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PianoNotes;
