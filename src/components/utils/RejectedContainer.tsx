import { AlertCircle, MoveLeft, MessageCircleMore, Mic, RotateCw, Pause, Play } from "lucide-react";
import { useState, useEffect, useRef } from "react";

interface RejectedContainerProps {
    setIsRejecting: (value: boolean) => void;
    handleAction: (action: string, reason: string) => void;
}

export const TextContainer = ({rejectionReason, setRejectionReason, setIsChatClicked}: {rejectionReason: string, setRejectionReason: (value: string) => void, setIsChatClicked: (value: boolean) => void}) => {
    return (
        <form 
            className="flex flex-col gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                setIsChatClicked(false);
            }}
        >
            <textarea
                className="p-2 border border-[#E5E5E5] rounded-lg outline-none resize-none"
                rows={3}
                cols={50}
                placeholder="Enter your rejection reason here..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                required
            />
            <button 
                type="submit" 
                className="bg-[#4BB543] text-white rounded-lg py-2 px-4"
                onClick={(e) => {
                    e.preventDefault();
                    setIsChatClicked(false);
                }}
            >
                Done
            </button>
        </form>
    )
}

export const VoiceContainer = ({ setIsVoiceClicked, setAudio }: {setIsVoiceClicked: (value: boolean) => void, setAudio: (value: string | null) => void}) => {

    const [isRecording, setIsRecording] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [timer, setTimer] = useState(0);
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isRecording]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            
            const chunks: BlobPart[] = [];
            recorder.ondataavailable = (event) => {
                chunks.push(event.data);
            };

            recorder.onstop = () => {
                const audioBlob = new Blob(chunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                setAudio(url);
            };
            
            recorder.start();
            setIsRecording(true);
        } catch (err) {
            console.error("Error accessing microphone:", err);
        }
    };

    const stopRecording = () => {
        if (mediaRecorder && mediaRecorder.state === "recording") {
            mediaRecorder.stop();
            setIsRecording(false);
        }
    };

    const resetRecording = () => {
        if (audioUrl) {
            URL.revokeObjectURL(audioUrl);
        }
        if (mediaRecorder) {
            const tracks = mediaRecorder.stream.getTracks();
            tracks.forEach(track => track.stop());
        }
        setAudioUrl(null);
        setTimer(0);
        setIsPlaying(false);
        setMediaRecorder(null);
    };

    const togglePlayback = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return(
        <div className="flex flex-col gap-4">
            <audio ref={audioRef} src={audioUrl || ''} onEnded={() => setIsPlaying(false)} />
            <div className="flex items-center justify-center py-8 px-12 gap-20 rounded-lg bg-[#D9D9D9]">
                <RotateCw 
                    className="w-10 h-10 text-[#818181] cursor-pointer" 
                    onClick={resetRecording}
                />
                <div className="rounded-full bg-white min-w-12 min-h-12 flex items-center justify-center">
                    {isRecording ? (
                        <Pause 
                            className="w-6 h-6 text-black cursor-pointer"
                            onClick={stopRecording}
                        />
                    ) : audioUrl ? (
                        <div onClick={togglePlayback} className="cursor-pointer">
                            {isPlaying ? (
                                <Pause className="w-6 h-6 text-black" />
                            ) : (
                                <Play className="w-6 h-6 text-black" />
                            )}
                        </div>
                    ) : (
                        <div
                            className="min-w-8 min-h-8 bg-[#F55555] rounded-full cursor-pointer"
                            onClick={startRecording}
                        />
                    )}
                </div>
                <div className="text-3xl text-[#818181]">
                    {formatTime(timer)}
                </div>
            </div>
            <button
                type="submit" 
                className="bg-[#4BB543] text-white rounded-lg py-2 px-4"
                onClick={(e) => {
                    e.preventDefault();
                    if (isRecording) stopRecording();
                    setIsVoiceClicked(false);
                }}
            >
                Done
            </button>
        </div>
    )
}


const RejectedContainer = ({setIsRejecting, handleAction }: RejectedContainerProps) => {

    const [rejectionReason, setRejectionReason] = useState("");
    const [isChatClicked, setIsChatClicked] = useState(false);
    const [isVoiceClicked, setIsVoiceClicked] = useState(false);
    const [audio, setAudio] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const formatTime = (seconds: number) => {
        if (!seconds || isNaN(seconds)) return "00:00";
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const togglePlayback = () => {
        if (audio) {
            if (!audioRef.current) {
                const newAudio = new Audio(audio);
                audioRef.current = newAudio;
                
                newAudio.addEventListener('loadeddata', () => {
                    const audioDuration = newAudio.duration;
                    setDuration(audioDuration);
                    setCurrentTime(audioDuration);
                });

                newAudio.addEventListener('timeupdate', () => {
                    const remaining = newAudio.duration - newAudio.currentTime;
                    setCurrentTime(remaining);
                });

                newAudio.addEventListener('ended', () => {
                    setIsPlaying(false);
                    setCurrentTime(newAudio.duration);
                });
            }

            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

  return (
    <div className="w-full flex flex-col items-center gap-8">
        <AlertCircle className="w-20 h-20 text-[#F55555]" />
        <div className="flex flex-col items-center gap-4">
            <span className="text-4xl">Rejected.</span>
            <span className="text-lg text-[#818181]">Choose a method to provide reason for rejection.</span>
        </div>
        {isChatClicked ? 
            <TextContainer
                rejectionReason={rejectionReason}
                setRejectionReason={setRejectionReason}
                setIsChatClicked={setIsChatClicked}
            />
            : isVoiceClicked ? (
                <VoiceContainer 
                    setIsVoiceClicked={setIsVoiceClicked}
                    setAudio={setAudio}
                />
            )
            : (
                <>
                    <div className="flex gap-8">
                        {
                            rejectionReason.length > 0 ? 
                                <textarea
                                    className="p-2 border border-[#E5E5E5] rounded-lg outline-none resize-none"
                                    rows={2}
                                    cols={25}
                                    placeholder="Enter your rejection reason here..."
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    required
                                /> : 
                                <div className="flex items-center justify-center p-4 rounded-full cursor-pointer bg-[#4BB543] text-white shadow-2xl">
                                    <MessageCircleMore className="w-[45px] h-[45px]" onClick={() => setIsChatClicked(true)} />
                                </div>
                        }
                        {
                            audio ? (
                                <div className="flex flex-col gap-4">
                                    <div className="flex items-center justify-center gap-4 border border-[#D9D9D9] p-4 min-w-[200px] rounded-lg">
                                        {isPlaying ? (
                                            <Pause
                                                className="w-6 h-6 text-black cursor-pointer"
                                                onClick={togglePlayback}
                                            />
                                        ) : (
                                            <Play
                                                className="w-6 h-6 text-black cursor-pointer"
                                                onClick={togglePlayback}
                                            />
                                        )}
                                        <span className="text-sm text-[#818181]">{formatTime(currentTime)}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4">
                                        <div />
                                        <RotateCw className="w-[45px] h-[45px]" onClick={() => setAudio(null)} />
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center p-4 rounded-full cursor-pointer bg-[#37A3CF] text-white shadow-2xl">
                                    <Mic className="min-w-[45px] min-h-[45px] max-w-[45px] max-h-[45px]" onClick={() => setIsVoiceClicked(true)} />
                                </div>
                            )
                        }
                    </div>
                </>
        )}
        <div className="flex justify-center items-center gap-2 cursor-pointer" onClick={() => setIsRejecting(false)}>
            <MoveLeft className="w-6 h-6" />
            <span>Go Back</span>
        </div>
    </div>
  )
}

export default RejectedContainer