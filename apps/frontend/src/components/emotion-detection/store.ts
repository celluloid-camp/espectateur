import { create } from 'zustand'
import { useShallow } from 'zustand/react/shallow'


interface AutoDetectionState {
  isEnabled: boolean
  setIsEnabled: (enabled: boolean) => void
  autoDetection: boolean
  autoDetectionMode: "auto" | "auto/reco/me" | "auto/reco/allusers",
  setAutoDetectionMode: (autoDetectionMode: "auto" | "auto/reco/me" | "auto/reco/allusers") => void
  setAutoDetection: (autoDetection: boolean) => void
  detectedEmotion: string | null
  setDetectedEmotion: (detectedEmotion: string | null) => void
}

export const useAutoDetectionStore = create<AutoDetectionState>((set) => ({
  isEnabled: true,
  setIsEnabled: (enabled) => set({ isEnabled: enabled }),
  autoDetection: false,
  setAutoDetection: (autoDetection) => set({ autoDetection, detectedEmotion: null }),
  detectedEmotion: null,
  setDetectedEmotion: (detectedEmotion) => set({ detectedEmotion }),
  autoDetectionMode: "auto",
  setAutoDetectionMode: (autoDetectionMode: "auto" | "auto/reco/me" | "auto/reco/allusers") => set({ autoDetectionMode }),
}))


export const useAutoDetectionMode = () => useAutoDetectionStore(useShallow((state) => ({
  autoDetection: state.autoDetection,
  autoDetectionMode: state.autoDetectionMode,
  setAutoDetectionMode: state.setAutoDetectionMode,
}))
)


interface PlayerModeState {
  mode: "performance" | "analysis";
  setMode: (mode: "performance" | "analysis") => void;
}

export const usePlayerModeStore = create<PlayerModeState>((set) => ({
  mode: "analysis",
  setMode: (mode) => set({ mode }),
}))


