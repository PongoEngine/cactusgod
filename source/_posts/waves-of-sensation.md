---
title: Waves of Sensation
album: twtwelve
date: 2023/07/14
hue: 10
---

In the domain of racing simulators, the pursuit of immersive experiences goes beyond the graphical representation of the racing environment. One crucial facet is haptic feedback, which enables players to 'feel' their virtual ride. This post will delve into how different waveforms – sawtooth, sine, and square – can convey detailed haptic information from multiple sources into a single feedback channel.

<!-- more -->

## Haptic Feedback: From Vibration to Perception

The vibrational language of haptic feedback enables players to sense everything from the hum of the engine to the nuances of the road surface. But there's a challenge: these sensations must be delivered through a limited set of actuators in a steering wheel or a gamepad. So how can we provide such a rich array of information through a single channel? The key lies in the waveforms that modulate these vibrations.

### Sine Waves: The RPM Rhythm

Consider the racing car's engine, its RPM (revolutions per minute) defining the throbbing heart of the vehicle. A sine wave, with its smooth and periodic oscillation, is a fitting choice to convey this heartbeat. By mapping the engine's RPM to the frequency and amplitude of a sine wave, we can create a palpable rhythm that increases as the engine revs higher and decreases as it slows, mimicking the real-life feel of a pulsating engine.

### Square Waves: Road Noise Reverberations

Now let's turn our attention to the interaction between the tires and the road surface, a critical factor in the driving experience. A square wave, with its abrupt transitions, is apt to represent the sudden jolts and bumps you'd experience while driving over uneven surfaces. By mapping road noise to the frequency and amplitude of a square wave, we can simulate the tactile feeling of the road, from the gentle hum of a smooth highway to the rough vibrations of an off-road trail.

### Sawtooth Waves: Slipping Tires 

Finally, there's tire slippage, a sensation critical for judging the limits of your car's grip. A sawtooth wave, with its ramp-like upswing and sudden drop, captures this feeling well. As the tires begin to lose traction, the rise in the sawtooth wave builds tension. The sudden drop then conveys the moment the tires lose grip entirely. By mapping the slippage to the frequency and amplitude of a sawtooth wave, we can create a rising sense of anticipation and a sudden release that mimics the feeling of tires slipping on the tarmac.

## Merging the Waves: The Art of Mixing

With three different waveforms representing distinct aspects of the driving experience, the next challenge is to blend them into a single output that our haptic devices can interpret. This process, known as mixing, requires careful attention to ensure that no single waveform overwhelms the others and all contribute to the overall feedback.

Typically, the mixing process involves normalizing the amplitude of each waveform relative to its importance to the feedback. The RPM sine wave, for example, might contribute significantly to the overall mix, while the sawtooth wave for tire slippage might only contribute under specific conditions (like when navigating a slippery turn).

## The Result: A Symphony of Sensation

Drawing parallels from how our ears distinguish a symphony of voices through minor details in their vocals, we aim to do something similar with haptic feedback. Our goal is to translate complex combinations of waveforms into distinct sensations, felt through the vibrations of the controller.

The blending process, known as 'mixing', uses a straightforward yet effective function:

```C
float mix(float a, float b)
{
  return (a + b) - a * b;
}
```

The `mix` function takes two inputs, `a` and `b`, representing two different waveforms. It combines them while ensuring the output stays within the system's maximum limit. This function prevents distortion or clipping in our haptic feedback, just like our ears can differentiate multiple voices singing in harmony without distortion.

So, we can mix the sine wave from the RPM, the square wave from the road noise, and the sawtooth wave from the tire slippage into a single waveform. This combined signal is used to drive the haptic feedback, enabling a nuanced sensation of the car's state.

The result is much like listening to a symphony. Just as our ears pick up the distinct sounds of different instruments, each contributing to the overall music, the haptic feedback system provides a layered sensation. Every turn of the wheel, press of the pedal, or slip of the tire creates a distinct tactile response, each adding to the immersive experience of the game.
