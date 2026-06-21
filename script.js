const colorPicker = document.getElementById("colorPicker");
const colorPreview = document.getElementById("colorPreview");

const hexValue = document.getElementById("hexValue");
const rgbValue = document.getElementById("rgbValue");
const hslValue = document.getElementById("hslValue");
const cmykValue = document.getElementById("cmykValue");
const htmlValue = document.getElementById("htmlValue");

/* =========================
   HEX TO RGB
========================= */

function hexToRgb(hex) {

    hex = hex.replace("#", "");

    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return { r, g, b };
}

/* =========================
   RGB TO HSL
========================= */

function rgbToHsl(r, g, b) {

    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);

    let h, s, l;
    l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {

        const d = max - min;

        s = l > 0.5
            ? d / (2 - max - min)
            : d / (max + min);

        switch (max) {

            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;

            case g:
                h = (b - r) / d + 2;
                break;

            case b:
                h = (r - g) / d + 4;
                break;
        }

        h /= 6;
    }

    return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
    };
}

/* =========================
   RGB TO CMYK
========================= */

function rgbToCmyk(r, g, b) {

    let c = 1 - r / 255;
    let m = 1 - g / 255;
    let y = 1 - b / 255;

    let k = Math.min(c, m, y);

    if (k === 1) {
        return {
            c: 0,
            m: 0,
            y: 0,
            k: 100
        };
    }

    c = ((c - k) / (1 - k)) * 100;
    m = ((m - k) / (1 - k)) * 100;
    y = ((y - k) / (1 - k)) * 100;
    k = k * 100;

    return {
        c: Math.round(c),
        m: Math.round(m),
        y: Math.round(y),
        k: Math.round(k)
    };
}

/* =========================
   UPDATE COLOR
========================= */

function updateColor(hex) {

    const rgb = hexToRgb(hex);

    const hsl = rgbToHsl(
        rgb.r,
        rgb.g,
        rgb.b
    );

    const cmyk = rgbToCmyk(
        rgb.r,
        rgb.g,
        rgb.b
    );

    colorPreview.style.background = hex;

    colorPreview.style.boxShadow =
        `0 0 30px ${hex},
         0 0 60px ${hex}88`;

    hexValue.value = hex.toUpperCase();

    rgbValue.value =
        `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;

    hslValue.value =
        `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

    hslaValue.value =
        `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)`;

    cmykValue.value =
        `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)`;

    htmlValue.value = hex.toUpperCase();

    document.documentElement.style.setProperty(
        "--primary",
        hex
    );
}

/* =========================
   COPY FUNCTION
========================= */

function copyInput(input) {

    const original = input.value;

    navigator.clipboard.writeText(original);

    input.value = "✓ Copied!";

    setTimeout(() => {
        input.value = original;
    }, 1200);
}

/* =========================
   CLICK TO COPY
========================= */

[
    hexValue,
    rgbValue,
    hslValue,
    cmykValue,
    htmlValue
].forEach(input => {

    input.addEventListener("click", () => {
        copyInput(input);
    });

});

/* =========================
   COLOR PICKER EVENT
========================= */

colorPicker.addEventListener("input", (e) => {
    updateColor(e.target.value);
});

/* =========================
   INITIAL LOAD
========================= */

updateColor(colorPicker.value);

/* =========================
   FLOATING PREVIEW EFFECT
========================= */

setInterval(() => {

    colorPreview.animate(
        [
            {
                transform: "translateY(0px)"
            },
            {
                transform: "translateY(-6px)"
            },
            {
                transform: "translateY(0px)"
            }
        ],
        {
            duration: 2500,
            easing: "ease-in-out"
        }
    );

}, 2500);