
import { useState } from "react";
import {
    Bot,
    Send,
    Leaf,
    Sparkles,
    User,
    Trash2,
    Zap,
    Droplets,
} from "lucide-react";
import "./EcoAssistant.css";

const suggestions = [
    "How can I reduce plastic waste?",
    "Give me 5 ways to save electricity",
    "How can I save water?",
    "What is a carbon footprint?",
];

function getEcoResponse(question) {
    const q = question.toLowerCase();

    if (q.includes("plastic")) {
        return "Here are 5 ways to reduce plastic waste:\n\n1. Carry a reusable shopping bag.\n2. Use a reusable water bottle.\n3. Avoid single-use plastic straws.\n4. Choose products with less packaging.\n5. Reuse and recycle plastic responsibly.";
    }

    if (q.includes("electricity") || q.includes("energy")) {
        return "You can save electricity with these simple habits:\n\n1. Switch off unused lights and fans.\n2. Use LED bulbs.\n3. Choose energy-efficient appliances.\n4. Unplug chargers when not in use.\n5. Use natural daylight whenever possible.";
    }

    if (q.includes("water")) {
        return "Here are 5 ways to conserve water:\n\n1. Turn off taps while brushing.\n2. Repair leaking taps.\n3. Collect rainwater where practical.\n4. Reuse suitable water for gardening.\n5. Take shorter showers.";
    }

    if (q.includes("carbon") || q.includes("footprint")) {
        return "A carbon footprint is the amount of greenhouse gas emissions associated with a person, activity, product or organisation.\n\nYou can reduce it by:\n\n1. Using public transport.\n2. Saving electricity.\n3. Reducing unnecessary consumption.\n4. Choosing reusable products.\n5. Reducing food waste.";
    }

    if (q.includes("tree") || q.includes("plant")) {
        return "Trees support healthy ecosystems. You can help by:\n\n1. Planting suitable native trees.\n2. Caring for existing trees.\n3. Joining local planting programmes.\n4. Avoiding unnecessary paper waste.\n5. Supporting habitat conservation.";
    }

    if (q.includes("waste") || q.includes("recycl")) {
        return "A better waste routine starts with separating waste:\n\n1. Keep paper and cardboard separate.\n2. Separate clean recyclable plastic and metal.\n3. Compost suitable food and garden waste.\n4. Keep hazardous waste separate.\n5. Follow your local recycling collection rules.";
    }

    if (q.includes("hello") || q.includes("hi ") || q === "hi") {
        return "Hello! Welcome to GREENVERSE. I'm your Eco Guide. Ask me about recycling, energy, water conservation, trees or sustainable living!";
    }

    return "That's a great question! I can currently help with plastic reduction, recycling, saving electricity, water conservation, trees and carbon footprints.\n\nTry asking me about one of these topics, and I'll share practical suggestions.";
}

function EcoAssistant() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            text: "Hello! I'm your GREENVERSE Eco Guide. Ask me anything about sustainable living. Let's make our planet greener together!",
        },
    ]);

    const [input, setInput] = useState("");

    const sendMessage = (text) => {
        const question = text.trim();
        if (!question) return;

        const answer = getEcoResponse(question);

        setMessages((previous) => [
            ...previous,
            { role: "user", text: question },
            { role: "assistant", text: answer },
        ]);

        setInput("");
    };

    const clearChat = () => {
        setMessages([
            {
                role: "assistant",
                text: "Chat cleared! What would you like to learn about the environment?",
            },
        ]);
    };

    return (
        <section className="eco-section" id="assistant">
            <div className="eco-heading">
                <span className="section-tag">MEET YOUR ECO GUIDE</span>
                <h2>Ask better questions.<br /><span>Make greener choices.</span></h2>
                <p>
                    Your sustainability companion for everyday environmental decisions.
                </p>
            </div>

            <div className="eco-chat">
                <div className="eco-chat-header">
                    <div className="eco-bot-avatar">
                        <Bot size={25} />
                    </div>

                    <div className="eco-bot-info">
                        <h3>GREENVERSE Eco Guide</h3>
                        <span><i></i> Ready to help</span>
                    </div>

                    <button
                        className="eco-clear"
                        onClick={clearChat}
                        type="button"
                        aria-label="Clear chat"
                        title="Clear chat"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>

                <div className="eco-messages" aria-live="polite">
                    {messages.map((message, index) => (
                        <div
                            className={`eco-message ${message.role}`}
                            key={index}
                        >
                            <div className="message-avatar">
                                {message.role === "assistant"
                                    ? <Leaf size={17} />
                                    : <User size={17} />}
                            </div>

                            <div className="message-bubble">
                                {message.text.split("\n").map((line, lineIndex) => (
                                    <span key={lineIndex}>
                                        {line}
                                        {lineIndex !== message.text.split("\n").length - 1 && <br />}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="eco-suggestions">
                    <div className="suggestion-heading">
                        <Sparkles size={15} /> TRY ASKING
                    </div>

                    <div className="suggestion-list">
                        {suggestions.map((suggestion) => (
                            <button
                                key={suggestion}
                                type="button"
                                onClick={() => sendMessage(suggestion)}
                            >
                                {suggestion}
                            </button>
                        ))}
                    </div>
                </div>

                <form
                    className="eco-input-area"
                    onSubmit={(event) => {
                        event.preventDefault();
                        sendMessage(input);
                    }}
                >
                    <input
                        type="text"
                        value={input}
                        onChange={(event) => setInput(event.target.value)}
                        placeholder="Ask something about sustainability..."
                        aria-label="Your environmental question"
                    />

                    <button
                        type="submit"
                        disabled={!input.trim()}
                        aria-label="Send message"
                    >
                        <Send size={19} />
                    </button>
                </form>

                <p className="eco-note">
                    <Sparkles size={12} /> Currently using a curated demo knowledge base, not a live AI model.
                </p>
            </div>
        </section>
    );
}

export default EcoAssistant;
