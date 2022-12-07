const PianoNotes = () => {
  const AVAILABLE_KEYS = {
    a: 100,
    b: 200,
    c: 300,
    d: 400,
    e: 500,
    f: 600,
    g: 700,
  };

  const createAudio = () => {
    const context = new AudioContext();
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
