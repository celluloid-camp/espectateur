export interface Emoji {
  label: string;
  value: string;
}

export interface EmotionRecommended {
  emotion: string;
  score: number;
}

export const emojisArray: Emoji[] = [
  {
    label: "1F44D",
    value: "iLike",
  },
  {
    label: "1F44E",
    value: "iDontLike",
  },
  {
    label: "1F610",
    value: "neutral",
  },
  {
    label: "1F62F",
    value: "surprised",
  },
  {
    label: "1F601",
    value: "smile",
  },
  {
    label: "1F602",
    value: "laugh",
  },
  {
    label: "1F620",
    value: "angry",
  },
  {
    label: "1F61E",
    value: "sad",
  },
  {
    label: "1F979",
    value: "empathy",
  },
  {
    label: "1F628",
    value: "fearful",
  },
  {
    label: "1F92E",
    value: "disgusted",
  },
  {
    label: "1F9D0",
    value: "itsStrange",
  },
];

export const getEmojiFromName = (value: string): string => {
  const emoji = emojisArray.find((emoji) => emoji.value === value);
  return emoji?.label ?? '';
};



export const mapEmotionToEmojis = (emotionDetected: string): Emoji[] => {
  const emojis = (() => {
    switch (emotionDetected) {
      case "neutral":
        return [emojisArray.find((emoji) => emoji.value === "neutral")];
      case "happy":
        return [
          emojisArray.find((emoji) => emoji.value === "laugh"),
          emojisArray.find((emoji) => emoji.value === "smile"),
        ];
      case "surprised":
        return [
          emojisArray.find((emoji) => emoji.value === "surprised"),
          emojisArray.find((emoji) => emoji.value === "fearful"),
        ];
      case "fearful":
        return [
          emojisArray.find((emoji) => emoji.value === "surprised"),
          emojisArray.find((emoji) => emoji.value === "fearful"),
        ];
      case "angry":
        return [
          emojisArray.find((emoji) => emoji.value === "angry"),
          emojisArray.find((emoji) => emoji.value === "sad"),
          emojisArray.find((emoji) => emoji.value === "disgusted"),
        ];
      case "disgusted":
        return [
          emojisArray.find((emoji) => emoji.value === "angry"),
          emojisArray.find((emoji) => emoji.value === "sad"),
          emojisArray.find((emoji) => emoji.value === "disgusted"),
        ];
      case "sad":
        return [
          emojisArray.find((emoji) => emoji.value === "angry"),
          emojisArray.find((emoji) => emoji.value === "sad"),
          emojisArray.find((emoji) => emoji.value === "disgusted"),
        ];
      case "iLike":
        return [emojisArray.find((emoji) => emoji.value === "neutral")];
      case "iDontLike":
        return [emojisArray.find((emoji) => emoji.value === "iDontLike")];
      case "laugh":
        return [emojisArray.find((emoji) => emoji.value === "laugh")];
      case "smile":
        return [emojisArray.find((emoji) => emoji.value === "smile")];
      case "empathy":
        return [emojisArray.find((emoji) => emoji.value === "empathy")];
      case "itsStrange":
        return [emojisArray.find((emoji) => emoji.value === "itsStrange")];
      default:
        return [emojisArray.find((emoji) => emoji.value === "neutral")];
    }
  })().filter((item): item is Emoji => item !== undefined);

  return emojis;
};
