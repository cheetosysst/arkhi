import { Island } from "@/arkhi/client";
import React, { useState } from "react";

function Accumulator_({ ...props }) {
    const [count, setCount] = useState(0);
    return (
        <button
            type="button"
            onClick={() => setCount((count) => count + 1)}
            {...props}
        >
            Accumulator {count}
        </button>
    );
}

const Accumulator = Island(Accumulator_);
export default Accumulator;

function Adder_({ ...props }) {
    const [count, setCount] = useState(0);
    return (
        <button type="button" {...props} onClick={() => setCount(count + 1)}>
            Adder {count}
        </button>
    );
}
export const Adder = Island(Adder_);

function Counter_({ temp, ...props }: { temp?: string }) {
    const [count, setCount] = useState(0);
    return (
        <button
            type="button"
            {...props}
            onClick={() => setCount((count) => count + 1)}
        >
            Counter {count}
        </button>
    );
}

export const Counter = Island(Counter_);

function CountNumber_({ temp, ...props }: { temp?: string }) {
    const [count, setCount] = useState(0);
    return (
        <button
            type="button"
            {...props}
            onClick={() => setCount((count) => count + 1)}
        >
            CountNumber {count}
        </button>
    );
}

export const CountNumber = Island(CountNumber_);

function TextDisplay_({ temp, ...props }: { temp?: string }) {
    const [text, setText] = useState("Initial text");
    return (
        <div
            {...props}
            onClick={() => setText("Text after click")}
        >
            {text}
        </div>
    );
}

export const TextDisplay = Island(TextDisplay_);

function ReverseCounter_({ temp, ...props }: { temp?: string }) {
    const [count, setCount] = useState(10);
    return (
        <button
            type="button"
            {...props}
            onClick={() => setCount((count) => count - 1)}
        >
            ReverseCounter {count}
        </button>
    );
}

export const ReverseCounter = Island(ReverseCounter_);

// Toggle Component
function Toggle_({ temp, ...props }: { temp?: string }) {
    const [isOn, setIsOn] = useState(false);
    return (
        <button
            type="button"
            {...props}
            onClick={() => setIsOn(!isOn)}
        >
            {isOn ? "ON" : "OFF"}
        </button>
    );
}

export const Toggle = Island(Toggle_);

// DoubleCounter Component
function DoubleCounter_({ temp, ...props }: { temp?: string }) {
    const [count, setCount] = useState(0);
    return (
        <button
            type="button"
            {...props}
            onClick={() => setCount((count) => count + 2)}
        >
            Double Counter {count}
        </button>
    );
}

export const DoubleCounter = Island(DoubleCounter_);

// TripleCounter Component
function TripleCounter_({ temp, ...props }: { temp?: string }) {
    const [count, setCount] = useState(0);
    return (
        <button
            type="button"
            {...props}
            onClick={() => setCount((count) => count + 3)}
        >
            Triple Counter {count}
        </button>
    );
}

export const TripleCounter = Island(TripleCounter_);

// ColorChanger Component
function ColorChanger_({ temp, ...props }: { temp?: string }) {
    const [color, setColor] = useState("black");
    return (
        <div {...props}>
            <input
                type="color"
                onChange={(e) => setColor(e.target.value)}
                value={color}
            />
            <div style={{ color: color }}>This text changes color</div>
        </div>
    );
}

export const ColorChanger = Island(ColorChanger_);

// RandomColorChanger Component
function RandomColorChanger_({ temp, ...props }: { temp?: string }) {
    const [color, setColor] = useState("black");
    const changeColor = () => {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        setColor(randomColor);
    }
    return (
        <div {...props} onClick={changeColor}>
            <div style={{ color: color }}>This text changes color randomly</div>
        </div>
    );
}

export const RandomColorChanger = Island(RandomColorChanger_);

// CounterDoubler Component
function CounterDoubler_({ temp, ...props }: { temp?: string }) {
    const [count, setCount] = useState(1);
    return (
        <button
            type="button"
            {...props}
            onClick={() => setCount(count * 2)}
        >
            Counter Doubler {count}
        </button>
    );
}

export const CounterDoubler = Island(CounterDoubler_);

// VolumeController Component
function VolumeController_({ temp, ...props }: { temp?: string }) {
    const [volume, setVolume] = useState(50);
    return (
        <div {...props}>
            <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            <div>Volume: {volume}</div>
        </div>
    );
}

export const VolumeController = Island(VolumeController_);

// DatePicker Component
function DatePicker_({ temp, ...props }: { temp?: string }) {
    const [date, setDate] = useState(new Date().toISOString().substr(0, 10));
    return (
        <div {...props}>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            <div>Selected date: {date}</div>
        </div>
    );
}

export const DatePicker = Island(DatePicker_);

// TodoList Component
function TodoList_({ temp, ...props }: { temp?: string }) {
    const [items, setItems] = useState<string[]>([]);
    const [newItem, setNewItem] = useState("");
    return (
        <div {...props}>
            <input type="text" value={newItem} onChange={(e) => setNewItem(e.target.value)} />
            <button onClick={() => { setItems([...items, newItem]); setNewItem(""); }}>Add</button>
            <ul>
                {items.map((item, index) =>
                    <li key={index}>
                        {item}
                        <button onClick={() => { setItems(items.filter((_, itemIndex) => itemIndex !== index)); }}>Remove</button>
                    </li>
                )}
            </ul>
        </div>
    );
}

export const TodoList = Island(TodoList_);

