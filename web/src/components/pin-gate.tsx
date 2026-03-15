"use client";

import { useState, useEffect, useRef } from "react";
import { Lotus } from "./line-art";

interface PinGateProps {
  children: React.ReactNode;
}

export function PinGate({ children }: PinGateProps) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pin, setPin] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shaking, setShaking] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("coach-auth");
    if (stored === "true") {
      setAuthenticated(true);
    }
    setChecking(false);
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newPin = [...pin];
    newPin[index] = value.slice(-1);
    setPin(newPin);
    setError(false);

    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all 4 digits entered
    if (value && index === 3) {
      const entered = newPin.join("");
      verifyPin(entered);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newPin = pasted.split("");
      setPin(newPin);
      verifyPin(pasted);
    }
  };

  const verifyPin = async (entered: string) => {
    try {
      const res = await fetch("/api/verify-pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin: entered }),
      });
      const data = await res.json();
      if (data.ok) {
        localStorage.setItem("coach-auth", "true");
        setAuthenticated(true);
      } else {
        triggerError();
      }
    } catch {
      triggerError();
    }
  };

  const triggerError = () => {
    setError(true);
    setShaking(true);
    setTimeout(() => {
      setShaking(false);
      setPin(["", "", "", ""]);
      inputRefs.current[0]?.focus();
    }, 500);
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center">
        <Lotus size={32} color="#7BAE7F" className="animate-pulse" />
      </div>
    );
  }

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-cream-100 flex flex-col items-center justify-center px-6">
      <div className="mb-8 text-center">
        <Lotus size={40} color="#7BAE7F" className="mx-auto mb-4" />
        <h1 className="text-2xl font-semibold text-cream-900 tracking-tight">Welcome back</h1>
        <p className="text-sm text-cream-600 font-light mt-1">Enter your PIN to continue</p>
      </div>

      <div
        className={`flex gap-3 mb-6 ${shaking ? "animate-shake" : ""}`}
        style={shaking ? { animation: "shake 0.4s ease-in-out" } : {}}
      >
        {pin.map((digit, i) => (
          <input
            key={i}
            ref={(el) => { inputRefs.current[i] = el; }}
            type="password"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            autoFocus={i === 0}
            className={`w-14 h-14 text-center text-xl font-mono rounded-2xl border-2 bg-white outline-none transition-all ${
              error
                ? "border-rose-soft text-rose-soft"
                : digit
                ? "border-sage text-cream-900"
                : "border-cream-300 text-cream-900 focus:border-sage"
            }`}
          />
        ))}
      </div>

      {error && (
        <p className="text-sm text-rose-soft font-light">Wrong PIN, try again</p>
      )}

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
}
