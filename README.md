<div align="center">

# 🔮 Glyph

**A visual project hub for game developers, worldbuilders, writers — and anyone who works with ideas, data, and complex projects.**

*Think. Connect. Create.*

[![Status](https://img.shields.io/badge/status-in%20development-orange)]()
[![Built with Rust](https://img.shields.io/badge/core-Rust-DE4C36?logo=rust&logoColor=white)]()
[![Built with Tauri](https://img.shields.io/badge/app-Tauri-24C8DB?logo=tauri&logoColor=white)]()
[![Cross-platform](https://img.shields.io/badge/platform-Desktop%20%7C%20Mobile%20%7C%20Web-blueviolet)]()

</div>

---

Game development produces an absurd amount of information — design documents, characters, mechanics, locations, quests, economy sheets, notes, references, files, and a hundred half-formed ideas that might one day matter.

Normally, all of that ends up scattered: one app for notes, another for spreadsheets, another for diagrams, another for docs, another for tasks.

**Glyph exists to close that gap.** One workspace, where everything can live — and, more importantly, everything can *connect*.

## Table of Contents

- [Everything is an object](#-everything-is-an-object)
- [From idea to structured information](#️-from-idea-to-structured-information)
- [Designed around game development](#-designed-around-game-development)
- [Relationships](#️-relationships)
- [Multiple representations](#️-multiple-representations)
- [A powerful editor](#-a-powerful-editor)
- [References & anchors](#-references--anchors)
- [Tags & filtering](#️-tags--filtering)
- [Structured data](#-structured-data)
- [Project files](#-project-files)
- [Modular workspace](#-modular-workspace)
- [Core philosophy](#-core-philosophy)
- [Technology](#️-technology)
- [Roadmap](#️-roadmap)
- [Long-term vision](#-the-long-term-vision)
- [Contributing](#-contributing)

---

## 🧠 Everything is an object

Information in Glyph doesn't have to live as isolated documents. A character, a mechanic, a location, a quest, a note — each can exist as an **object**, and objects can connect to one another.

```
                    ┌──────────────┐
                    │   Character  │
                    │   "Arthur"   │
                    └──────┬───────┘
                           │
                ┌──────────┼──────────┐
                │          │          │
                ▼          ▼          ▼
          ┌──────────┐ ┌────────┐ ┌──────────┐
          │  Quest   │ │ Faction│ │ Location │
          └──────────┘ └────────┘ └──────────┘
```

This lets Glyph represent not just *what* information exists, but *how it relates* to everything else in the project.

## ✍️ From idea to structured information

You're writing a scenario:

> *"Arthur enters the room and notices the strange symbol carved into the wall..."*

Arthur is clearly becoming important. Instead of switching apps and building a character sheet by hand, select his name and turn it into a project object right there:

```
Scenario
   │
   └── Arthur
        │
        └── Create → Character
```

Glyph creates a character entry — name, description, personality, background, relationships, factions, appearances, images, custom fields — and keeps it linked back to the moment he was first mentioned.

## 🎮 Designed around game development

A project structure might look like:

```
My Game
├── 📖 Documentation   (GDD, Combat System, Progression, Economy)
├── 🧙 Characters       (Arthur, Elizabeth, The Merchant)
├── 🌍 World            (Locations, Factions, History)
├── ⚔️ Gameplay         (Mechanics, Weapons, Abilities)
├── 📜 Narrative        (Main Story, Quests, Dialogues)
├── 📊 Data             (Items, Enemies, Economy)
└── 📁 Files            (Concept Art, References, Audio)
```

This structure isn't fixed — **the user builds their own workspace.**

## 🕸️ Relationships

Complex projects are relationships all the way down: a character belongs to a faction, a faction controls a location, a quest involves several characters, a mechanic depends on another mechanic. Glyph treats these connections as first-class project data.

```
Arthur
 ├── member of   → Knights
 ├── lives in    → Eldoria
 ├── involved in → The Broken Crown
 ├── knows       → Elizabeth
 └── uses        → Royal Sword
```

The same relationships, as a graph:

```
             Elizabeth
                 │ knows
                 ▼
Arthur ────────► Knights
  │                │
  │ lives in       │ controls
  ▼                ▼
Eldoria ◄────── Castle
```

## 🗺️ Multiple representations

The same data, seen differently depending on what you're trying to understand:

| Representation | Best for |
|---|---|
| 🌳 Tree | Project hierarchy |
| 🕸️ Graph | Relationship networks |
| 📝 Document | Narrative, lore |
| 🧱 Blocks | Flexible composition |
| 📊 Table | Economy, balancing |
| 🃏 Cards | Character databases |
| 📋 List | Quick reference |
| ⏱️ Timeline | Story pacing, audio |

## 📝 A powerful editor

At its core, Glyph is also a serious writing environment — documentation, scenarios, notes, design docs, nested lists, headings, anchors, and inline references to project objects. The goal is a document editor with the flexibility of prose and the structure of a database.

## 🔗 References & anchors

Instead of retyping the same facts everywhere, documents can reference existing objects directly:

```
The player meets Arthur in Eldoria.
                ↓
The player meets [Arthur] in [Eldoria].
```

Those brackets aren't decoration — they point straight to the underlying objects, so documentation is never disconnected from the data it describes.

## 🏷️ Tags & filtering

```
Tags: #main-character #enemy #boss #quest #unfinished #important #lore

Characters
WHERE faction = "Knights"
AND status = "alive"
AND tag = "#main-character"
```

The exact query syntax may evolve — the principle won't: **you organize it your way.**

## 📊 Structured data

Not everything belongs in prose. Item databases, enemy stats, character attributes, economy, progression, crafting — Glyph provides real tables for real numbers.

| Item | Damage | Price | Weight |
|---|--:|--:|--:|
| Iron Sword | 25 | 120 | 3.2 |
| Steel Sword | 40 | 350 | 4.1 |
| Royal Sword | 75 | 1200 | 5.0 |

## 📁 Project files

Projects eventually need real assets, not just data:

```
Project
├── Documents
├── Characters
├── Locations
├── Data
└── Files
    ├── concept_art.png
    ├── reference.jpg
    ├── soundtrack.wav
    └── prototype.zip
```

A project-level file workspace is planned, so assets live next to the objects that reference them — including more advanced workflows down the line, like arranging audio resources on a timeline.

## 🧩 Modular workspace

Different creators need different tools:

| Role | Might need |
|---|---|
| Game designer | Characters, Locations, Quests, Mechanics, Economy |
| Writer | Characters, Chapters, Scenes, Timeline, Notes |
| Programmer | Documentation, Specs, Architecture, Tasks |
| Filmmaker | Characters, Scenes, Scripts, Assets, Timeline |

Glyph aims to be **modular** — enable the views and tools you actually need, ignore the rest.

## 🧱 Core philosophy

- **Everything should be connected** — no isolated silos.
- **One object, multiple views** — document, card, table, or graph, same underlying data.
- **Structure without rigidity** — your organizational system, not ours.
- **Visual organization** — large projects are easier to hold in your head when you can see them.
- **One workspace** — fewer apps, more clarity.
- **Extensibility** — game dev first, but not game dev only.

## 🚧 Current Status

Glyph is under active development. Architecture and scope are still evolving — several sections above describe the **long-term direction**, not finished features yet.

## 🛠️ Technology

**Core** — 🦀 Rust · ⚡ Tokio · file-based project storage · JSON serialization · generic `Storable` abstraction

**Application** — 🖥️ Tauri · 🌐 web-based frontend · 📱 cross-platform (desktop, mobile, web)

Core project logic is kept independent from the interface, so the same engine can drive different frontends across platforms.

## 🗺️ Roadmap

**Foundation**
- [x] Basic project structure
- [x] Entity storage
- [x] Serialization
- [x] Generic `Storable` abstraction
- [ ] Project management
- [ ] Robust persistence layer

**Editor** — Rich text · Markdown · nested blocks · anchors · internal references · drag & drop · embeds

**Project Objects** — Custom types · custom properties · tags · collections · templates · references · relationships

**Visualization** — Tree · Graph · Card · Table · Timeline · Visual canvas

**Search** — Global search · filtering · tag-based search · cross-document search

**Files** — Project explorer · asset management · previews · resource references

**Future** — Modular workspace · plugins/extensions · collaboration · cloud sync · version history

## 🌌 The Long-Term Vision

Not another notes app. The goal is closer to:

> **A visual operating system for creative projects.**

Starting from a single idea —

```
"I want to make a game about..."
```

— and growing it into a fully connected structure:

```
Idea
├── World       (Locations, Factions, History)
├── Characters  (Protagonist, Companions, Enemies)
├── Gameplay    (Combat, Progression, Economy)
├── Story       (Acts, Quests, Dialogues)
└── Assets      (Art, Audio, References)
```

Every piece able to reference and interact with every other piece.

**One project. One workspace. One connected system.**

## 🤝 Contributing

Glyph's architecture is still taking shape. Ideas, issues, and architectural discussion are welcome — for larger features, opening a discussion first is the best way to align on direction before diving into code.

## 📜 License

License information will be added as the project matures.

---

<div align="center">

**Glyph** — *A workspace for turning ideas into worlds.*

</div>
