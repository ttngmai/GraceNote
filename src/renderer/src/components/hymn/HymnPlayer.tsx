import { useEffect, useRef, useState } from 'react'
import ReactPlayer from 'react-player'
import { OnProgressProps } from 'react-player/base'
import * as Slider from '@radix-ui/react-slider'
import { IconPlayerPause, IconPlayerPlay, IconVolume, IconVolumeOff } from '@tabler/icons-react'
import Button from '../common/Button'
import { formatTime } from '@renderer/utils/timeFormat'

type HymnPlayerProps = {
  url: string
  playbackRate: number
  onProgress?: (state: OnProgressProps) => void
}

export default function HymnPlayer({
  url,
  playbackRate,
  onProgress
}: HymnPlayerProps): JSX.Element {
  const playerRef = useRef<ReactPlayer>(null)

  const [playing, setPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [seeking, setSeeking] = useState<boolean>(false)
  const [muted, setMuted] = useState<boolean>(false)
  const [volume, setVolume] = useState<number>(0.5)
  const [progressInterval, setProgressInterval] = useState<number>(300)

  const handlePlayOrPause = (): void => {
    setPlaying(!playing)
  }

  const handleProgress = (state: OnProgressProps): void => {
    if (!seeking) {
      setCurrentTime(state.playedSeconds)
    }
    if (onProgress) {
      onProgress(state)
    }
  }

  const handleSliderChange = (value: number[]): void => {
    setCurrentTime(value[0])
  }

  const handleMuted = (): void => {
    setMuted(!muted)
  }

  const handleVolumeChange = (volume: number[]): void => {
    setVolume(volume[0])
    setMuted(volume[0] === 0 ? true : false)
  }

  const handleReady = (): void => {
    setPlaying(false)
  }

  const handleEnded = (): void => {
    setPlaying(false)
  }

  useEffect(() => {
    setCurrentTime(0)
  }, [url])

  useEffect(() => {
    if (seeking && playerRef.current) {
      playerRef.current.seekTo(currentTime / duration, 'fraction')
    }
  }, [currentTime, duration])

  useEffect(() => {
    setProgressInterval(playbackRate < 3 ? 200 : 100)
  }, [playbackRate])

  return (
    <div className="relative w-full h-full">
      <ReactPlayer
        ref={playerRef}
        controls={false}
        url={url}
        playing={playing && !seeking}
        muted={muted}
        volume={volume}
        playbackRate={playbackRate}
        onReady={handleReady}
        onDuration={setDuration}
        onProgress={handleProgress}
        onEnded={handleEnded}
        progressInterval={progressInterval}
        width="100%"
        height="100%"
      />
      <div className="absolute inset-0 flex flex-col">
        <Slider.Root
          max={duration}
          step={0.1}
          value={[currentTime]}
          onValueChange={handleSliderChange}
          onPointerDown={() => setSeeking(true)}
          onPointerUp={() => setSeeking(false)}
          className="flex items-center grow h-full select-none touch-none"
        >
          <Slider.Track className="relative grow h-4pxr bg-gray-300 rounded-full">
            <Slider.Range className="absolute h-full bg-brand-blue-500 rounded-full" />
          </Slider.Track>
          <Slider.Thumb className="block w-10pxr h-10pxr rounded-full bg-white shadow-[0_1px_4px] cursor-pointer focus:outline-none" />
        </Slider.Root>
        <div className="flex justify-between items-center">
          <div className="flex -ml-8pxr">
            <Button type="button" onClick={handlePlayOrPause} variant="ghost" size="icon">
              {playing ? <IconPlayerPause size={24} /> : <IconPlayerPlay size={24} />}
            </Button>
            <Button type="button" onClick={handleMuted} variant="ghost" size="icon">
              {muted ? <IconVolumeOff size={24} /> : <IconVolume size={24} />}
            </Button>
            <div className="relative w-80pxr ml-2pxr">
              <Slider.Root
                max={1}
                step={0.1}
                value={muted ? [0] : [volume]}
                onValueChange={handleVolumeChange}
                className="flex items-center grow h-full select-none touch-none"
              >
                <Slider.Track className="relative grow h-4pxr bg-gray-300 rounded-full">
                  <Slider.Range className="absolute h-full bg-brand-blue-500 rounded-full" />
                </Slider.Track>
                <Slider.Thumb className="block w-10pxr h-10pxr rounded-full bg-white shadow-[0_1px_4px] cursor-pointer focus:outline-none" />
              </Slider.Root>
            </div>
          </div>
          <span className="text-[18px] mr-1pxr">
            {formatTime(currentTime / playbackRate)} / {formatTime(duration / playbackRate)}
          </span>
        </div>
      </div>
    </div>
  )
}
