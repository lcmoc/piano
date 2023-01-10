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
  0.6, 0.7, 0.8, 0.9, 1, 1.059463094359, 1.122462048309, 1.1892071150027,
  1.25992104989487,
];

const BASE_FREQUENCY = 440;

const HALF_STEPS_FROM_A = {
  C: -10,
  'C#': -9,
  D: -8,
  'D#': -7,
  E: -6,
  'E#': -5,
  F: -4,
  'F#': -3,
  G: -2,
  'G#': -1,
  A: 0,
  'A#': 1,
  B: 2,
};

const OCTAVE_KEYS = ['1', '2'];

const getFrequency = (note, octave) => {
  const halfSteps = octave - 4 + HALF_STEPS_FROM_A[note];
  const frequency =
    BASE_FREQUENCY * Math.pow(2, halfSteps / 12) * OCTAVE_RATIOS[octave + 4];

  return frequency;
};

const isAvailableKey = (pressedKey) => {
  return Object.keys(KEY_NOTES).includes(pressedKey.toLowerCase());
};

const context = new (window?.AudioContext || window?.webkitAudioContext)();

const createOscillator = () => {
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  return oscillator;
};

const PianoNotes = () => {
  const [playingNote, setPlayingNote] = useState();
  const [octave, setOctave] = useState(0);

  const stopSound = (oscillator, note) => {
    setPlayingNote(note);
    oscillator.disconnect();
  };

  const setNewOctave = (pressedKey) => {
    const minus = pressedKey === '1';
    const plus = pressedKey === '2';
    const isMax = octave === 4;
    const isMin = octave === -4;

    const newOctave =
      (minus && !isMin && octave - 1) || (plus && !isMax && octave + 1) || 0;

    setOctave(newOctave);
  };

  const makeSound = (pressedKey) => {
    const note = KEY_NOTES[pressedKey];
    const oscillator = createOscillator();
    oscillator.frequency.value = getFrequency(note, parseInt(octave));
    oscillator.connect(context.destination);

    setPlayingNote(pressedKey);
    oscillator.start();

    const keyUpListener = (event) => {
      if (event.repeat) return;
      isAvailableKey(event.key) && stopSound(oscillator, note);
    };

    window.addEventListener('keyup', keyUpListener);
  };

  useEffect(() => {
    const keyDownListener = (event) => {
      if (event.repeat) return;
      const pressedKey = event.key;
      isAvailableKey(pressedKey) && makeSound(pressedKey.toLowerCase());
      OCTAVE_KEYS.includes(pressedKey) && setNewOctave(pressedKey);
    };

    window.addEventListener('keydown', keyDownListener);

    return () => {
      window.removeEventListener('keydown', keyDownListener);
    };
  }, [octave]);

  return (
    <div className="Container NotePosition">
      <h1 className="Title">Electronic Piano</h1>
      <div className="OctaveContainer">
        <div className="MainContainer">
          <p>Octave Adjustment</p>
          <input
            type="range"
            name="octaves"
            id="octaves"
            onChange={(event) => setOctave(event.target.value)}
            min={-4}
            max={4}
            value={octave}
          />
          <label htmlFor="octaves">{octave}</label>
        </div>
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
                background: playingNote === key && '#526F9B',
                color: playingNote === key && 'white',
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
