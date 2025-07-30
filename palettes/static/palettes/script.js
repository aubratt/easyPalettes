// Utility and Conversion Functions
function rgbToHex(rgbString) {
    const rgb = rgbString.match(/\d+/g);
    if (!rgb || rgb.length < 3) return '#000000';

    return (
        '#' + rgb.slice(0, 3).map(num => parseInt(num).toString(16).padStart(2, '0')).join('')
    );
}

function hexToRgbString(H) {
    if (H.length === 4) {
        H = '#' + H[1] + H[1] + H[2] + H[2] + H[3] + H[3];
    }

    const r = parseInt(H.slice(1, 3), 16);
    const g = parseInt(H.slice(3, 5), 16);
    const b = parseInt(H.slice(5, 7), 16);

    return `${r}, ${g}, ${b}`;
}

function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;

    let r = 0, g = 0, b = 0;

    if (0 <= h && h < 60) [r, g, b] = [c, x, 0];
    else if (60 <= h && h < 120) [r, g, b] = [x, c, 0];
    else if (120 <= h && h < 180) [r, g, b] = [0, c, x];
    else if (180 <= h && h < 240) [r, g, b] = [0, x, c];
    else if (240 <= h && h < 300) [r, g, b] = [x, 0, c];
    else if (300 <= h && h < 360) [r, g, b] = [c, 0, x];

    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);

    return (
        '#' + [r, g, b].map(val => val.toString(16).padStart(2, '0')).join(''));
}

function hexToHsl(H) {
    let r = 0; b = 0; g = 0;
    if (H.length === 4) {
        r = parseInt(H[1] + H[1], 16);
        g = parseInt(H[2] + H[2], 16);
        b = parseInt(H[3] + H[3], 16);
    } else {
        r = parseInt(H[1] + H[2], 16);
        g = parseInt(H[3] + H[4], 16);
        b = parseInt(H[5] + H[6], 16);
    }
    r /= 255; g /= 255; b /= 255;

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h *= 60;
    }

    return { h, s: s * 100, l: l * 100 };
}

function hexToHslString(hex) {
    const { h, s, l } = hexToHsl(hex);
    const roundedH = Math.round(h);
    const roundedS = Math.round(s);
    const roundedL = Math.round(l);

    return `${roundedH}, ${roundedS}%, ${roundedL}%`;
}

function getRandomColor() {
    return Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
}

