# Lossy vs. Lossless Compression
### CS Principles Lesson

---

## Key Vocabulary

| Term | Definition |
|---|---|
| **Compression** | Reducing the size of a file by encoding data more efficiently |
| **Lossless** | Compression where the original file can be perfectly reconstructed |
| **Lossy** | Compression where some data is permanently discarded to save space |
| **Artifact** | A visual/audio distortion caused by heavy lossy compression |

---

## The Core Analogy: Packing a Suitcase

- **Lossless** = vacuum-sealing your clothes. Everything fits, and you unpack everything exactly as it was.
- **Lossy** = leaving your socks behind to save space. The suitcase is lighter, but those socks are gone forever.

> Key insight: with lossy compression, the original **cannot** be restored.

---

## Lossy vs. Lossless at a Glance

| | **Lossless** | **Lossy** |
|---|---|---|
| Original recoverable? | ✅ Yes | ❌ No |
| File size reduction | Moderate | Large |
| Common formats | PNG, ZIP, FLAC | JPEG, MP3, MP4 |
| Best for | Code, medical images, legal docs | Music, video, web photos |

---

## The Telephone Compression Game

Pass a sheet of paper around the class with this paragraph:

> *"Yesterday afternoon, a young girl with curly red hair and a bright yellow raincoat was walking her fluffy golden retriever through Maplewood Park. It had just stopped raining, and the puddles on the stone path reflected the gray sky above. She stopped near the old oak tree by the fountain to let her dog drink some water, while a group of pigeons scattered around her feet. She checked her silver watch, realized she was late, and hurried toward the park exit."*

Each student rewrites it in half the words and passes it on. Compare the final version to the original — that degradation **is** lossy compression.

**Debrief:** What if you used abbreviations but kept every word? That's lossless!

---

## Sample MCQ Questions

**Q1.** Which of the following is true about lossy compression?

- A) The original file can always be perfectly reconstructed
- B) It results in larger file sizes than the original
- C) **Some data is permanently removed to reduce file size ✅**
- D) It is only used for text files

---

**Q2.** Which scenario would most likely require lossless compression?

- A) Uploading a vacation photo to Instagram
- B) Streaming a podcast episode
- C) **Storing a patient's MRI scan in a hospital database ✅**
- D) Sending a voice message to a friend