---
title: The Science of Smash
album: twtwelve
date: 2023/07/13
hue: 50
---

The adrenaline rush in a racing simulator is not just about mastering the art of maneuvering around bends at dizzying speeds; it's also about the abruptness of a high-speed crash. But with limited telemetry data from the game often lacking specific collision information, how do we detect and quantify the severity of a crash?

Thankfully the regular updates we get from the simulator — 60 times a second, to be precise — provides an opportunity. This high-frequency data, specifically the velocity data, can be our secret weapon in detecting and quantifying crash events.

## Deciphering Velocity Data to Detect Crashes

The principle is simple: During regular driving, the velocity changes smoothly. However, during a crash, there is a sudden and significant change in velocity. 

By calculating acceleration, which is the change in velocity over time, we can detect a crash. But we can also do one better – by comparing the calculated acceleration to a known maximum value (representing the most severe crash), we can get a crash severity value between 0 and 1. A value closer to 0 represents no crash, while a value closer to 1 represents a severe crash.

## A Practical Example: C Function for Crash Severity

Here's a C function that implements the above principle:

```C
// Function to calculate crash severity
// v0 and v1 represent consecutive velocity values.
// max_acceleration is the maximum acceleration representing a severe crash.

float calculate_crash_severity(float v0, float v1, float max_acceleration) {
    float delta_v = v1 - v0; // Change in velocity
    float delta_t = 1.0 / 60.0; // Time interval (we're assuming data is updated 60 times a second)
    float acceleration = delta_v / delta_t; // Calculating acceleration

    // Normalizing acceleration to get a value between 0 and 1
    // fabsf is used to get the absolute value of acceleration as we're interested in the magnitude of acceleration, not its direction.
    float crash_severity = fabsf(acceleration) / max_acceleration;

    // Clamping the value between 0 and 1
    if (crash_severity > 1.0f) crash_severity = 1.0f;

    return crash_severity;
}
```

In this function, we first calculate the change in velocity (`delta_v`). The time interval (`delta_t`) is 1/60 seconds as the data updates 60 times a second. We then calculate the acceleration and normalize it against a known maximum value (`max_acceleration`) to get a crash severity value.

We use the `fabsf` function to ensure we are working with the magnitude of the acceleration, as a sudden deceleration during a collision would yield a negative acceleration value. Finally, we make sure to clamp the crash severity value between 0 and 1 to ensure it stays within our desired range.

## Bringing Crashes to Life

Through the power of velocity data, acceleration calculations, and a touch of programming magic, we can translate abstract numbers into real-world sensations. It's the crash that shakes the steering wheel, the jolt that moves the seat — the perfect illusion of reality. So, next time you skid, spin, and collide in your virtual race car, remember, behind every crash is a powerful function computing, calibrating, and creating your reality.