function colorIsLight(color) {
    const [r, g, b] = color.match(/\d+/g).map(Number);

    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;

    return luminance > 130;
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith(name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function debounce(fn, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    }
}

// Palette Sorters
const sortByHue = (a, b) => a.hue - b.hue;

const sortByLightness = (a, b) => a.lightness - b.lightness;

const revSortByLightness = (a, b) => b.lightness - a.lightness;

const sortBySLCombo = (a, b) => (b.saturation * b.lightness) - (a.saturation * a.lightness);

function sortCompPalette(palette) {
    const paletteSortedByHue = palette.sort(sortByHue);

    const hueA = paletteSortedByHue[0].hue;

    const colorsWithHueA = [];
    const colorsWithHueB = [];

    for (let i = 0; i < palette.length; i++) {
        const currentColor = paletteSortedByHue[i];

        if (currentColor.hue === hueA) {
            colorsWithHueA.push(currentColor);
        } else {
            colorsWithHueB.push(currentColor);
        }
    }

    const revColorsWithHueB = colorsWithHueB.reverse();

    colorsWithHueA.sort(sortByLightness);
    revColorsWithHueB.sort(revSortByLightness);

    const sortedCompPalette = colorsWithHueA.concat(revColorsWithHueB);
    return sortedCompPalette;
}

function sortPaletteAnaSplit(palette) {
    const hue1 = palette[0].hue;
    const hue2 = palette[1].hue;

    const colorsWithHue1 = [];
    const colorsWithHue2 = [];
    const colorsWithHue3 = [];

    for (let i = 0; i < palette.length; i++) {
        if (palette[i].hue === hue1) {
            colorsWithHue1.push(palette[i]);
        } else if (palette[i].hue === hue2) {
            colorsWithHue2.push(palette[i]);
        } else {
            colorsWithHue3.push(palette[i]);
        }
    }

    colorsWithHue1.sort(sortByLightness);
    colorsWithHue3.sort(revSortByLightness);

    const sortedAnaSplitPalette = colorsWithHue1.concat(colorsWithHue2, colorsWithHue3);

    return sortedAnaSplitPalette;
}

function sortPaletteSquareTetra(palette) {
    const hue1 = palette[0].hue;
    const hue2 = palette[1].hue;
    const hue3 = palette[2].hue;

    const colorsWithHue1 = [];
    const colorsWithHue2 = [];
    const colorsWithHue3 = [];
    const colorsWithHue4 = [];

    for (let i = 0; i < palette.length; i++) {
        if (palette[i].hue === hue1) {
            colorsWithHue1.push(palette[i]);
        } else if (palette[i].hue === hue2) {
            colorsWithHue2.push(palette[i]);
        } else if (palette[i].hue === hue3) {
            colorsWithHue3.push(palette[i]);
        } else {
            colorsWithHue4.push(palette[i]);
        }
    }

    const sortedSquarePalette = colorsWithHue1.concat(colorsWithHue2, colorsWithHue3, colorsWithHue4);

    return sortedSquarePalette;
}

function randomSorter(palette) {
    const rand = Math.floor(Math.random() * 4);

    if (rand === 0) {
        return palette.sort(sortByHue);
    } else if (rand === 1) {
        return palette.sort(sortByLightness);
    } else if (rand === 2) {
        return palette.sort(revSortByLightness);
    } else {
        return palette.sort(sortBySLCombo);
    }
}

// Palette Manipulation Functions
function addColorColumn(hex = '', useRandom = false, insertAfterEl = null) {
    const currentCount = document.querySelectorAll('.color-column').length;
    if (currentCount >= 8) return;

    const paletteMaker = document.querySelector('#palette-maker');

    const colorColumn = document.createElement('div');
    colorColumn.classList.add('color-column', 'draggable-item');
    colorColumn.draggable = true;

    const columnTop = document.createElement('div');
    columnTop.classList.add('btns-responsive', 'd-flex');

    const rmvBtnDiv = document.createElement('div');
    rmvBtnDiv.classList.add('remove-btn-div', 'd-flex', 'd-none', 'rounded-end-circle');
    rmvBtnDiv.setAttribute('data-bs-placement', 'right');
    rmvBtnDiv.setAttribute('data-bs-title', 'Remove color');

    const rmvIcon = document.createElement('i');
    rmvIcon.classList.add('remove-btn', 'bi', 'bi-x-circle');

    const addBtnDiv = document.createElement('div');
    addBtnDiv.classList.add('add-btn-div', 'd-flex', 'd-none', 'rounded-start-pill');
    addBtnDiv.setAttribute('data-bs-placement', 'left');
    addBtnDiv.setAttribute('data-bs-title', 'Add a color');

    const addIcon = document.createElement('i');
    addIcon.classList.add('add-btn', 'bi', 'bi-plus-circle');

    const columnBot = document.createElement('div');
    columnBot.classList.add('column-bot', 'input-group', 'input-responsive');
    columnBot.style.width = '100%';

    const copyButton = document.createElement('i');
    copyButton.classList.add('bi', 'bi-copy', 'select-color', 'px-2', 'border-0');
    copyButton.style.height = '38px';
    copyButton.style.marginRight = '1px';
    copyButton.style.paddingTop = '10px';
    copyButton.style.borderTopLeftRadius = '5px';
    copyButton.style.borderBottomLeftRadius = '5px';
    copyButton.style.cursor = 'pointer';

    const colorInput = document.createElement('input');
    colorInput.classList.add('select-color', 'form-control', 'text-center', 'color-input', 'px-0');
    colorInput.type = 'text';
    colorInput.maxLength = '6';
    colorInput.style.maxWidth = '75px';
    colorInput.style.boxShadow = 'none';
    colorInput.style.outline = 'none';

    colorInput.addEventListener('focus', (e) => {
        colorColumn.draggable = false;
    });

    colorInput.addEventListener('blur', (e) => {
        colorColumn.draggable = true;
    });

    const colorPicker = document.createElement('input');
    colorPicker.classList.add('select-color', 'form-control', 'form-control-color');
    colorPicker.type = 'color';
    colorPicker.style.maxWidth = '50px';
    colorPicker.style.boxShadow = 'none';
    colorPicker.style.outline = 'none';

    if (hex) {
        const hexString = String(hex);

        colorColumn.style.backgroundColor = hexString;
        colorInput.value = hexString.replace('#', '');
        colorInput.dataset.hex = hexString;
        colorPicker.value = hexString;
    }

    if (!hex && useRandom) {
        const randomColor = getRandomColor();
        hex = `#${randomColor}`;

        colorColumn.style.backgroundColor = hex;
        colorInput.value = randomColor;
        colorInput.dataset.hex = hex;
        colorPicker.value = hex;
    }

    rmvBtnDiv.appendChild(rmvIcon);
    addBtnDiv.appendChild(addIcon);

    columnTop.appendChild(rmvBtnDiv);

    columnTop.appendChild(addBtnDiv);

    columnBot.appendChild(copyButton);
    columnBot.appendChild(colorInput);
    columnBot.appendChild(colorPicker);

    colorColumn.appendChild(columnTop);
    colorColumn.appendChild(columnBot);

    if (insertAfterEl && insertAfterEl.parentNode === paletteMaker) {
        insertAfterEl.after(colorColumn);
    } else if (paletteMaker) {
        paletteMaker.appendChild(colorColumn);
    }

    colorColumn.addEventListener('mouseover', toggleAddRmvBtns);
    colorColumn.addEventListener('mouseout', toggleAddRmvBtns);

    toggleAddRmvBtns();

    attachDragHandlers(colorColumn);

    colorInput.addEventListener('input', e => {
        changeColor(e);
    })

    colorInput.addEventListener('blur', e => {
        handleInputBlur(e);
    })

    setColorPickerValue(colorPicker);
    attachColorPickerListener(colorPicker);

    toggleInputStyle();
    disableEnableRandomizers();
    storePalette();

    return colorColumn;
}

function removeColorColumn(target) {
    const colorColumn = target.closest('.color-column');
    if (!colorColumn) return;

    const currentCount = document.querySelectorAll('.color-column').length;
    if (currentCount <= 2) return;

    colorColumn.remove();

    toggleAddRmvBtns();

    disableEnableRandomizers();

    storePalette();
}

function initializePalette() {
    const savedPalette = sessionStorage.getItem('palette');
    const colors = savedPalette ? JSON.parse(savedPalette) : [];

    if (colors.length > 0) {
        colors.forEach(hex => addColorColumn(hex));
    } else {
        for (let i = 0; i < 5; i++) {
            addColorColumn();
        }
        randomizePalette('true-random-2');
    }
}

function savePalette(e) {
    e.preventDefault();

    const colors = [];

    document.querySelectorAll('.color-column').forEach(colorColumn => {
        const input = colorColumn.querySelector('.color-input');
        const hexValue = `#${input.value}`;
        colors.push(hexValue);
    });

    const colorsJson = JSON.stringify(colors);
    document.querySelector('#colors').value = colorsJson;

    e.target.submit();
}

function openDeleteModal(target) {
    const modalEl = document.querySelector('#deleteModal');
    modalEl.dataset.pendingDeleteBtnId = target.closest('.palette').dataset.id;
    const modal = new bootstrap.Modal(modalEl);
    modal.show();
}

function deletePalette() {
    const palette = this.closest('.palette');
    const paletteId = palette.dataset.id;

    fetch(`/delete/${paletteId}`, {
        method: "POST",
        headers: {
            "X-CSRFToken": getCookie("csrftoken")
        }
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
        })
}

function storePalette() {
    const colors = [];
    const lastValidHexes = {};

    document.querySelectorAll('.color-column').forEach((colorColumn, index) => {
        const input = colorColumn.querySelector('.color-input');
        const id = colorColumn.dataset.id || colorColumn.id || index.toString();

        const raw = input.value.trim().replace(/[^0-9a-f]/gi, '').toUpperCase();
        const hex = raw.length === 6 ? raw : input.dataset.hex;

        if (hex && hex.length === 6) {
            colors.push(`#${hex}`);
            lastValidHexes[id] = hex;
            input.dataset.hex = hex; // keep in sync
        }
    });

    sessionStorage.setItem('palette', JSON.stringify(colors));
    sessionStorage.setItem('lastValidHexes', JSON.stringify(lastValidHexes));

    sessionStorage.setItem('palette', JSON.stringify(colors));
    sessionStorage.setItem('lastValidHexes', JSON.stringify(lastValidHexes));

    toggleInputStyle();
}

function randomizePalette(mode) {
    switch (mode) {
        case 'default':
            randomizeDefault();
            break;
        case 'true-random':
            randomizeTrueRandom();
            break;
        case 'monochrome':
            randomizeMonochrome();
            break;
        case 'complementary':
            randomizeComplementary();
            break;
        case 'analogous':
            randomizeAnalogous();
            break;
        case 'split':
            randomizeSplit();
            break;
        case 'triadic':
            randomizeTriadic();
            break;
        case 'square':
            randomizeSquare();
            break;
        case 'tetradic':
            randomizeTetradic();
            break;
        case 'pastel':
            randomizePastel();
            break;
        case 'vibrant':
            randomizeVibrant();
            break;
        case 'neutral':
            randomizeNeutral();
            break;
        case 'gradient':
            randomizeGradient();
            break;
        case 'true-random-2':
            randomizeTrueRandomv2();
            break;
    }
}

function randomizeDefault() {
    const modes = [
        { f: randomizeTrueRandom, w: 0.2625 },
        { f: randomizeTrueRandomv2, w: 0.6125 },
        { f: randomizeMonochrome, w: 0.0625 },
        { f: randomizeComplementary, w: 0.0625 },
        { f: randomizeAnalogous, w: 0.0625 },
        { f: randomizeSplit, w: 0.0625 },
        { f: randomizeTriadic, w: 0.0625 },
        { f: randomizeSquare, w: 0.0625 },
        { f: randomizeTetradic, w: 0.0625 },
        { f: randomizePastel, w: 0.0625 },
        { f: randomizeVibrant, w: 0.0625 },
        { f: randomizeNeutral, w: 0.0625 },
        { f: gradientModeHSL, w: 0.0625 },
        { f: gradientModeRGB, w: 0.0625 },
        { f: gradientModeHSLv2, w: 0.0625 }
    ];

    const rand = Math.random();
    let sum = 0;

    for (const mode of modes) {
        sum += mode.w;

        if (rand < sum) {
            return mode.f();
        }
    }
}

function randomizeTrueRandom() {
    document.querySelectorAll('.color-column').forEach(colorColumn => {
        const randomColor = getRandomColor();
        const hexValue = `#${randomColor}`;

        colorColumn.style.backgroundColor = hexValue;

        const hexInput = colorColumn.querySelector('.color-input');
        const colorPicker = colorColumn.querySelector('.form-control-color');

        hexInput.value = randomColor;
        colorPicker.value = hexValue;

        setColorPickerValue(colorPicker);
        storePalette();
    });
}

function randomizeTrueRandomv2() {
    const colors = [];

    document.querySelectorAll('.color-column').forEach(colorColumn => {
        const hue = Math.floor(Math.random() * 360);
        const saturation = Math.floor(Math.random() * 90) + 10;
        const lightness = Math.floor(Math.random() * 80) + 10;

        const hex = hslToHex(hue, saturation, lightness);

        colors.push({
            hex,
            hue,
            saturation,
            lightness
        });
    });

    const sortedColors = randomSorter(colors);

    const colorColumns = document.querySelectorAll('.color-column');

    sortedColors.forEach((color, i) => {
        const col = colorColumns[i];
        col.style.backgroundColor = color.hex;

        const hexInput = col.querySelector('.color-input');
        const colorPicker = col.querySelector('.form-control-color');

        hexInput.value = color.hex.slice(1);
        hexInput.dataset.hex = color.hex;
        colorPicker.value = color.hex;
    });

    storePalette();
}

function randomizeMonochrome() {
    const baseHue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 20) + 60;
    const lightnessRange = [20, 80];

    const colorColumns = document.querySelectorAll('.color-column');
    const step = (lightnessRange[1] - lightnessRange[0]) / (colorColumns.length - 1);

    colorColumns.forEach((col, index) => {
        const lightness = lightnessRange[0] + step * index;
        const hex = hslToHex(baseHue, saturation, lightness);
        col.style.backgroundColor = hex;

        const hexInput = col.querySelector('.color-input');
        hexInput.value = hex.slice(1);
        setColorPickerValue(col.querySelector('.form-control-color'));
    })

    storePalette();
}

