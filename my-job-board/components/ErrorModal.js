"use client";
import { useId } from "react";
import Dialog from "./Dialog";
export default function ErrorModal({ message, onClose }) {
  const id = useId();
  if (!message) return null;
  return <Dialog titleId={id} onClose={onClose}><p className="eyebrow">LET’S TRY THAT AGAIN</p><h2 id={id}>Something needs attention.</h2><p role="alert" className="my-6 text-muted">{message}</p><button onClick={onClose} className="button button-dark w-full">Got it</button></Dialog>;
}
