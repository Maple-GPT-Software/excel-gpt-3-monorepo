import React from 'react';

import './ExamplePrompts.style.css';

function ExamplePrompts() {
  return (
    <div className="example-prompt-wrapper">
      <h1> Examples </h1>
      <p className="example-prompt-element">
        "I have a column of numbers, how do I calculate the average?"
      </p>
      <p className="example-prompt-element">
        "How do I sort a column of names?"
      </p>
      <p className="example-prompt-element">
        "Explain the paramters of VLOOKUP?"
      </p>
    </div>
  );
}

export default ExamplePrompts;
