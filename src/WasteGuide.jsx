
import { useState } from "react";
import {
    Search,
    Recycle,
    Leaf,
    Battery,
    Package,
    Apple,
    GlassWater,
    AlertTriangle,
    Trash2,
    CheckCircle2,
} from "lucide-react";
import "./WasteGuide.css";

const wasteItems = [
    {
        name: "Plastic bottle",
        category: "Recyclable",
        icon: "plastic",
        description: "Water and soft drink bottles",
        instruction: "Empty the bottle, rinse it if needed and keep it separate from general waste. Follow your local plastic collection rules.",
        tip: "Remove leftover liquid before recycling.",
    },
    {
        name: "Cardboard",
        category: "Recyclable",
        icon: "paper",
        description: "Boxes and packaging",
        instruction: "Keep cardboard clean and dry. Flatten boxes and separate them for paper recycling.",
        tip: "Avoid mixing cardboard with food or oil.",
    },
    {
        name: "Glass bottle",
        category: "Recyclable",
        icon: "glass",
        description: "Glass jars and bottles",
        instruction: "Empty and rinse glass containers. Keep broken glass wrapped securely and follow local collection instructions.",
        tip: "Do not mix broken glass with loose household waste.",
    },
    {
        name: "Food scraps",
        category: "Organic",
        icon: "organic",
        description: "Fruit peels and vegetable scraps",
        instruction: "Separate suitable food scraps for composting or an approved organic-waste collection service.",
        tip: "Avoid adding plastic, glass or metal to compost.",
    },
    {
        name: "Dry leaves",
        category: "Organic",
        icon: "organic",
        description: "Garden leaves and plant waste",
        instruction: "Collect dry leaves separately and use them for composting or mulching where suitable.",
        tip: "Never burn garden waste in the open.",
    },
    {
        name: "Used batteries",
        category: "Hazardous",
        icon: "battery",
        description: "Household and rechargeable batteries",
        instruction: "Keep batteries separate from regular household waste. Take them to an authorised battery collection or e-waste centre.",
        tip: "Never burn, crush or puncture batteries.",
    },
    {
        name: "Old mobile phone",
        category: "E-Waste",
        icon: "battery",
        description: "Phones and small electronic devices",
        instruction: "Keep electronic waste separate. Use an authorised e-waste collection point or an approved take-back programme.",
        tip: "Erase personal data before handing over your device.",
    },
    {
        name: "Aluminium can",
        category: "Recyclable",
        icon: "plastic",
        description: "Soft drink and food cans",
        instruction: "Empty and rinse the can, then separate it for metal recycling according to local collection rules.",
        tip: "Keep recyclable metal clean and dry.",
    },
    {
        name: "Used cooking oil",
        category: "Hazardous",
        icon: "glass",
        description: "Leftover frying oil",
        instruction: "Allow the oil to cool, store it in a sealed container and use an authorised collection service where available. Never pour it into drains.",
        tip: "Keep cooking oil away from sinks and waterways.",
    },
    {
        name: "Old clothes",
        category: "Reusable",
        icon: "paper",
        description: "Clothing and fabric items",
        instruction: "Donate wearable clothes or use a textile collection programme. Keep unusable fabric separate for suitable textile recovery.",
        tip: "Repair or reuse clothes before discarding them.",
    },
];

const filters = [
    "All",
    "Recyclable",
    "Organic",
    "Hazardous",
    "E-Waste",
    "Reusable",
];

function WasteIcon({ type }) {
    const icons = {
        plastic: Recycle,
        paper: Package,
        glass: GlassWater,
        organic: Apple,
        battery: Battery,
    };

    const Icon = icons[type] || Trash2;
    return <Icon size={27} />;
}

function WasteGuide() {
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [selectedItem, setSelectedItem] = useState(null);

    const filteredItems = wasteItems.filter((item) => {
        const matchesSearch =
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description.toLowerCase().includes(search.toLowerCase());

        const matchesFilter =
            activeFilter === "All" || item.category === activeFilter;

        return matchesSearch && matchesFilter;
    });

    return (
        <section className="waste-section" id="waste-guide">
            <div className="waste-heading">
                <span className="section-tag">DISPOSE RESPONSIBLY</span>
                <h2>Waste less.<br /><span>Recycle more.</span></h2>
                <p>
                    Find out how to sort everyday waste and make
                    better choices for our environment.
                </p>
            </div>

            <div className="waste-search">
                <Search size={20} />
                <input
                    type="search"
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setSelectedItem(null);
                    }}
                    placeholder="Search waste... e.g. plastic bottle, battery"
                    aria-label="Search waste items"
                />
            </div>

            <div className="waste-filters">
                {filters.map((filter) => (
                    <button
                        key={filter}
                        type="button"
                        className={activeFilter === filter ? "active" : ""}
                        onClick={() => {
                            setActiveFilter(filter);
                            setSelectedItem(null);
                        }}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            <div className="waste-results">
                <div className="waste-results-heading">
                    <h3>Explore waste categories</h3>
                    <span>{filteredItems.length} items found</span>
                </div>

                <div className="waste-grid">
                    {filteredItems.map((item) => (
                        <button
                            className={`waste-card ${selectedItem?.name === item.name ? "selected" : ""}`}
                            key={item.name}
                            type="button"
                            onClick={() =>
                                setSelectedItem(
                                    selectedItem?.name === item.name ? null : item
                                )
                            }
                            aria-pressed={selectedItem?.name === item.name}
                        >
                            <span className="waste-card-icon">
                                <WasteIcon type={item.icon} />
                            </span>

                            <span className="waste-card-category">
                                {item.category}
                            </span>

                            <strong>{item.name}</strong>
                            <small>{item.description}</small>

                            <span className="waste-card-link">
                                View disposal guide →
                            </span>
                        </button>
                    ))}
                </div>

                {filteredItems.length === 0 && (
                    <div className="waste-empty">
                        <Search size={30} />
                        <h3>No matching items</h3>
                        <p>Try another search term or choose a different category.</p>
                        <button
                            type="button"
                            onClick={() => {
                                setSearch("");
                                setActiveFilter("All");
                            }}
                        >
                            Clear filters
                        </button>
                    </div>
                )}
            </div>

            {selectedItem && (
                <div className="waste-detail" aria-live="polite">
                    <div className="waste-detail-title">
                        <span className="waste-card-icon">
                            <WasteIcon type={selectedItem.icon} />
                        </span>
                        <div>
                            <span className="section-tag">DISPOSAL INSTRUCTIONS</span>
                            <h3>{selectedItem.name}</h3>
                        </div>
                    </div>

                    <div className="waste-instruction">
                        <CheckCircle2 size={20} />
                        <p>{selectedItem.instruction}</p>
                    </div>

                    <div className="waste-tip">
                        <Leaf size={19} />
                        <p><strong>Eco tip:</strong> {selectedItem.tip}</p>
                    </div>
                </div>
            )}

            <div className="waste-warning">
                <AlertTriangle size={19} />
                <p>
                    Waste collection and recycling rules vary by location.
                    Always follow your local municipality's instructions.
                    Hazardous and electronic waste should go to authorised collection facilities.
                </p>
            </div>
        </section>
    );
}

export default WasteGuide;
