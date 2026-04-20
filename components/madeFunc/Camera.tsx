"use client";

import { useRef, useState } from "react";
import { Video, VideoOff, FlipHorizontal2, Mic } from "lucide-react";

export default function CameraPage() {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [mirrored, setMirrored] = useState(false);

  // Mic states
  const [isListening, setIsListening] = useState(false);
  const [text, setText] = useState("");
  const recognitionRef = useRef<any>(null);

  // CAMERA
  const startCamera = async () => {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) videoRef.current.srcObject = mediaStream;
    setStream(mediaStream);
  };

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop());
    if (videoRef.current) videoRef.current.srcObject = null;
    setStream(null);
  };

  const isLive = !!stream;

  // SPEECH
  const toggleMic = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let transcript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }

      setText(transcript);
    };

    recognition.onerror = (err: any) => {
      console.error("Speech error:", err);
    };

    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="flex flex-col items-center gap-6 p-8 min-h-screen bg-[#f5eff0]">

      {/* Header */}
      <div className="flex items-center gap-3 self-start w-full max-w-2xl">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-[#544349]">
          <Video size={18} color="#fff" />
        </div>
        <h1 className="text-lg text-[#3a2e32]">Camera + Mic</h1>

        <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full text-xs bg-white">
          <span className={`w-2 h-2 rounded-full ${isLive ? "bg-green-400" : "bg-gray-300"}`} />
          {isLive ? "Live" : "Inactive"}
        </div>
      </div>

      {/* Video */}
      <div className="relative w-full max-w-2xl aspect-video rounded-2xl overflow-hidden bg-black">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
          style={{ transform: mirrored ? "scaleX(-1)" : "scaleX(1)" }}
        />

        {!isLive && (
          <div className="absolute inset-0 flex items-center justify-center text-gray-400">
            Camera Off
          </div>
        )}

        {isLive && (
          <button
            onClick={() => setMirrored((m) => !m)}
            className="absolute bottom-3 right-3 bg-black/50 p-2 rounded-full"
          >
            <FlipHorizontal2 size={16} color="#fff" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex gap-3">

        <button
          onClick={startCamera}
          disabled={isLive}
          className="px-4 py-2 bg-[#544349] text-white rounded-xl"
        >
          <Video size={16} /> Start
        </button>

        <button
          onClick={stopCamera}
          disabled={!isLive}
          className="px-4 py-2 bg-white border rounded-xl"
        >
          <VideoOff size={16} /> Stop
        </button>

        {/* MIC BUTTON */}
        <button
          onClick={toggleMic}
          className={`px-4 py-2 rounded-xl text-white flex items-center gap-2 ${
            isListening ? "bg-red-500" : "bg-[#7a6068]"
          }`}
        >
          <Mic size={16} />
          {isListening ? "Stop Mic" : "Start Mic"}
        </button>

      </div>

      {/* TRANSCRIPT OUTPUT */}
      <div className="w-full max-w-2xl p-4 bg-white rounded-xl border min-h-[80px]">
        <p className="text-sm text-[#3a2e32]">
          {text || "Speech will appear here..."}
        </p>
      </div>

    </div>
  );
}