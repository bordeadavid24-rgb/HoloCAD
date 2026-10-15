import { loadEnv } from "vite";
import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const env = loadEnv("development", root, "ELEVENLABS_");
const key = env.ELEVENLABS_API_KEY;
const voice = env.ELEVENLABS_VOICE_ID || "JBFqnCBsd6RMkjVDRZzb";
if (!key) throw new Error("Configure ELEVENLABS_API_KEY in .env.local.");
const scripts = {
  piston:
    "Acesta este un piston. Se deplasează în cilindru, sub acțiunea presiunii gazelor. Segmenții de pe margine contribuie la etanșare. Prin bielă, pistonul transmite mișcarea către arborele cotit. Piesa a fost separată pentru a putea vedea mai bine forma și rolul ei. Modelul prezentat simplifică mecanismul.",
  rod: "Aceasta este o bielă. Face legătura dintre piston și arborele cotit. Capătul mic se articulează la piston, iar capătul mare urmărește fusul arborelui cotit. Împreună, aceste articulații permit transformarea mișcării alternative în rotație. Separarea piesei este ilustrativă, nu o procedură de service.",
  heads:
    "Privește ansamblul distribuției. Arborii cu came comandă deschiderea supapelor. Supapele controlează admisia și evacuarea gazelor, în sincron cu mișcarea pistoanelor. Într-un motor în patru timpi, arborele cu came se rotește cu jumătate din viteza arborelui cotit. Această reprezentare arată principiul general, nu un motor fabricat anume.",
  block:
    "Acesta este blocul motor. Susține cilindrii și componentele mecanismului. Într-un motor real, include zone pentru circulația lichidului de răcire și a uleiului. Aici, carcasa este transparentă și separată, pentru a face vizibile relațiile dintre piesele interioare. Detaliile constructive depind de modelul real studiat.",
  hardware:
    "HoloCAD este un concept în dezvoltare. Suprafețele transparente reflectă imaginile prin principiul Pepper's Ghost. Ele creează o iluzie cu aspect holografic, nu o hologramă în spațiu liber. Afișajul furnizează imaginile, pregătite de aplicația de pe laptop. Sub el, carcasa va integra electronica de alimentare și conectare. Difuzorul va reda explicațiile vocale, alături de model. Componentele și dimensiunile finale vor fi alese și testate în prototipare.",
  pistons:
    "Privește pistoanele evidențiate. În acest model demonstrativ, ele se deplasează în interiorul cilindrilor. Bielele leagă pistoanele de arborele cotit. Împreună, aceste piese transformă mișcarea alternativă în mișcare de rotație. Animația simplifică mecanismul, pentru a face legătura dintre componente mai ușor de urmărit.",
  crankshaft:
    "Arborele cotit este piesa evidențiată din partea inferioară a motorului. Primește mișcarea pistoanelor prin intermediul bielelor și o transformă în rotație. Contragreutățile ajută la echilibrarea ansamblului. Aceasta este o explicație ilustrativă a mecanismului, nu o simulare inginerească validată.",
  assembly:
    "Să privim motorul piesă cu piesă. În partea de sus se află distribuția, cu arbori cu came și supape. Mai jos vezi pistoanele și bielele. La bază se află arborele cotit. Descompunerea separă aceste grupe pentru a evidenția relațiile lor spațiale. Pentru explicații corecte despre un model real, HoloCAD va avea nevoie de denumiri de piese și informații tehnice.",
};
const output = fileURLToPath(new URL("../public/audio/", import.meta.url));
await mkdir(output, { recursive: true });
const only = process.argv
  .find((arg) => arg.startsWith("--only="))
  ?.slice(7)
  .split(",");
for (const [id, text] of Object.entries(scripts)) {
  if (only && !only.includes(id)) continue;
  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voice)}${id === "hardware" ? "/with-timestamps" : ""}?output_format=mp3_44100_128`,
    {
      method: "POST",
      headers: { "xi-api-key": key, "Content-Type": "application/json" },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.52,
          similarity_boost: 0.75,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
      signal: AbortSignal.timeout(60000),
    },
  );
  if (!response.ok) {
    const detail = await response.json().catch(() => ({}));
    const safe = String(
      detail.detail?.message ||
        detail.detail?.status ||
        "Check permissions, voice ID, or available credits.",
    )
      .replaceAll(key, "[redacted]")
      .slice(0, 400);
    throw new Error(`ElevenLabs HTTP ${response.status}: ${safe}`);
  }
  let audio;
  if (id === "hardware") {
    const result = await response.json();
    audio = Buffer.from(result.audio_base64, "base64");
    const alignment = result.normalized_alignment || result.alignment;
    if (!alignment)
      throw new Error("Hardware narration needs timestamp alignment.");
    const transcript = alignment.characters.join("");
    const sentences = Array.from(transcript.matchAll(/[^.!?]+[.!?]/gu)).map(
      (match) => ({
        text: match[0].trim(),
        start: alignment.character_start_times_seconds[match.index],
        end: alignment.character_end_times_seconds[
          match.index + match[0].length - 1
        ],
      }),
    );
    const timestamp = (value) =>
      new Date(Math.round(value * 1000)).toISOString().slice(11, 23);
    const videoOutput = fileURLToPath(
      new URL("../public/video/", import.meta.url),
    );
    await mkdir(videoOutput, { recursive: true });
    await writeFile(
      `${videoOutput}holocad-hardware.vtt`,
      "WEBVTT\n\n" +
        sentences
          .map(
            (sentence, i) =>
              `${i + 1}\n${timestamp(sentence.start)} --> ${timestamp(sentence.end)}\n${sentence.text}\n`,
          )
          .join("\n"),
    );
    const startOf = (phrase) =>
      alignment.character_start_times_seconds[
        Math.max(0, transcript.indexOf(phrase))
      ];
    const chapters = [
      {
        key: "optics",
        start: startOf("Suprafețele"),
        title: "Suprafețele optice",
        text: "Reflexiile creează aparența unui obiect suspendat. Principiul Pepper’s Ghost.",
      },
      {
        key: "display",
        start: startOf("Afișajul"),
        title: "Sursa de imagine",
        text: "Perspectivele modelului sunt pregătite de laptop și trimise către afișaj.",
      },
      {
        key: "electronics",
        start: startOf("Sub el"),
        title: "Electronica",
        text: "Alimentare și conectare, integrate în carcasa dispozitivului.",
      },
      {
        key: "speaker",
        start: startOf("Difuzorul"),
        title: "Modulul audio",
        text: "Explicații vocale care însoțesc explorarea modelului.",
      },
      {
        key: "base",
        start: startOf("Componentele și"),
        title: "Un prototip de construit",
        text: "Materialele, dimensiunile și integrarea vor fi validate prin prototipare.",
      },
    ];
    await writeFile(
      `${videoOutput}hardware-timing.json`,
      JSON.stringify(
        {
          duration: alignment.character_end_times_seconds.at(-1) + 1.2,
          chapters,
        },
        null,
        2,
      ),
    );
  } else audio = Buffer.from(await response.arrayBuffer());
  await writeFile(`${output}${id}.mp3`, audio);
  console.log(
    `Created Romanian ElevenLabs narration: ${id} (${audio.byteLength} bytes)`,
  );
}
