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