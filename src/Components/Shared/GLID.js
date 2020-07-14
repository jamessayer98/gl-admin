import React from 'react';

export function parseGLID(glid) {
  return parseInt(glid.replace('GL', ''));
}

export function makeGLID(id) {
  return 'GL' + String(id).padStart(6, '0');
}

export default function GLID({ id }) {
  console.log(makeGLID(id));
  return (
    <span>{makeGLID(id)}</span>
  );
}