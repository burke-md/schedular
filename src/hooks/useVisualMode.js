import { useState } from "react";
export default function useVisualMode(initial) {
  const [mode, setMode] = useState(initial);
  const [history, setHistory] = useState([initial]);

  function transition(newMode, replace = false) {
    const stack = [...history];
    setMode(newMode);

    if (replace) {
      stack.pop();
    }

    stack.push(newMode);
    setHistory(stack);
  }

  function back() {
    //Prevent back if there is no history
    if (history.length > 1){
      const stack = [...history]
      stack.pop()
      setHistory(stack)
      setMode(stack[stack.length -1]);
    }
  }

  return { mode, transition, back };
}
