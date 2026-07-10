"use client";
import { useState, ChangeEvent, useRef, useEffect } from "react";


export default function Home() {
  const refvar = useRef<HTMLInputElement>(null);
   
  const handleClick = () => {
	  console.log(refvar.current.value);
	  alert(refvar.current.value)
  };

  return (
    <div>
	  <label>hi</label>
	  <br />
      <input ref={refvar} className="bg-gray-700" />
	  <br />
	  <button onClick={handleClick}>click me</button>
    </div>
  );
}
