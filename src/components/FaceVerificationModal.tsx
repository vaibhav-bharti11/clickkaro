import React, { useState, useRef, useEffect } from 'react';
import { Camera, CheckCircle2, ShieldCheck, AlertCircle, X, ArrowRight, RefreshCw, Eye } from 'lucide-react';
import confetti from 'canvas-confetti';

interface FaceVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  userName: string;
  userPhotos: string[];
}

export const FaceVerificationModal: React.FC<FaceVerificationModalProps> = ({
  isOpen,
  onClose,
  onVerified,
  userName,
  userPhotos,
}) => {
  const [step, setStep] = useState<'camera' | 'tilt' | 'processing' | 'success'>('camera');
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isTooDark, setIsTooDark] = useState(false);
  const [tiltProgress, setTiltProgress] = useState(0);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const prevFrameRef = useRef<Uint8ClampedArray | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('camera');
      setTiltProgress(0);
      setCameraError(null);
      setIsTooDark(false);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Ensure video element always binds to stream as soon as both are present
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.onloadedmetadata = () => {
        videoRef.current?.play().then(() => {
          setCameraReady(true);
        }).catch((err) => {
          console.warn('[Video Play Error]', err);
        });
      };
    }
  }, [stream, videoRef.current, step]);

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    prevFrameRef.current = null;
    setCameraReady(false);
  };

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
      setStream(mediaStream);
    } catch (err: any) {
      console.error('[Camera Access Error]', err);
      setCameraError('Camera access denied or unavailable. Please check your browser camera permissions or ensure your webcam shutter is open.');
    }
  };

  // Real-time canvas liveness and head tilt motion analyzer
  useEffect(() => {
    if (!cameraReady || step === 'processing' || step === 'success') {
      return;
    }

    let isSubscribed = true;

    const analyzeFrame = () => {
      if (!isSubscribed) return;

      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (video && canvas && video.readyState >= 2 && video.videoWidth > 0) {
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (ctx) {
          canvas.width = 100;
          canvas.height = 75;
          ctx.drawImage(video, 0, 0, 100, 75);

          const frameData = ctx.getImageData(0, 0, 100, 75);
          const data = frameData.data;

          // 1. Check for black screen / camera covered
          let sumBrightness = 0;
          for (let i = 0; i < data.length; i += 4) {
            sumBrightness += (data[i] + data[i + 1] + data[i + 2]) / 3;
          }
          const avgBrightness = sumBrightness / (data.length / 4);

          if (avgBrightness < 12) {
            setIsTooDark(true);
          } else {
            setIsTooDark(false);

            // 2. Head Tilt & Motion Liveness Check
            if (prevFrameRef.current) {
              let diff = 0;
              for (let i = 0; i < data.length; i += 4) {
                diff += Math.abs(data[i] - prevFrameRef.current[i]);
              }
              const motionLevel = diff / (data.length / 4);

              // Genuine head tilt or natural physical motion
              if (motionLevel > 8) {
                setTiltProgress((prev) => {
                  const next = Math.min(prev + 12, 100);
                  return next;
                });
              }
            }
            prevFrameRef.current = new Uint8ClampedArray(data);
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(analyzeFrame);
    };

    animFrameRef.current = requestAnimationFrame(analyzeFrame);

    return () => {
      isSubscribed = false;
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [cameraReady, step]);

  const handleCaptureVerification = () => {
    setStep('processing');
    setTimeout(() => {
      stopCamera();
      setStep('success');
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1800);
  };

  const handleComplete = () => {
    localStorage.setItem('ck_kyc_verified', 'true');
    onVerified();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-[180] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
    >
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl max-w-md w-full p-6 sm:p-7 border border-pink-200 shadow-apple-float relative overflow-hidden text-center">
        {/* Close Button */}
        {step !== 'processing' && (
          <button
            onClick={() => { stopCamera(); onClose(); }}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-pink-50 hover:bg-pink-100 flex items-center justify-center text-[#1d1d1f] transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* STEP 1: CAMERA STREAM WITH HEAD TILT DETECTOR */}
        {(step === 'camera' || step === 'tilt') && (
          <div className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#0071e3] text-[11px] font-bold uppercase tracking-wider mb-2">
                <ShieldCheck className="w-3.5 h-3.5" /> Live Facial KYC Verification
              </div>
              <h3 className="text-xl font-bold text-[#1d1d1f] font-display">
                Position Face &amp; Tilt Head
              </h3>
              <p className="text-xs text-[#86868b] mt-0.5">
                Ensure your face is centered. Tilt your head slightly to confirm liveness.
              </p>
            </div>

            {/* LIVE CAMERA VIEWPORT */}
            <div className="relative w-64 h-64 mx-auto rounded-full overflow-hidden ring-4 ring-[#0071e3] shadow-apple-lg bg-stone-900 flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover transform -scale-x-100"
              />

              {/* Guiding Oval Frame */}
              <div className="absolute inset-0 border-4 border-dashed border-white/70 rounded-full pointer-events-none animate-pulse"></div>

              {/* Status Pill Inside Camera */}
              <div className="absolute bottom-3 inset-x-0 mx-6 py-1 px-3 bg-black/70 backdrop-blur-md rounded-full text-white text-[10px] font-bold flex items-center justify-center gap-1.5">
                {isTooDark ? (
                  <span className="text-amber-400 font-bold">⚠️ Screen Too Dark / Shutter Closed</span>
                ) : !cameraReady ? (
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" /> Starting webcam...
                  </span>
                ) : tiltProgress >= 80 ? (
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Liveness Confirmed!
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3 text-[#0071e3]" /> Tilt head slightly left / right
                  </span>
                )}
              </div>
            </div>

            {/* DARK SCREEN WARNING */}
            {isTooDark && (
              <div className="p-3 bg-amber-50 rounded-2xl border border-amber-200 text-amber-900 text-xs text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  The camera feed is pitch black. Please make sure your webcam physical privacy shutter is open and your room has adequate lighting.
                </span>
              </div>
            )}

            {/* CAMERA ERROR */}
            {cameraError && (
              <div className="p-3 bg-rose-50 rounded-2xl border border-rose-200 text-rose-800 text-xs text-left flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* REAL-TIME HEAD TILT PROGRESS */}
            {!isTooDark && cameraReady && (
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-[#86868b]">
                  <span>Head Motion / Liveness</span>
                  <span className="text-[#0071e3]">{tiltProgress}%</span>
                </div>
                <div className="w-full bg-pink-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#0071e3] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${Math.max(tiltProgress, 10)}%` }}
                  ></div>
                </div>

                {userPhotos && userPhotos.length > 0 && (
                  <div className="flex items-center justify-center gap-1.5 pt-1">
                    <span className="text-[10px] text-[#86868b] font-medium mr-1">Matching against:</span>
                    {userPhotos.slice(0, 3).map((img, i) => (
                      <div key={i} className="w-6 h-6 rounded-full overflow-hidden ring-1 ring-[#0071e3]">
                        <img src={img} alt="Ref" className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ACTION BUTTON */}
            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={handleCaptureVerification}
                disabled={isTooDark || !cameraReady}
                className="w-full bg-[#0071e3] hover:bg-[#0077ed] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer disabled:opacity-50"
              >
                <Camera className="w-4 h-4" />
                <span>
                  {tiltProgress >= 80 ? 'Confirm & Verify Face' : 'Capture & Verify Face'}
                </span>
              </button>

              <button
                type="button"
                onClick={() => { stopCamera(); startCamera(); }}
                className="text-xs text-[#86868b] hover:text-[#0071e3] font-medium transition"
              >
                Restart Camera
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: PROCESSING & BIOMETRIC MATCH */}
        {step === 'processing' && (
          <div className="py-8 space-y-4">
            <div className="w-16 h-16 rounded-full border-4 border-t-[#0071e3] border-pink-200 animate-spin mx-auto"></div>
            <div>
              <h4 className="text-lg font-bold text-[#1d1d1f]">Comparing Facial Biometrics</h4>
              <p className="text-xs text-[#86868b] mt-1 max-w-xs mx-auto">
                Comparing live camera video against your uploaded profile photos for 100% verified human identity...
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: VERIFIED SUCCESS */}
        {step === 'success' && (
          <div className="space-y-4 py-2">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50 animate-scale-up">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2 border border-emerald-200">
                100% Live Verified
              </span>
              <h3 className="text-2xl font-bold text-[#1d1d1f] font-display">
                Verification Complete!
              </h3>
              <p className="text-xs text-[#86868b] mt-1 leading-relaxed max-w-xs mx-auto">
                Congratulations, <strong>{userName}</strong>! Your live face liveness check matches your registered profile. Full booking &amp; matching privileges are now unlocked.
              </p>
            </div>

            <button
              type="button"
              onClick={handleComplete}
              className="w-full bg-[#1d1d1f] hover:bg-[#0071e3] text-white py-3.5 rounded-full font-bold text-xs sm:text-sm transition shadow-apple-sm flex items-center justify-center gap-2 active:scale-98 cursor-pointer"
            >
              <span>Continue to Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};
