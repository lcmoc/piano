const SoundPad = () => {
  const context = new AudioContext();
  const oscillator = context.createOscillator();
  oscillator.type = 'sine';
  const gainNode = context.createGain();

  document.addEventListener('mousedown', (event) => {
    oscillator.connect(gainNode);
    oscillator.start();
  });

  document.addEventListener('mouseup', (event) => {
    oscillator.disconnect(gainNode);
  });

  document.addEventListener('mousemove', (event) => {
    const posX = event.clientX;
    const posY = event.clientY;

    oscillator.frequency.value = posY;
    gainNode.gain.value = posX / 100;
    gainNode.connect(context.destination);
  });

  // const FAST_MOVEMENT = 200;
  // const NO_MOVEMENT = 0;

  // const movementX = event.movementX;
  // const movementY = event.movementY;
  // const movement = Math.sqrt(movementX * movementX + movementY * movementY);
  // const speed = Math.round(10 * movement);
  // speed === NO_MOVEMENT && (oscillator.frequency.value = 800);
  // speed > NO_MOVEMENT && (oscillator.frequency.value = 300);
  // speed >= FAST_MOVEMENT && (oscillator.frequency.value = 400);
};

export default SoundPad;
