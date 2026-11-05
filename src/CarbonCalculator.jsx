
import { useState } from "react";
import { Zap, Car, Bus, Leaf, RotateCcw } from "lucide-react";
import "./CarbonCalculator.css";

function CarbonCalculator() {
    const [electricity, setElectricity] = useState("150");
    const [carDistance, setCarDistance] = useState("300");
    const [busDistance, setBusDistance] = useState("200");

    const electricityEmission = Math.max(0, Number(electricity) || 0) * 0.70;
    const carEmission = Math.max(0, Number(carDistance) || 0) * 0.18;
    const busEmission = Math.max(0, Number(busDistance) || 0) * 0.05;

    const total = electricityEmission + carEmission + busEmission;

    const resetCalculator = () => {
        setElectricity("0");
        setCarDistance("0");
        setBusDistance("0");
    };

    const categories = [
        {
            name: "Electricity",
            value: electricityEmission,
            icon: Zap,
            color: "electricity",
        },
        {
            name: "Car travel",
            value: carEmission,
            icon: Car,
            color: "car",
        },
        {
            name: "Public transport",
            value: busEmission,
            icon: Bus,
            color: "transport",
        },
    ];

    return (
        <section className="calculator-section" id="calculator">
            <div className="calculator-heading">
                <span className="section-tag">KNOW YOUR IMPACT</span>
                <h2>Your lifestyle.<br /><span>Your carbon footprint.</span></h2>
                <p>
                    Enter your monthly usage and discover an approximate
                    estimate of your carbon emissions.
                </p>
            </div>

            <div className="calculator-layout">
                <div className="calculator-form">
                    <div className="calculator-title">
                        <Leaf size={22} />
                        <div>
                            <h3>Your monthly activity</h3>
                            <p>Enter your average monthly usage.</p>
                        </div>
                    </div>

                    <label className="calculator-field">
                        <span><Zap size={18} /> Electricity consumption</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                min="0"
                                value={electricity}
                                onChange={(e) => setElectricity(e.target.value)}
                            />
                            <small>kWh / month</small>
                        </div>
                    </label>

                    <label className="calculator-field">
                        <span><Car size={18} /> Car travel distance</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                min="0"
                                value={carDistance}
                                onChange={(e) => setCarDistance(e.target.value)}
                            />
                            <small>km / month</small>
                        </div>
                    </label>

                    <label className="calculator-field">
                        <span><Bus size={18} /> Public transport distance</span>
                        <div className="input-with-unit">
                            <input
                                type="number"
                                min="0"
                                value={busDistance}
                                onChange={(e) => setBusDistance(e.target.value)}
                            />
                            <small>km / month</small>
                        </div>
                    </label>

                    <button
                        className="reset-calculator"
                        onClick={resetCalculator}
                        type="button"
                    >
                        <RotateCcw size={16} /> Reset values
                    </button>
                </div>

                <div className="calculator-result">
                    <span className="result-label">YOUR ESTIMATED MONTHLY FOOTPRINT</span>

                    <div className="result-number">
                        {total.toFixed(1)}
                        <span>kg CO₂e</span>
                    </div>

                    <p className="result-description">
                        Estimated emissions from the three activities you entered.
                    </p>

                    <div className="result-divider"></div>

                    <h4>Emission breakdown</h4>

                    {categories.map((category) => {
                        const percentage = total > 0
                            ? (category.value / total) * 100
                            : 0;

                        const Icon = category.icon;

                        return (
                            <div className="emission-item" key={category.name}>
                                <div className="emission-info">
                                    <span><Icon size={17} /> {category.name}</span>
                                    <strong>{category.value.toFixed(1)} kg</strong>
                                </div>

                                <div className="emission-track">
                                    <div
                                        className={`emission-fill ${category.color}`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}

                    <p className="calculator-disclaimer">
                        Educational estimate only. Uses illustrative emission factors
                        of 0.70 kg/kWh, 0.18 kg/km for cars and 0.05 kg/km
                        for public transport. Actual emissions vary by location,
                        vehicle, fuel and energy source.
                    </p>
                </div>
            </div>
        </section>
    );
}

export default CarbonCalculator;
