import { useEffect, useRef, useState } from 'react'
import { Volume2, VolumeX } from 'lucide-react'
import { invitation } from '../data'
import './MusicToggle.css'

export function MusicToggle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [available, setAvailable] = useState(true)

  useEffect(() => {
    const audio = new Audio(invitation.music.src)
    audio.loop = true
    audio.preload = 'auto'
    audio.volume = 0.55
    audioRef.current = audio
    const onPlay = () => setPlaying(true)
    const onPause = () => setPlaying(false)
    const onError = () => setAvailable(false)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)
    audio.addEventListener('error', onError)
    return () => {
      audio.pause()
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
      audio.removeEventListener('error', onError)
      audioRef.current = null
    }
  }, [])

  if (!available) return null

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => setAvailable(false))
    }
  }

  return (
    <button
      type="button"
      className={`music-toggle${playing ? ' music-toggle--playing' : ''}`}
      onClick={toggle}
      aria-pressed={playing}
      aria-label={playing ? 'Mute background music' : 'Play background music'}
    >
      {playing ? <Volume2 size={19} strokeWidth={2} /> : <VolumeX size={19} strokeWidth={2} />}
    </button>
  )
}

export default MusicToggle
