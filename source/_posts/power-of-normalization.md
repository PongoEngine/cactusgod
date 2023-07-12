---
title: The Power of Normalization
album: twtwelve
date: 2023/07/15
hue: 330
---

{% dynamics %}
values:1-2-9-1-|1-4-7-1-7-4-2|7-9-1-2-9-8-7-6
labels:
tagline:none are as powerful or versatile as the concept of normalization
{% enddynamics %}

Mastering the art of module development involves a variety of elements, but perhaps none are as powerful or versatile as the concept of normalization. This seemingly simple concept of transforming values into a range between 0 and 1 can profoundly impact the scalability, versatility, and user experience of a module.

<!-- more -->

## The Beauty of [0,1]

Normalization, in essence, is about perspective. It takes any given value within a specific range and converts it to a corresponding value within a standard range, typically [0,1]. This range is particularly handy as it's akin to the percentage system we're all familiar with. Here, 0 represents the absolute minimum, 1 signifies the absolute maximum, and everything in between is a proportional fraction. 

In the world of module development, scalability holds paramount importance. In this context, normalizing to a [0,1] range equips us with a powerful tool for adjusting and scaling our output. The process is straightforward: you take a raw value, clamp it to a predetermined maximum value, and then divide the clamped value by this maximum. 

This elegant operation gives birth to a value nestled within the [0,1] range. But what's the practical implication?

The answer lies in the unparalleled flexibility it provides. If the end signal needs to be stronger (closer to 1) or weaker (closer to 0), you can simply tweak the maximum value before normalization. A higher maximum value will yield a weaker signal, and a lower maximum will result in a stronger one. By adjusting the maximum value, you essentially adjust the sensitivity of your module to the raw inputs.

```C
float maxLevel = 500.0; // Adjust this value to scale your output
float clampedValue = min(rawValue, maxLevel);
float normalizedValue = clampedValue / maxLevel;
```

## Adding Dimension with Easing Functions

While normalization is the bedrock of data transformation in module development the dynamism truly comes to life when we apply easing functions to our normalized values.

In the context of a racing simulator the transition from the hum of a paved road to the rumble of a gravel track needs subtlety. A raw, linear change could feel abrupt and jarring. Instead, what if the sound gradually builds up, providing a more nuanced and immersive experience?

This is precisely where easing functions, like the quadIn function, come into play. The quadIn function is a type of "ease-in" function that begins slowly and accelerates smoothly as it progresses. When applied to our normalized road noise value, it squares the input, causing a slower initial increase that speeds up as the value approaches 1.

```C
float easedValue = quadIn(normalizedValue); // apply quadratic easing
```

In effect, it makes the road noise less noticeable when it's low, and ensures it becomes more prominent when the values are high. This way, the road noise can subtly augment the immersive experience without being too intrusive at lower levels, creating a more natural and pleasing progression.

The combination of normalization and carefully chosen easing functions can dramatically enhance the versatility and user experience of your modules. With these powerful tools, you can manage complexity while creating more dynamic, scalable, and immersive experiences.

## Real-time Adjustments with Potentiometers

A potentiometer is a simple yet powerful electronic component commonly used for adjusting signal levels in various types of circuits. Essentially it's a variable resistor where its resistance value can be adjusted by turning a knob or a dial. In the world of user interfaces, potentiometers find application as knobs or sliders on audio equipment or as control inputs in a wide range of electronic devices.

In the context of our racing simulation, the potentiometer acts as a user-adjustable control for setting the maximum level of road noise. As the user turns the potentiometer's knob, it changes the resistance value, which can be read and converted to a usable signal by our software.

In our C code, `readPotentiometer()` could represent a function that reads the current value from a connected potentiometer.

```C
float maxLevel = readPotentiometer(); // The potentiometer value sets the max level
float clampedValue = min(rawValue, maxLevel);
float normalizedValue = clampedValue / maxLevel;
```

Here, the maxLevel for normalization is directly controlled by the potentiometer's value. This normalized value is then further processed by the quadIn easing function.

```C
float easedValue = quadIn(normalizedValue); // apply quadratic easing
```

With this real-time control, users can dynamically adjust the road noise level during the race. The seamless interactivity allows for an enhanced user experience making it more immersive and personal. 