function randomizeComplementary() {
    const baseHue = Math.floor(Math.random() * 360);
    const hueOffset = Math.floor(Math.random() * 20) - 10;
    const compHue = (baseHue + 180 + hueOffset + 360) % 360;

    const hueChoices = [
        baseHue,
        compHue
    ];

    const colorColumns = document.querySelectorAll('.color-column');
    let compHueUsed = false;
    let baseHueUsed = false;
    const compHueColumnIndex = Math.floor(Math.random() * colorColumns.length);
    let baseHueColumnIndex = Math.floor(Math.random() * colorColumns.length);

    while (compHueColumnIndex === baseHueColumnIndex) {
        baseHueColumnIndex = Math.floor(Math.random() * colorColumns.length);
    }

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = hueChoices[Math.floor(Math.random() * hueChoices.length)];

        if (!compHueUsed && index === compHueColumnIndex) {
            hue = compHue;
            compHueUsed = true;
        }

        if (!baseHueUsed && index === baseHueColumnIndex) {
            hue = baseHue;
            baseHueUsed = true;
        }

        const saturation = Math.floor(Math.random() * 80) + 20;
        const lightness = Math.floor(Math.random() * 80) + 20;

        palette.push({ hue, saturation, lightness, element: col });
    });

    palette = sortCompPalette(palette);

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeAnalogous() {
    const randomColor = getRandomColor();
    const randomHSL = hexToHsl(randomColor);

    const baseHue = randomHSL.h;
    let anaHue1 = 0;
    let anaHue2 = 0;

    if (baseHue < 30) {
        anaHue1 = 330 + baseHue;
        anaHue2 = baseHue + 30;
    } else if (baseHue >= 30 && baseHue <= 330) {
        anaHue1 = baseHue - 30;
        anaHue2 = baseHue + 30;
    } else if (baseHue > 330) {
        anaHue1 = baseHue - 30;
        anaHue2 = baseHue - 330;
    }

    const hueChoices = [
        baseHue,
        anaHue1,
        anaHue2
    ]

    const colorColumns = document.querySelectorAll('.color-column');

    const baseHueIndex = 0;
    const anaHue1Index = 1;
    const anaHue2Index = 2;

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = hueChoices[Math.floor(Math.random() * hueChoices.length)];

        if (index === baseHueIndex) {
            hue = baseHue;
        } else if (index === anaHue1Index) {
            hue = anaHue1;
        } else if (index === anaHue2Index) {
            hue = anaHue2;
        }

        const saturation = Math.floor(Math.random() * 76) + 25;
        const lightness = Math.floor(Math.random() * 51) + 25;

        palette.push({ hue, saturation, lightness, element: col });
    });

    palette = sortPaletteAnaSplit(palette);

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeSplit() {
    const randomColor = getRandomColor();
    const randomHSL = hexToHsl(randomColor);

    const baseHue = randomHSL.h;
    let splitHue1 = 0;
    let splitHue2 = 0;

    if (baseHue <= 150) {
        splitHue1 = baseHue + 150;
        splitHue2 = baseHue + 210;
    } else if (baseHue > 150 && baseHue < 210) {
        splitHue1 = baseHue + 150;
        splitHue2 = baseHue - 150;
    } else if (baseHue >= 210) {
        splitHue1 = baseHue - 210;
        splitHue2 = baseHue - 150;
    }

    const hueChoices = [
        baseHue,
        splitHue1,
        splitHue2
    ]

    const colorColumns = document.querySelectorAll('.color-column');

    const baseHueIndex = 0;
    const splitHue1Index = 1;
    const splitHue2Index = 2;

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = hueChoices[Math.floor(Math.random() * hueChoices.length)];

        if (index === baseHueIndex) {
            hue = baseHue;
        } else if (index === splitHue1Index) {
            hue = splitHue1;
        } else if (index === splitHue2Index) {
            hue = splitHue2;
        }

        const saturation = Math.floor(Math.random() * 76) + 25;
        const lightness = Math.floor(Math.random() * 51) + 25;

        palette.push({ hue, saturation, lightness, element: col });
    });

    palette = sortPaletteAnaSplit(palette);

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeTriadic() {
    const randomColor = getRandomColor();
    const randomHSL = hexToHsl(randomColor);

    const baseHue = randomHSL.h;
    let TriHue1, TriHue2;

    if (baseHue <= 120) {
        TriHue1 = baseHue + 120;
        TriHue2 = baseHue + 240;
    } else if (baseHue > 120 && baseHue < 240) {
        TriHue1 = baseHue + 120;
        TriHue2 = baseHue - 120;
    } else if (baseHue >= 240) {
        TriHue1 = baseHue - 240;
        TriHue2 = baseHue - 120;
    }

    const hueChoices = [
        baseHue,
        TriHue1,
        TriHue2
    ]

    const colorColumns = document.querySelectorAll('.color-column');

    const baseHueIndex = 0;
    const TriHue1Index = 1;
    const TriHue2Index = 2;

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = hueChoices[Math.floor(Math.random() * hueChoices.length)];

        if (index === baseHueIndex) {
            hue = baseHue;
        } else if (index === TriHue1Index) {
            hue = TriHue1;
        } else if (index === TriHue2Index) {
            hue = TriHue2;
        }

        const saturation = Math.floor(Math.random() * 76) + 25;
        const lightness = Math.floor(Math.random() * 51) + 25;

        palette.push({ hue, saturation, lightness, element: col });
    });

    palette = sortPaletteAnaSplit(palette);

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeSquare() {
    const randomColor = getRandomColor();
    const randomHSL = hexToHsl(randomColor);

    const baseHue = randomHSL.h;
    let squareHue1, squareHue2, squareHue3;

    if (baseHue <= 90) {
        squareHue1 = baseHue + 90;
        squareHue2 = baseHue + 180;
        squareHue3 = baseHue + 270;
    } else if (baseHue > 90 && baseHue < 180) {
        squareHue1 = baseHue + 90;
        squareHue2 = baseHue + 180;
        squareHue3 = baseHue - 90;
    } else if (baseHue >= 180 && baseHue <= 270) {
        squareHue1 = baseHue + 90;
        squareHue2 = baseHue - 180;
        squareHue3 = baseHue - 90;
    } else if (baseHue > 271) {
        squareHue1 = baseHue - 270;
        squareHue2 = baseHue - 180;
        squareHue3 = baseHue - 90;
    }

    const hueChoices = [
        baseHue,
        squareHue1,
        squareHue2,
        squareHue3
    ]

    const colorColumns = document.querySelectorAll('.color-column');

    const baseHueIndex = 0;
    const squareHue1Index = 1;
    const squareHue2Index = 2;
    const squareHue3Index = 3;

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = hueChoices[Math.floor(Math.random() * hueChoices.length)];

        if (index === baseHueIndex) {
            hue = baseHue;
        } else if (index === squareHue1Index) {
            hue = squareHue1;
        } else if (index === squareHue2Index) {
            hue = squareHue2;
        } else if (index === squareHue3Index) {
            hue = squareHue3;
        }

        const saturation = Math.floor(Math.random() * 76) + 25;
        const lightness = Math.floor(Math.random() * 51) + 25;

        palette.push({ hue, saturation, lightness, element: col });
    });

    palette = sortPaletteSquareTetra(palette);

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeTetradic() {
    const baseHue1 = Math.floor(Math.random() * 272);
    const baseHue2 = baseHue1 + Math.floor(Math.random() * 60) + 30;

    let compHue1, compHue2;

    if (baseHue1 <= 180) {
        compHue1 = baseHue1 + 180;
    } else {
        compHue1 = baseHue1 - 180;
    }

    if (baseHue2 <= 180) {
        compHue2 = baseHue2 + 180;
    } else {
        compHue2 = baseHue2 - 180;
    }

    const hueChoices = [
        baseHue1,
        baseHue2,
        compHue1,
        compHue2
    ]

    const colorColumns = document.querySelectorAll('.color-column');

    const baseHue1Index = 0;
    const baseHue2Index = 1;
    const compHue1Index = 2;
    const compHue2Index = 3;

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = hueChoices[Math.floor(Math.random() * hueChoices.length)];

        if (index === baseHue1Index) {
            hue = baseHue1;
        } else if (index === baseHue2Index) {
            hue = baseHue2;
        } else if (index === compHue1Index) {
            hue = compHue1;
        } else if (index === compHue2Index) {
            hue = compHue2;
        }

        const saturation = Math.floor(Math.random() * 76) + 25;
        const lightness = Math.floor(Math.random() * 51) + 25;

        palette.push({ hue, saturation, lightness, element: col });
    });

    palette = sortPaletteSquareTetra(palette);

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizePastel() {
    const colorColumns = document.querySelectorAll('.color-column');

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = Math.floor(Math.random() * 361);
        let saturation = Math.floor(Math.random() * 41) + 25;
        let lightness = Math.floor(Math.random() * 16) + 80;

        palette.push({ hue, saturation, lightness, element: col });
    });

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeVibrant() {
    const colorColumns = document.querySelectorAll('.color-column');

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = Math.floor(Math.random() * 360);
        let saturation = Math.floor(Math.random() * 26) + 75;
        let lightness = Math.floor(Math.random() * 26) + 50;

        palette.push({ hue, saturation, lightness, element: col });
    });

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeNeutral() {
    const colorColumns = document.querySelectorAll('.color-column');

    let palette = [];

    colorColumns.forEach((col, index) => {
        let hue = Math.floor(Math.random() * 360);
        let saturation = Math.floor(Math.random() * 11);
        let lightness = Math.floor(Math.random() * 101);

        palette.push({ hue, saturation, lightness, element: col });
    });

    palette = palette.sort(revSortByLightness);

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function randomizeGradient() {
    const modeChoices = [
        gradientModeHSL,
        gradientModeHSLv2,
        gradientModeRGB
    ];

    let mode = modeChoices[Math.floor(Math.random() * modeChoices.length)];

    return mode();
}

function gradientModeHSL() {
    const hue1 = Math.floor(Math.random() * 360);
    let hue2 = Math.floor(Math.random() * 360);

    while (Math.abs(hue1 - hue2) < 45) {
        hue2 = Math.floor(Math.random() * 360);
    }

    const colorColumns = document.querySelectorAll('.color-column');
    const colCount = colorColumns.length;

    let palette = [];
    let hue;

    const diff = Math.abs(hue1 - hue2);
    const saturation = Math.floor(Math.random() * 20) + 80;
    const lightness = Math.floor(Math.random() * 50) + 30;


    for (let i = 0; i < colCount; i++) {
        const col = colorColumns[i];

        if (hue1 > hue2) {
            hue = hue1 - i * (diff / (colCount - 1));
        } else {
            hue = hue1 + i * (diff / (colCount - 1));
        }

        palette.push({ hue, saturation, lightness, element: col });
    }

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function gradientModeRGB() {
    const hue1 = Math.floor(Math.random() * 360);
    let hue2 = Math.floor(Math.random() * 360);

    while (Math.abs(hue1 - hue2) < 30) {
        hue2 = Math.floor(Math.random() * 360);
    }

    const colorColumns = document.querySelectorAll('.color-column');
    const colCount = colorColumns.length;

    let palette = [];
    let hue, saturation, col;

    const baseSat = Math.floor(Math.random() * 20) + 80;
    const lightness = Math.floor(Math.random() * 50) + 30;

    for (let i = 0; i < colCount; i++) {
        col = colorColumns[i];

        if (i < Math.floor(colCount / 2)) {
            hue = hue1;
            saturation = baseSat - i * (baseSat / Math.floor(colCount / 2));
        } else if (i === Math.floor(colCount / 2) - 1 || i === Math.floor(colCount / 2)) {
            hue = (hue1 + hue2) / 2;
            saturation = palette[Math.floor(colCount / 2) - 2].saturation / 2;
        } else {
            hue = hue2;
            saturation = Math.abs(baseSat - i * (baseSat / Math.floor(colCount / 2)));
        }

        palette.push({ hue, saturation, lightness, element: col });
    }

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

function gradientModeHSLv2() {
    const hue1 = Math.floor(Math.random() * 360);
    let hue2 = Math.floor(Math.random() * 360);

    while (Math.abs(hue1 - hue2) < 45) {
        hue2 = Math.floor(Math.random() * 360);
    }

    const colorColumns = document.querySelectorAll('.color-column');
    const colCount = colorColumns.length;

    let palette = [];
    let hue, wheelDiff, diff;
    const saturation = Math.floor(Math.random() * 20) + 80;
    const lightness = Math.floor(Math.random() * 50) + 30;

    const avDiff = Math.abs(hue1 - hue2);

    if (hue1 > hue2) {
        wheelDiff = (360 - hue1) + hue2;
    } else {
        wheelDiff = (360 - hue2) + hue1;
    }

    if (avDiff <= wheelDiff) {
        diff = avDiff;
    } else {
        diff = wheelDiff;
    }

    for (let i = 0; i < colCount; i++) {
        const col = colorColumns[i];

        if (hue1 > hue2) {
            hue = hue1 - i * (diff / colCount - 1);
        } else {
            hue = hue2 + i * (diff / colCount - 1);
        }

        if (hue >= 360) {
            hue -= 360;
        }

        palette.push({ hue, saturation, lightness, element: col });
    }

    const paletteMaker = document.querySelector('#palette-maker');

    palette.forEach(({ element }) => {
        paletteMaker.appendChild(element);
    });

    palette.forEach(({ hue, saturation, lightness, element }) => {
        const hex = hslToHex(hue, saturation, lightness);
        element.style.backgroundColor = hex;

        const hexInput = element.querySelector('.color-input');
        const colorPicker = element.querySelector('.form-control-color');

        hexInput.value = hex.slice(1);
        colorPicker.value = hex;
    });

    storePalette();
}

// Input & UI Update Functions
function changeColor(e) {
    const input = e.target;
    const col = input.closest('.color-column');
    let hex = input.value.replace(/[^0-9a-f]/gi, '').toUpperCase().slice(0, 6);

    input.value = hex;

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    if (hex.length === 6) {
        input.dataset.hex = hex; // ✅ save last valid hex
        col.style.backgroundColor = `#${hex}`;
        const picker = col.querySelector('.form-control-color');
        if (picker) picker.value = `#${hex}`;
    }

    setColorPickerValue(col.querySelector('.form-control-color'));
    toggleInputStyle();
    storePalette();
}

function handleInputBlur(e) {
    const userInput = e.target;
    let hex = userInput.value.replace(/[^0-9a-f]/gi, '').slice(0, 6).toUpperCase();

    const colorColumn = userInput.closest('.color-column');
    const bgColor = window.getComputedStyle(colorColumn).backgroundColor;
    const bgHex = rgbToHex(bgColor).replace(/^#/, '').toUpperCase();

    if (hex.length === 3) {
        hex = hex.split('').map(c => c + c).join('');
    }

    if (hex.length !== 6) {
        hex = bgHex;
    }

    userInput.value = hex;
    colorColumn.style.backgroundColor = `#${hex}`;

    const colorPicker = colorColumn.querySelector('.form-control-color');
    if (colorPicker) {
        colorPicker.value = `#${hex}`;
    }

    // Now that input is normalized, save the palette
    storePalette();

    toggleInputStyle();
}

function saveLastValidHex(colorColumn, hex) {
    if (document.querySelector('#palette-maker')) {

        const id = colorColumn.dataset.id || colorColumn.id || colorColumn.querySelector('.color-input').name || null;
        if (!id) return;

        let stored = JSON.parse(sessionStorage.getItem('lastValidHexes') || '{}');
        stored[id] = hex;
        sessionStorage.setItem('lastValidHexes', JSON.stringify(stored));
    }
}

function getLastValidHex(colorColumn) {
    if (document.querySelector('#palette-maker')) {
        const id = colorColumn.dataset.id || colorColumn.id || colorColumn.querySelector('.color-input').name || null;
        if (!id) return null;

        let stored = JSON.parse(sessionStorage.getItem('lastValidHexes') || '{}');
        return stored[id] || null;
    }
}

function normalizeAllColorInputs() {
    if (document.querySelector('#palette-maker')) {
        const raw = sessionStorage.getItem('lastValidHexes');

        const stored = JSON.parse(sessionStorage.getItem('lastValidHexes') || '{}');

        document.querySelectorAll('.color-column').forEach((col, index) => {
            const input = col.querySelector('.color-input');
            const id = col.dataset.id || col.id || index.toString();
            let hex = stored[id];

            if (!hex || hex.length !== 6) {
                const bg = getComputedStyle(col).backgroundColor;
                hex = rgbToHex(bg).replace('#', '').toUpperCase() || 'FFFFFF';
            }

            input.value = hex;
            input.dataset.hex = hex;
            col.style.backgroundColor = `#${hex}`;

            const picker = col.querySelector('.form-control-color');
            if (picker) picker.value = `#${hex}`;
        });

        toggleInputStyle();
    }
}

function toggleInputStyle() {
    document.querySelectorAll('.select-color').forEach(selectColor => {
        const colorColumn = selectColor.closest('.color-column');
        const colorColumnColor = window.getComputedStyle(colorColumn).backgroundColor;

        const lightColor = colorIsLight(colorColumnColor);

        const addBtn = colorColumn.querySelector('.add-btn-div');
        const removeBtn = colorColumn.querySelector('.remove-btn-div');

        if (lightColor) {
            selectColor.style.color = 'white';
            selectColor.style.backgroundColor = 'rgb(0, 0, 0, 0.5)';
            selectColor.style.border = '1px solid rgb(0, 0, 0, 0.5)';

            addBtn.style.color = 'white';
            addBtn.style.backgroundColor = 'rgb(0, 0, 0, 0.5)';

            removeBtn.style.color = 'white';
            removeBtn.style.backgroundColor = 'rgb(0, 0, 0, 0.5)';
        } else {
            selectColor.style.color = 'black';
            selectColor.style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
            selectColor.style.border = '1px solid rgb(255, 255, 255, 0.5)';

            addBtn.style.color = 'black';
            addBtn.style.backgroundColor = 'rgb(255, 255, 255, 0.5)';

            removeBtn.style.color = 'black';
            removeBtn.style.backgroundColor = 'rgb(255, 255, 255, 0.5)';
        }
    });
}

function setColorPickerValue(colorPicker) {
    const colorColumn = colorPicker.closest('.color-column');
    const colorColumnColor = window.getComputedStyle(colorColumn).backgroundColor;
    colorPicker.value = rgbToHex(colorColumnColor);
}

function attachColorPickerListener(colorPicker) {
    const colorColumn = colorPicker.closest('.color-column');

    const debouncedHandler = debounce(() => {
        colorColumn.style.backgroundColor = colorPicker.value;

        const hexInput = colorColumn.querySelector('.color-input');
        hexInput.value = colorPicker.value.slice(1);

        toggleInputStyle();
        storePalette();
    }, 150);

    colorPicker.addEventListener('input', debouncedHandler);
}

function toggleAddRmvBtns() {
    const colorColumns = document.querySelectorAll('.color-column');
    const count = colorColumns.length;

    colorColumns.forEach(col => {
        const addBtn = col.querySelector('.add-btn-div');
        const removeBtn = col.querySelector('.remove-btn-div');

        if (addBtn) {
            if (count >= 8) {
                addBtn.classList.add('d-none');
            } else {
                addBtn.classList.remove('d-none');
            }
        }

        if (removeBtn) {
            if (count === 2) {
                removeBtn.style.visibility = 'hidden';
            } else if (count > 2) {
                removeBtn.style.visibility = 'visible';
                removeBtn.classList.remove('d-none');
            }
        }
    });
}

function updateDropdownText() {
    const dropdown = this.closest('.dropdown');
    const toggleBtn = dropdown.querySelector('.dropdown-toggle');
    toggleBtn.textContent = this.textContent;

    const selectedMode = this.dataset.mode;
    toggleBtn.dataset.selectedMode = selectedMode;
}

function handleCopyClick(copyIcon) {
    const colorColumn = copyIcon.closest('.color-column');
    if (colorColumn) {
        const colorInput = colorColumn.querySelector('.color-input');

        if (colorInput) {
            navigator.clipboard.writeText(colorInput.value)
                .then(() => {
                    showCopyMessageModal('Copied to clipboard', copyIcon);
                })
                .catch(err => console.error('Clipboard error: ', err));
        }
    }

    const colorInfoBlock = copyIcon.closest('.color-info-block');
    if (colorInfoBlock) {
        const colorInfoText = colorInfoBlock.querySelector('.color-info-text');

        if (colorInfoText) {
            navigator.clipboard.writeText(colorInfoText.textContent)
                .then(() => {
                    showCopyMessageModal('Copied to clipboard', copyIcon);
                })
                .catch(err => console.error('Clipboard error: ', err));
        }
    }
}

function showCopyMessageModal(text, referenceEl) {
    const modalParent = referenceEl.closest('.modal');
    const isInModal = !!modalParent;

    const message = document.createElement('div');
    message.textContent = text;
    message.style.background = '#333';
    message.style.color = '#fff';
    message.style.padding = '6px 12px';
    message.style.borderRadius = '4px';
    message.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
    message.style.zIndex = '1000';
    message.style.opacity = '0';
    message.style.transition = 'opacity 0.3s';

    if (isInModal) {
        // Position absolutely within the same .color-info block, near the icon
        const container = referenceEl.closest('.color-info');
        container.style.position = 'relative';

        // Create a wrapper for precise positioning
        const iconRect = referenceEl.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        // Offset relative to container
        const left = iconRect.left - containerRect.left + iconRect.width / 2;
        const top = iconRect.top - containerRect.top;

        message.style.position = 'absolute';
        message.style.left = `${left}px`;
        message.style.top = `${top - 10}px`;
        message.style.transform = 'translate(-50%, -100%)';

        container.appendChild(message);
    } else {
        // Global fixed positioning
        const rect = referenceEl.getBoundingClientRect();
        message.style.position = 'fixed';
        message.style.left = `${rect.left + rect.width / 2}px`;
        message.style.top = `${rect.top - 10}px`;
        message.style.transform = `translate(-50%, -100%)`;
        document.body.appendChild(message);
    }

    requestAnimationFrame(() => {
        message.style.opacity = '1';
    });

    setTimeout(() => {
        message.style.opacity = '0';
        setTimeout(() => {
            message.remove();
        }, 300);
    }, 1500);
}

function disableEnableRandomizers() {
    const paletteMaker = document.querySelector('#palette-maker');

    if (paletteMaker) {
        const colorColumns = paletteMaker.querySelectorAll('.color-column');
        const colorColumnsLen = colorColumns.length;

        const ana = document.querySelector('#analogous');
        const split = document.querySelector('#split');
        const tri = document.querySelector('#triadic');
        const square = document.querySelector('#square');
        const tet = document.querySelector('#tetradic');
        const grad = document.querySelector('#gradient');

        if (colorColumnsLen < 3) {
            ana.classList.add('disabled');
            ana.setAttribute('aria-disabled', 'true');

            split.classList.add('disabled');
            split.setAttribute('aria-disabled', 'true');

            tri.classList.add('disabled');
            tri.setAttribute('aria-disabled', 'true');

            grad.classList.add('disabled');
            grad.setAttribute('aria-disabled', 'true');
        }

        if (colorColumnsLen < 4) {
            square.classList.add('disabled');
            square.setAttribute('aria-disabled', 'true');

            tet.classList.add('disabled');
            tet.setAttribute('aria-disabled', 'true');
        }

        if (colorColumnsLen >= 3) {
            ana.classList.remove('disabled');
            ana.removeAttribute('aria-disabled');

            split.classList.remove('disabled');
            split.removeAttribute('aria-disabled');

            tri.classList.remove('disabled');
            tri.removeAttribute('aria-disabled');

            grad.classList.remove('disabled');
            grad.removeAttribute('aria-disabled');
        }

        if (colorColumnsLen >= 4) {
            square.classList.remove('disabled');
            square.removeAttribute('aria-disabled');

            tet.classList.remove('disabled');
            tet.removeAttribute('aria-disabled');
        }
    }
}

// Drag and Drop Functions
function attachDragHandlers(colorColumn) {
    colorColumn.addEventListener('dragstart', (e) => {
        draggedColumn = colorColumn;
        e.dataTransfer.effectAllowed = 'move';
    });

    colorColumn.addEventListener('dragover', (e) => {
        e.preventDefault();
        if (draggedColumn && draggedColumn !== colorColumn) {
            const parent = colorColumn.parentNode;
            const children = Array.from(parent.children);

            const draggedIndex = children.indexOf(draggedColumn);
            const targetIndex = children.indexOf(colorColumn);

            if (!draggedColumn.contains(colorColumn)) {
                parent.insertBefore(draggedColumn, draggedIndex < targetIndex ? colorColumn.nextSibling : colorColumn);
            }

            storePalette();
        }
    });
}

// Like System Functions
function likePalette() {
    const palette = this.closest('.palette');
    const paletteId = palette.dataset.id;

    fetch(`/like/${paletteId}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken"),
        },
        body: JSON.stringify({
            palette_id: paletteId
        })
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                return;
            }
            return response.json();
        })
        .then(data => {
            const likeCountEl = palette.querySelector('.like-count');
            likeCountEl.textContent = data.like_count;

            localStorage.setItem(`likes-${paletteId}`, data.like_count);

            const likeButton = palette.querySelector('.like-btn');

            if (data.liked_by_user) {
                likeButton.classList = "like-btn bi bi-star-fill me-2";
            } else {
                likeButton.classList = "like-btn bi bi-star me-2";
            }
        });
}

function displayLikeCount(likeBtn) {
    const palette = likeBtn.closest('.palette');
    const paletteId = palette.dataset.id;
    const likeCountEl = palette.querySelector('.like-count');

    let savedLikeCount = localStorage.getItem(`likes-${paletteId}`);

    if (savedLikeCount !== null) {
        likeCountEl.textContent = savedLikeCount;
    } else {
        // fallback to original HTML count (e.g. 0) or leave it alone
        likeCountEl.textContent = likeCountEl.textContent || '0';
    }
}

// Touch Screen Functions
function isTouchDevice() {
    return window.matchMedia("(pointer: coarse)").matches;
}

// Infinite Scroll Pagination
let loading = false;
let nextPageKey = null;

function getLastPaletteInfo() {
    const palettes = document.querySelectorAll('.palette-grid .palette');

    console.log('Number of Palettes');
    console.log(document.querySelectorAll('.palette-grid .palette').length);

    console.log('Last Palette (:last-child)');
    console.log(document.querySelector('.palette-grid .palette:last-child'));

    console.log('Last Palette (length - 1)');
    console.log(palettes[palettes.length - 1]);

    if (palettes.length === 0) return '';

    const last = palettes[palettes.length - 1];

    let time = last.dataset.time;
    const id = last.dataset.id;

    time = time.replace(/(\+\d{2}):(\d{2})$/, '$1$2');

    return btoa(`${time}:${id}`);
}

async function loadMorePalettes() {
    if (loading) return;
    loading = true;

    const pageKey = getLastPaletteInfo();
    if (!pageKey) {
        loading = false;
        return;
    }

    const pageType = document.body.dataset.page;
    const username = document.body.dataset.username;
    let url = '';

    if (pageType === 'profile') {
        url = `/profile_pagination_ajax?p=${pageKey}&username=${username}`;
    } else {
        url = `/pagination-ajax/?p=${pageKey}`;
    }

    try {
        console.log("Fetching:", url);
        const response = await fetch(url, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        });
        const data = await response.json();

        if (data.palettes) {
            const paletteGrid = document.querySelector('.palette-grid');
            const requestUserId = data.request_user_id;

            data.palettes.forEach(palette => {
                const div = buildPaletteHTML(palette, requestUserId);
                paletteGrid.appendChild(div);
            });
        }
    } catch (err) {
        console.error('Error loading more palettes:', err);
    } finally {
        loading = false;
    }
}

function buildPaletteHTML(palette, requestUserId) {
    const paletteDiv = document.createElement('div');
    paletteDiv.className = 'palette';
    paletteDiv.setAttribute('data-time', palette.time);
    paletteDiv.setAttribute('data-id', palette.id);

    const colorStrip = document.createElement('div');
    colorStrip.classList.add('color-strip', 'd-flex');

    palette.colors.forEach((color, index) => {
        const colorBlock = document.createElement('div');
        colorBlock.className = 'color-block';
        colorBlock.style.backgroundColor = palette.colors[index];

        if (index === 0) {
            colorBlock.style.borderTopLeftRadius = '5px';
        }

        if (index === palette.colors.length - 1) {
            colorBlock.style.borderTopRightRadius = '5px';
        }

        colorStrip.appendChild(colorBlock);
    });

    const paletteFooter = document.createElement('div');
    paletteFooter.classList.add('d-flex', 'palette-footer', 'align-items-center', 'justify-content-between');
    paletteFooter.style.borderBottomLeftRadius = '5px';
    paletteFooter.style.borderBottomRightRadius = '5px';

    const username = document.createElement('p');
    username.classList.add('p-1', 'my-0', 'ms-2');

    const usernameLink = document.createElement('a');
    usernameLink.href = `/profile/${palette.user}`;
    usernameLink.className = 'text-decoration-none';
    usernameLink.style.color = 'white';
    usernameLink.textContent = palette.user;

    const likeAndDotsDiv = document.createElement('div');
    likeAndDotsDiv.classList.add('d-flex', 'align-items-center');

    const likeBtn = document.createElement('div');
    likeBtn.classList.add('d-flex', 'd-inline-flex', 'align-items-center', 'justify-content-center');

    const likeIcon = document.createElement('i');
    likeIcon.classList.add('like-btn', 'bi', 'me-2');
    likeIcon.classList.add(palette.liked ? 'bi-star-fill' : 'bi-star');
    likeIcon.style.cursor = 'pointer';
    likeIcon.style.color = 'white';

    const likeCount = document.createElement('small');
    likeCount.classList.add('d-flex', 'align-items-center', 'me-2', 'like-count');
    likeCount.style.color = 'white';

    let savedLikeCount = localStorage.getItem(`likes-${palette.id}`);
    if (!savedLikeCount) {
        likeCount.textContent = 0;
    } else {
        likeCount.textContent = savedLikeCount;
    }

    const dotsDropdownDiv = document.createElement('div');
    dotsDropdownDiv.classList.add('dropdown', 'd-flex', 'align-items-center', 'td-dd');

    const dots = document.createElement('i');
    dots.classList.add('bi', 'bi-three-dots', 'me-2');
    dots.ariaExpanded = 'false';
    dots.setAttribute('data-bs-toggle', 'dropdown');
    dots.style.cursor = 'pointer';
    dots.style.color = 'white';

    const dotsMenu = document.createElement('ul');
    dotsMenu.classList.add('dropdown-menu', 'palette-dd');
    dotsMenu.style.backgroundColor = '#444A53';

    const viewDetailsLi = document.createElement('li');
    viewDetailsLi.className = 'palette-dd';
    viewDetailsLi.style.cursor = 'pointer';

    const viewDetailsDiv = document.createElement('div');
    viewDetailsDiv.classList.add('d-flex', 'd-inline-flex', 'dropdown-item', 'palette-dd', 'view-details-btn');

    const viewDetailsIcon = document.createElement('i');
    viewDetailsIcon.classList.add('bi', 'bi-info-circle', 'mt-1', 'me-0', 'pe-2', 'view-details-btn');
    viewDetailsIcon.style.color = 'white';

    const viewDetailsLink = document.createElement('a');
    viewDetailsLink.classList.add('ms-0', 'ps-0', 'view-details-btn');
    viewDetailsLink.style.fontStyle = 'normal';
    viewDetailsLink.style.textDecoration = 'none';
    viewDetailsLink.style.color = 'white';
    viewDetailsLink.textContent = 'View details';

    username.appendChild(usernameLink);

    likeBtn.appendChild(likeIcon);

    viewDetailsDiv.appendChild(viewDetailsIcon);
    viewDetailsDiv.appendChild(viewDetailsLink);
    viewDetailsLi.appendChild(viewDetailsDiv);
    dotsMenu.appendChild(viewDetailsLi);

    dotsDropdownDiv.appendChild(dots);
    if (requestUserId === palette.user_id) {
        const deletePaletteLi = document.createElement('li');
        deletePaletteLi.style.cursor = 'pointer';

        const deletePaletteDiv = document.createElement('div');
        deletePaletteDiv.classList.add('d-flex', 'd-inline-flex', 'dropdown-item', 'palette-dd');
        deletePaletteDiv.setAttribute('data-palette-id', palette.id);
        deletePaletteDiv.setAttribute('data-palette-name', palette.name);
        deletePaletteDiv.setAttribute('data-bs-toggle', 'modal');
        deletePaletteDiv.setAttribute('data-bs-target', 'deleteModal');

        const deletePaletteIcon = document.createElement('i');
        deletePaletteIcon.classList.add('bi', 'bi-trash', 'mt-1', 'me-0', 'pe-2', 'delete-btn');
        deletePaletteIcon.setAttribute('data-palette-id', palette.id);
        deletePaletteIcon.setAttribute('data-palette-name', palette.name);
        deletePaletteIcon.style.color = 'red';

        const deletePaletteLink = document.createElement('a');
        deletePaletteLink.classList.add('ms-0', 'ps-0', 'delete-btn');
        deletePaletteLink.setAttribute('data-palette-id', palette.id);
        deletePaletteLink.setAttribute('data-palette-name', palette.name);
        deletePaletteLink.style.fontStyle = 'normal';
        deletePaletteLink.style.textDecoration = 'none';
        deletePaletteLink.style.color = 'red';
        deletePaletteLink.textContent = 'Delete palette';

        deletePaletteDiv.appendChild(deletePaletteIcon);
        deletePaletteDiv.appendChild(deletePaletteLink);

        deletePaletteLi.appendChild(deletePaletteDiv);

        dotsMenu.appendChild(deletePaletteLi);
    }
    dotsDropdownDiv.appendChild(dotsMenu);

    likeAndDotsDiv.appendChild(likeBtn);
    likeAndDotsDiv.appendChild(likeCount);
    likeAndDotsDiv.appendChild(dotsDropdownDiv);

    paletteFooter.appendChild(username);
    paletteFooter.appendChild(likeAndDotsDiv);

    paletteDiv.appendChild(colorStrip);
    paletteDiv.appendChild(paletteFooter);

    return paletteDiv;
}

async function handlePaletteModal(paletteId) {
    try {
        const response = await fetch(`/palette-detail/${paletteId}/json/`, {
            headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!response.ok) throw new Error('Network error');

        const paletteData = await response.json();
        const existingModal = document.getElementById(`paletteModal-${paletteData.id}`);

        let modalEl;

        if (existingModal) {
            modalEl = existingModal;
        } else {
            modalEl = buildPaletteModalHTML(paletteData);
            document.body.appendChild(modalEl);
        }

        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    } catch (err) {
        console.error('Failed to load palette details:', err);
    }
}

function buildPaletteModalHTML(paletteData) {
    const modalDiv = document.createElement('div');
    modalDiv.id = `paletteModal-${paletteData.id}`;
    modalDiv.classList.add('modal', 'fade');
    modalDiv.tabIndex = '-1';
    modalDiv.ariaHidden = 'true';
    modalDiv.setAttribute('aria-labelledby', `paletteModalLabel-${paletteData.id}`);
    modalDiv.setAttribute('data-bs-backdrop', 'true');
    modalDiv.setAttribute('data-bs-keyboard', 'true');

    const modalDialog = document.createElement('div');
    modalDialog.classList.add('modal-dialog', 'modal-xl');
    modalDialog.style.maxWidth = '95vw';

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');
    modalContent.style.backgroundColor = '#36393F';

    const modalHeader = document.createElement('div');
    modalHeader.className = 'modal-header';
    modalHeader.setAttribute('data-bs-theme', 'dark');

    const modalTitleDiv = document.createElement('div');

    const modalTitleText = document.createElement('h1');
    modalTitleText.id = `paletteModalLabel-${paletteData.id}`;
    modalTitleText.classList.add('modal-title', 'fs-5', 'mb-0');
    modalTitleText.style.color = 'white';
    modalTitleText.textContent = `${paletteData.name}`;

    const modalUsername = document.createElement('a');
    modalUsername.href = `/profile/${paletteData.user}`;
    modalUsername.className = 'mb-0';
    modalUsername.style.textDecoration = 'none';
    modalUsername.style.cursor = 'pointer';
    modalUsername.style.color = 'lightgray';
    modalUsername.textContent = `${paletteData.user}`;

    const modalCloseBtn = document.createElement('button');
    modalCloseBtn.type = 'button';
    modalCloseBtn.className = 'btn-close';
    modalCloseBtn.ariaLabel = 'Close';
    modalCloseBtn.setAttribute('data-bs-dismiss', 'modal');

    const modalBody = document.createElement('div');
    modalBody.className = 'modal-body';
    modalBody.style.overflowX = 'hidden';

    const modalColorsDiv = document.createElement('div');
    modalColorsDiv.classList.add('d-flex', 'flex-column', 'flex-lg-row', 'w-100');

    const numColors = paletteData.colors.length;

    paletteData.colors.forEach((color, index) => {
        const colorInfoDiv = document.createElement('div');
        colorInfoDiv.classList.add('d-flex', 'flex-column', 'align-items-center', 'justify-content-center', 'color-info');
        colorInfoDiv.style.minWidth = `${100 / numColors}%`;
        colorInfoDiv.style.backgroundColor = color;
        colorInfoDiv.setAttribute('flex', '1 1 0');
        colorInfoDiv.setAttribute('data-hex', color);

        const colorInfoColumn = document.createElement('div');
        colorInfoColumn.classList.add('d-flex', 'flex-row', 'flex-lg-column', 'justify-content-start');

        const hexDiv = document.createElement('div');
        hexDiv.className = 'me-3';

        const hexLabel = document.createElement('small');
        hexLabel.classList.add('mb-0', 'color-info-label');
        hexLabel.textContent = 'HEX';

        const hexInfoBlock = document.createElement('div');
        hexInfoBlock.classList.add('d-flex', 'color-info-block');

        const hexNumber = document.createElement('p');
        hexNumber.classList.add('hex', 'color-info-text', 'me-2');
        hexNumber.textContent = color.slice(1).toUpperCase();

        const hexCopy = document.createElement('i');
        hexCopy.classList.add('bi', 'bi-copy', 'color-info-copy');
        hexCopy.style.cursor = 'pointer';

        const rgbDiv = document.createElement('div');
        rgbDiv.className = 'me-3';

        const rgbLabel = document.createElement('small');
        rgbLabel.classList.add('mb-0', 'color-info-label');
        rgbLabel.textContent = 'RGB';

        const rgbInfoBlock = document.createElement('div');
        rgbInfoBlock.classList.add('d-flex', 'color-info-block');

        const rgbNumber = document.createElement('p');
        rgbNumber.classList.add('rgb', 'color-info-text', 'me-2');
        rgbNumber.textContent = hexToRgbString(color);

        const rgbCopy = document.createElement('i');
        rgbCopy.classList.add('bi', 'bi-copy', 'color-info-copy');
        rgbCopy.style.cursor = 'pointer';

        const hslDiv = document.createElement('div');
        hslDiv.className = 'me-3';

        const hslLabel = document.createElement('small');
        hslLabel.classList.add('mb-0', 'color-info-label');
        hslLabel.textContent = 'HSL';

        const hslInfoBlock = document.createElement('div');
        hslInfoBlock.classList.add('d-flex', 'color-info-block');

        const hslNumber = document.createElement('p');
        hslNumber.classList.add('hsl', 'color-info-text', 'me-2');
        hslNumber.textContent = hexToHslString(color);

        const hslCopy = document.createElement('i');
        hslCopy.classList.add('bi', 'bi-copy', 'color-info-copy');
        hslCopy.style.cursor = 'pointer';

        hexInfoBlock.appendChild(hexNumber);
        hexInfoBlock.appendChild(hexCopy);

        rgbInfoBlock.appendChild(rgbNumber);
        rgbInfoBlock.appendChild(rgbCopy);

        hslInfoBlock.appendChild(hslNumber);
        hslInfoBlock.appendChild(hslCopy);

        hexDiv.appendChild(hexLabel);
        hexDiv.appendChild(hexInfoBlock);

        rgbDiv.appendChild(rgbLabel);
        rgbDiv.appendChild(rgbInfoBlock);

        hslDiv.appendChild(hslLabel);
        hslDiv.appendChild(hslInfoBlock);

        colorInfoColumn.appendChild(hexDiv);
        colorInfoColumn.appendChild(rgbDiv);
        colorInfoColumn.appendChild(hslDiv);

        colorInfoDiv.appendChild(colorInfoColumn);
        modalColorsDiv.appendChild(colorInfoDiv);

        const cnvColor = hexToRgbString(color);
        const lightColor = colorIsLight(cnvColor);

        colorInfoColumn.querySelectorAll('.color-info-label').forEach(label => {
            if (lightColor) {
                label.style.color = 'rgb(0, 0, 0, 0.5)';
            } else {
                label.style.color = 'rgb(255, 255, 255, 0.5)';
            }
        });

        colorInfoColumn.querySelectorAll('.color-info-text').forEach(text => {
            if (lightColor) {
                text.style.color = 'black';
            } else {
                text.style.color = 'white';
            }
        });

        colorInfoColumn.querySelectorAll('.bi-copy').forEach(copy => {
            if (lightColor) {
                copy.style.color = 'rgb(0, 0, 0, 0.5)';
            } else {
                copy.style.color = 'rgb(255, 255, 255, 0.5)';
            }
        });
    });

    modalTitleDiv.appendChild(modalUsername);
    modalTitleDiv.appendChild(modalTitleText);

    modalBody.appendChild(modalColorsDiv);

    modalHeader.appendChild(modalTitleDiv);
    modalHeader.appendChild(modalCloseBtn);

    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);

    modalDialog.appendChild(modalContent);
    modalDiv.appendChild(modalDialog);

    return modalDiv;
}

function bottomRowDetection() {
    const palettes = document.querySelectorAll('.palette');
    if (!palettes.length) return;

    let maxOffsetTop = 0;
    palettes.forEach(palette => {
        if (palette.offsetTop > maxOffsetTop) {
            maxOffsetTop = palette.offsetTop;
        }
    });

    palettes.forEach(palette => {
        if (palette.offsetTop === maxOffsetTop) {
            const dropdownDiv = palette.querySelector('.td-dd');
            if (dropdownDiv) {
                dropdownDiv.classList.remove('dropdown');
                dropdownDiv.classList.add('dropup');
            }
        }
    });
}

async function checkAndLoadMore() {
    const paletteGrid = document.querySelector('.palette-grid');
    if (!paletteGrid) return;

    const initialPaletteCount = paletteGrid.children.length;
    const totalPalettesAvailable = parseInt(paletteGrid.dataset.total);
    
    const gridBottom = paletteGrid.getBoundingClientRect().bottom;
    const viewportBottom = window.innerHeight;

    const isBelowViewport = gridBottom > viewportBottom;

    if (!loading && initialPaletteCount < totalPalettesAvailable && !isBelowViewport) {
        console.log('triggered');
        await loadMorePalettes();
        setTimeout(checkAndLoadMore, 300);
    }
}

// Event Listeners & Initialization
document.addEventListener('DOMContentLoaded', function () {
    if (document.querySelector('#palette-maker')) {
        initializePalette();
    }

    disableEnableRandomizers();
    bottomRowDetection();

    document.addEventListener('click', e => {
        if (e.target.classList.contains('add-btn-div') || e.target.classList.contains('add-btn')) {
            const clickedColumn = e.target.closest('.color-column');
            addColorColumn('', true, clickedColumn);
        } else if (e.target.closest('.randomizer-dropdown') && e.target.classList.contains('dropdown-item')) {
            updateDropdownText.call(e.target);
        } else if (e.target.classList.contains('like-btn')) {
            const isLoggedIn = document.body.dataset.userAuthenticated === 'true';

            if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = '/login/?next=' + window.location.pathname;
                return;
            }

            likePalette.call(e.target);
        } else if (e.target.id === 'randomize-btn') {
            const mode = document.querySelector('.dropdown-toggle').dataset.selectedMode;
            randomizePalette(mode);
        } else if (e.target.classList.contains('remove-btn-div') || e.target.classList.contains('remove-btn')) {
            removeColorColumn(e.target);
        } else if (e.target.classList.contains('bi-copy')) {
            handleCopyClick(e.target);
        } else if (e.target.classList.contains('delete-btn')) {
            openDeleteModal(e.target);
        } else if (e.target.id === 'confirm-delete-btn') {
            const modalEl = document.getElementById('deleteModal');
            const paletteId = modalEl.dataset.pendingDeleteBtnId;

            console.log('modalEl:', modalEl);
            console.log('paletteId:', paletteId);

            if (paletteId) {
                const paletteEl = document.querySelector(`.palette[data-id="${paletteId}"]`);

                console.log('paletteEl:', paletteEl);

                if (paletteEl) {
                    deletePalette.call(paletteEl.querySelector('.delete-btn'));
                }
                modalEl.removeAttribute('data-pending-delete-btn-id');
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                modalInstance.hide();
            }
        } else if (e.target.classList.contains('view-details-btn')) {
            const paletteId = e.target.closest('.palette').dataset.id;
            console.log('paletteId:', paletteId);
            if (paletteId) {
                handlePaletteModal(paletteId);
            }
        } else if (e.target.classList.contains('save-btn')) {
            const isLoggedIn = document.body.dataset.userAuthenticated === 'true';

            if (!isLoggedIn) {
                e.preventDefault();
                window.location.href = '/login/?next=' + window.location.pathname;
                return;
            }

            const saveModal = new bootstrap.Modal(document.getElementById('savePaletteModal'));
            saveModal.show();
        } else if (e.target.id === 'showCreatedBtn' || 'showLikedBtn') {
            const createdView = document.getElementById('createdView');
            const likedView = document.getElementById('likedView');
            const showCreatedBtn = document.getElementById('showCreatedBtn');
            const showLikedBtn = document.getElementById('showLikedBtn');

            if (e.target.id === 'showCreatedBtn') {
                createdView.classList.remove('d-none');
                likedView.classList.add('d-none');
                createdView.classList.add('active');
                likedView.classList.remove('active');

                showCreatedBtn.style.color = 'white';
                showLikedBtn.style.color = 'lightgray';
            } 
            
            if (e.target.id === 'showLikedBtn') {
                likedView.classList.remove('d-none');
                createdView.classList.add('d-none');
                likedView.classList.add('active');
                createdView.classList.remove('active');

                showLikedBtn.style.color = 'white';
                showCreatedBtn.style.color = 'lightgray';
            }
        }
    });

    document.addEventListener('mouseout', e => {
        if (e.target.classList.contains('color-column')) {
            toggleAddRmvBtns();
        }
    });

    document.addEventListener('mouseover', e => {
        if (e.target.classList.contains('color-column')) {
            toggleAddRmvBtns();
        }
    });

    document.addEventListener('submit', e => {
        if (e.target.id === 'palette-form') {
            savePalette(e);
        }
    });

    document.querySelectorAll('.like-btn').forEach(likeBtn => {
        displayLikeCount(likeBtn);
    });

    document.querySelectorAll('[data-hex]').forEach(el => {
        const hex = el.dataset.hex;
        const rgbEl = el.querySelector('.rgb');
        const hslEl = el.querySelector('.hsl');

        if (rgbEl) rgbEl.textContent = hexToRgbString(hex);
        if (hslEl) hslEl.textContent = hexToHslString(hex);
    });

    if (document.querySelector('#palette-maker')) {
        normalizeAllColorInputs();
        window.addEventListener('visibilitychange', normalizeAllColorInputs);
    }

    window.addEventListener('scroll', () => {
        const nearBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 200;
        if (nearBottom) {
            loadMorePalettes();
        }
    });
    checkAndLoadMore();
});