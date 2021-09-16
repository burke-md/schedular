

import { useState } from "react";

export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(element, replace = false) {
    if (replace) {
      history.pop();
      history.push(element);
      setHistory(history);
    } else {
      history.push(element);
      setHistory(history);
    }
    setMode(history[history.length - 1]);
  }

  function back() {
    //Prevent user from going back w/ no history
    if (history.length > 1) {
      history.pop();
      setHistory(history);
    }
    setMode(history[history.length - 1]);
  }

  return { mode, transition, back };
}
