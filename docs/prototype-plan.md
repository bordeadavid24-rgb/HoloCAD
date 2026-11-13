# First prototype and classroom validation plan

This is a future implementation brief and recording procedure, not proof of a working physical device. David confirmed on November 13 that physical prototyping happens only if HoloCAD reaches the further competition phase. Do not begin fabrication or purchases now. David is already working on the application; inspect that work separately before assessing its status. The likely hardware team is David, Petre and Stefan, with Tulica as professor/coordinator.

## What an optical test rig means

Think of a temporary experiment on a desk, before designing a finished box. A screen displays a bright object against black. An angled transparent reflective sheet redirects some of that screen light toward the viewer, so the image appears inside or behind the display volume. The exact optical arrangement must be chosen and tested; the website render is not a measurement or construction drawing.

The rig is simply the screen, a stable adjustable support for the reflective material and a marked viewing position. Start with a high-contrast square, letters or a simple engine part. Change one variable at a time: sheet angle/material, screen position/brightness or room lighting. Record whether the viewer sees a readable floating image, glare, a second reflection or misaligned views. Test one face before attempting several.

This answers practical questions cheaply: can the class see it, how large is the readable image, where must people stand, and does the available screen work? Once those results are known, choose the final material, dimensions, mounting and enclosure. There is no confirmed angle, sheet thickness, device size or Raspberry Pi requirement yet. Use stable supports and supervisor-approved materials when the deferred experiment begins.

## First demonstrable learning experience

Use one engine model with distinct piston, connecting rod and crankshaft components. A learner should be able to identify the three parts, select and isolate each one, and explain how they work together. Begin with teacher-reviewed explanations and prepared narration. Treat live AI as a later, separately measured capability.

The end-to-end demonstration is complete when an approved model opens on the actual demonstration computer, its components can be selected and recomposed, a reviewed explanation is available with or without sound, and correctly oriented views appear in the physical display. It must restart successfully without relying on a developer's terminal or a network connection for prepared content.

## Decisions to supply

Record the demonstration OS/computer, available screen and connectors, intended learner age/lesson, classroom lighting, viewing distance, transport needs, total budget, owner and next review date. Do not order a controller board or finalize enclosure dimensions before these are known.

## Optical validation procedure

1. Use an adjustable rig and an approved screen showing a simple high-contrast alignment image on black. Test one reflection before adding multiple faces/views.
2. Record the screen size/settings, reflective material, geometry, distances, ambient light and camera position. Mark the intended viewing zone.
3. Check orientation, alignment and whether thin lines, labels and separated parts remain readable. Observe duplicate reflections, direct-screen visibility and glare.
4. Compare each candidate using identical content and conditions. Photograph the real result without presenting a render as a capture.
5. Bring the working setup into its intended room and repeat. Choose materials and enclosure geometry from the results.
6. Save the chosen calibration values and a reproducible setup drawing. Test assembly, transport, recovery and a full-duration demonstration.

Use this recording table for each trial:

| Trial | Screen/settings | Material/geometry | Lighting/viewing position | Readability/alignment problems | Photo reference | Decision |
| --- | --- | --- | --- | --- | --- | --- |

No optical dimensions, screen brightness requirements or controller model are confirmed by this document.

## Application acceptance checks

| Flow | Evidence required |
| --- | --- |
| Import | Approved model opens; unsupported/corrupt input gives a recoverable error |
| Explore | Rotate/zoom/select/isolate work; component tree and highlight agree |
| Separate | Parts separate intelligibly and return to the original assembly |
| Explain | Names and text match the selected component and teacher-reviewed references |
| Audio | Playback is explicit, can be stopped/muted, and does not overlap |
| Output | Reflected views have the correct orientation and saved calibration |
| Offline | Prepared model/text/audio work after disconnecting internet and restarting |
| Recovery | Reset restores a usable view; missing content does not crash the demonstration |
| Packaging | Application launches on the actual demonstration computer without developer setup |

## Supervised learner test

The teacher chooses the lesson questions and expected answers. Suggested tasks: name the three highlighted parts; identify the connection between piston and crankshaft; explain how reciprocating motion becomes rotation; select a component and recover the complete assembly. Keep answers and scoring consistent between observations.

Record anonymous participant identifiers rather than names. Do not record photographs, voices or identifiable student information without the school-required permissions.

| Anonymous ID | Starting understanding | Task completed without help | Explanation after demo | Interaction/explanation difficulty | Technical failure |
| --- | --- | --- | --- | --- | --- |

Afterward, ask what remained confusing, what they expected a control to do and whether the physical display helped them notice a relationship. Ask the teacher about lesson fit, accuracy, visibility, setup effort and accessibility. Summarize counts and the exact context. A small exploratory test does not establish a general learning benefit.

## AI evaluation, only if implemented

Create reviewed questions covering known components, ambiguous references, unavailable facts and unrelated requests. For each, record the expected behavior, actual answer, source/component match, teacher assessment, latency, hardware and failure/recovery behavior. Require an explicit uncertainty response when the model metadata cannot support an answer.

## Demo script

Show the real device, open the approved model, select a piston, isolate the connecting rod, explain its connection to the crankshaft, recompose and reset. State which parts are implemented and which are planned. Keep an offline screen recording available if a hardware or display failure interrupts the demonstration.
