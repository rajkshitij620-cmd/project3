import { useState, useEffect } from 'react';

/**
 * useTypewriter
 * @param {string}  text        - Full string to reveal character by character
 * @param {number}  speed       - Milliseconds per character (default 38)
 * @param {number}  startDelay  - Delay in ms before first character appears (default 600)
 * @returns {{ displayed: string, done: boolean }}
 */
export default function useTypewriter(text, speed = 38, startDelay = 600) {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed('');
    setDone(false);

    let intervalId = null;
    let charIndex = 0;

    const startTyping = () => {
      intervalId = setInterval(() => {
        charIndex += 1;
        setDisplayed(text.slice(0, charIndex));
        if (charIndex >= text.length) {
          clearInterval(intervalId);
          setDone(true);
        }
      }, speed);
    };

    const timeoutId = setTimeout(startTyping, startDelay);

    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
}
