// TODO: Calculate notes

const PianoNotes = () => {
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

  const makeSound = (note) => {
    const currentFrequency = AVAILABLE_KEYS[note];
    const [oscillator, gainNode] = createAudio();
    oscillator.frequency.value = currentFrequency;

    oscillator.connect(gainNode);
    oscillator.start();

    document.addEventListener('keyup', (event) => {
      if (event.repeat) return;
      const pressedKey = event.key;

      isAvailableKey(pressedKey) && stopSound(oscillator);
    });
  };

  const stopSound = (oscillator) => {
    oscillator.stop();
  };

  const isAvailableKey = (pressedKey) => {
    return Object.keys(AVAILABLE_KEYS).includes(pressedKey.toLocaleLowerCase());
  };

  document.addEventListener('keydown', (event) => {
    if (event.repeat) return;
    const pressedKey = event.key;

    isAvailableKey(pressedKey) && makeSound(pressedKey);
  });
};

export default PianoNotes;
