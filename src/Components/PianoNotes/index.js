import './styles.css';

import React from 'react';

const PianoNotes = () => {
  // TODO: Calculate notes
  // all notes are with Octave 4
  const AVAILABLE_KEYS = {
    a: 440,
    b: 493.9,
    c: 261.6,
    d: 293.7,
    e: 329.6,
    f: 349.2,
    g: 392,
  };

  const createAudio = () => {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    const gainNode = context.createGain();
    gainNode.connect(context.destination);

    return [oscillator, gainNode];
  };

  const stopSound = (event, oscillator, currentNoteElement) => {
    if (event.repeat) return;
    currentNoteElement.style.backgroundColor = 'transparent';
    oscillator.stop();
  };

  const makeSound = (note) => {
    const currentFrequency = AVAILABLE_KEYS[note];
    const [oscillator, gainNode] = createAudio();
    oscillator.frequency.value = currentFrequency;

    oscillator.connect(gainNode);
    oscillator.start();

    const currentNoteElement = document.getElementById(note);
    currentNoteElement.style.backgroundColor = '#313a4c';

    document.addEventListener('mouseup', (event) => {
      stopSound(event, oscillator, currentNoteElement);
    });

    document.addEventListener('keyup', (event) => {
      const pressedKey = event.key;
      isAvailableKey(pressedKey) &&
        stopSound(event, oscillator, currentNoteElement);
    });
  };

  const isAvailableKey = (pressedKey) => {
    return Object.keys(AVAILABLE_KEYS).includes(pressedKey.toLocaleLowerCase());
  };

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const pressedKey = event.key;

    isAvailableKey(pressedKey) && makeSound(pressedKey);
  });

  return (
    <div className="NoteContainer">
      {Object.keys(AVAILABLE_KEYS).map((note) => (
        <button
          className="Note"
          key={`note-${note}`}
          onMouseDown={() => makeSound(note)}
          id={note}
        >
          {note}
        </button>
      ))}
    </div>
  );
};

export default PianoNotes;
