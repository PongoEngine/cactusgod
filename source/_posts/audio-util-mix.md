---
title: Decoding the AUDIO_UTIL_mix function
album: twtwelve
date: 2023/07/11
hue: 350
---

{% attrs %}
{% endattrs %}

Racing simulators hinge on immersive experiences and achieving quality sound plays a significant role. The crux lies in accurately blending multiple audio signals without distortion or clipping - a consequence of exceeding the system's maximum limit.

<!-- more -->

The solution emerges in the AUDIO_UTIL_mix function. It effortlessly combines signals, curbs clipping, and maintains signal integrity, crucial for authentically reproducing sounds like the fluctuating car suspension heights during a virtual race.

```C
float AUDIO_UTIL_mix(float a, float b)
{
  return (a + b) - a * b;
}
```


Given `a` and `b` as the two signals, the values of `a` and `b` always lie within the range [0,1].

## Preventing Clipping

In traditional signal mixing, when you simply add together two signals (for example, `a + b`), it might result in a value that exceeds 1. This is what leads to the dreaded clipping effect. 

The AUDIO_UTIL_mix function avoids this issue by subtracting the product of `a` and `b` from their sum (`a + b - a * b`). The mathematical range for this operation is always [0,1] as long as the inputs `a` and `b` are within [0,1]. Here's why:

- At the maximum, when `a` and `b` are both 1, the output of the function is `1 + 1 - 1 * 1 = 1`.
- At the minimum, when `a` and `b` are both 0, the output is `0 + 0 - 0 * 0 = 0`.

So, regardless of the input values, the result always stays within the allowable signal range, thus successfully preventing clipping.

## Signal Preservation

A well-designed audio mixing function not only needs to prevent clipping but also ensure that the essence of each individual signal is maintained in the mixed output. Let's see how the AUDIO_UTIL_mix function handles this:

The component `(a * b)` in the equation can be interpreted as the 'interaction' between the two signals. As `a` or `b` gets closer to 0, the interaction term reduces thus making the combined signal closer to a linear sum of the two individual signals ensuring that the nature of the quieter signal is retained. On the other hand, as `a` or `b` approaches 1 the interaction becomes more significant which helps to maintain the overall amplitude limit without a significant loss of signal characteristics.