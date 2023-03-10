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
        "How do I sort a column of names from a to z?"
      </p>
      <p className="example-prompt-element">"Explain how VLOOKUP works"</p>
      <p className="example-prompt-element">
        If you're not sure where to start? See our {/* TODO: real link */}
        <a
          style={{ color: 'var(--primary-main)', textDecoration: 'none' }}
          href="https://google.com"
          target="_blank"
        >
          guide
        </a>
        .
      </p>
    </div>
  );
}

export default ExamplePrompts;