// Switch Component
function Switch_({ temp, ...props }: { temp?: string }) {
    const [on, setOn] = useState(false);
    return (
        <button type="button" {...props} onClick={() => setOn(!on)}>
            Switch is {on ? "ON" : "OFF"}
        </button>
    );
}

export const Switch = Island(Switch_);

// TextChanger Component
function TextChanger_({ temp, ...props }: { temp?: string }) {
    const [text, setText] = useState("");
    return (
        <div {...props}>
            <input type="text" onChange={(e) => setText(e.target.value)} value={text} />
            <div>Entered text: {text}</div>
        </div>
    );
}

export const TextChanger = Island(TextChanger_);

// ProgressBar Component
function ProgressBar_({ temp, ...props }: { temp?: string }) {
    const [progress, setProgress] = useState(0);
    return (
        <div {...props}>
            <input type="range" min="0" max="100" value={progress} onChange={(e) => setProgress(Number(e.target.value))} />
            <div>Progress: {progress}%</div>
        </div>
    );
}

export const ProgressBar = Island(ProgressBar_);

// Multiplier Component
function Multiplier_({ temp, ...props }: { temp?: string }) {
    const [num, setNum] = useState(1);
    return (
        <button type="button" {...props} onClick={() => setNum(num * 2)}>
            Multiplier {num}
        </button>
    );
}

export const Multiplier = Island(Multiplier_);

// Divisor Component
function Divisor_({ temp, ...props }: { temp?: string }) {
    const [num, setNum] = useState(1);
    return (
        <button type="button" {...props} onClick={() => setNum(num / 2)}>
            Divisor {num}
        </button>
    );
}

export const Divisor = Island(Divisor_);

// NoteMaker Component
function NoteMaker_({ temp, ...props }: { temp?: string }) {
    const [notes, setNotes] = useState<string[]>([]);
    const [newNote, setNewNote] = useState("");
    return (
        <div {...props}>
            <input type="text" value={newNote} onChange={(e) => setNewNote(e.target.value)} />
            <button onClick={() => { setNotes([...notes, newNote]); setNewNote(""); }}>Add Note</button>
            <ul>
                {notes.map((note, index) =>
                    <li key={index}>{note}</li>
                )}
            </ul>
        </div>
    );
}

export const NoteMaker = Island(NoteMaker_);

// BrightnessController Component
function BrightnessController_({ temp, ...props }: { temp?: string }) {
    const [brightness, setBrightness] = useState(50);
    return (
        <div {...props}>
            <input type="range" min="0" max="100" value={brightness} onChange={(e) => setBrightness(Number(e.target.value))} />
            <div>Brightness: {brightness}</div>
        </div>
    );
}

export const BrightnessController = Island(BrightnessController_);

// FontSizeController Component
function FontSizeController_({ temp, ...props }: { temp?: string }) {
    const [fontSize, setFontSize] = useState(16);
    return (
        <div {...props} style={{ fontSize: `${fontSize}px` }}>
            <input type="range" min="8" max="32" value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
            <div>Change my font size</div>
        </div>
    );
}

export const FontSizeController = Island(FontSizeController_);

// Stopwatch Component
function Stopwatch_({ temp, ...props }: { temp?: string }) {
    const [time, setTime] = useState(0);
    let interval: any;

    const start = () => {
        interval = setInterval(() => {
            setTime((prevTime) => prevTime + 1)
        }, 1000);
    }

    const stop = () => {
        clearInterval(interval);
    }

    const reset = () => {
        clearInterval(interval);
        setTime(0);
    }

    return (
        <div {...props}>
            <h1>Stopwatch: {time}</h1>
            <button onClick={start}>Start</button>
            <button onClick={stop}>Stop</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}

export const Stopwatch = Island(Stopwatch_);

// Currency Converter Component
function CurrencyConverter_({ temp, ...props }: { temp?: string }) {
    const [amount, setAmount] = useState(0);
    const [conversionRate, setConversionRate] = useState(0.83); // Example rate for USD to EUR

    const convert = () => amount * conversionRate;

    return (
        <div {...props}>
            <input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} />
            <p>{amount} USD is equivalent to {convert()} EUR</p>
        </div>
    );
}

export const CurrencyConverter = Island(CurrencyConverter_);

// TextMirror Component
function TextMirror_({ temp, ...props }: { temp?: string }) {
    const [text, setText] = useState("");

    return (
        <div {...props}>
            <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
            <p>Mirrored Text: {text.split('').reverse().join('')}</p>
        </div>
    );
}

export const TextMirror = Island(TextMirror_);

// TemperatureConverter Component
function TemperatureConverter_({ temp, ...props }: { temp?: string }) {
    const [celcius, setCelcius] = useState(0);

    const convert = () => (celcius * 9 / 5) + 32;

    return (
        <div {...props}>
            <input type="number" value={celcius} onChange={(e) => setCelcius(Number(e.target.value))} />
            <p>{celcius}°C is equivalent to {convert()}°F</p>
        </div>
    );
}

export const TemperatureConverter = Island(TemperatureConverter_);

// PasswordGenerator Component
function PasswordGenerator_({ temp, ...props }: { temp?: string }) {
    const [password, setPassword] = useState("");

    const generatePassword = () => {
        const length = 12;
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let pass = "";
        for (let i = 0; i < length; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setPassword(pass);
    }

    return (
        <div {...props}>
            <button onClick={generatePassword}>Generate Password</button>
            <p>Password: {password}</p>
        </div>
    );
}

export const PasswordGenerator = Island(PasswordGenerator_);
