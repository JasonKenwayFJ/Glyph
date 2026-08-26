# Glyph

> **A visual project hub for game developers, creators, writers, and anyone who works with ideas, data, and complex projects.**

Glyph is a cross-platform workspace designed primarily for **game development**, combining documentation, worldbuilding, planning, structured data, relationships, and project organization into a single flexible environment.

The goal is simple:

**Instead of scattering your project across dozens of applications, Glyph gives you one place where everything can exist — and, more importantly, everything can be connected.**

---

## ✨ What is Glyph?

Game development produces an absurd amount of information.

You have:

* 📖 Game Design Documents
* 🧙 Characters
* ⚔️ Gameplay mechanics
* 🌍 Locations
* 📜 Stories and scenarios
* 🧩 Quests
* 🎮 Systems
* 💰 Economy calculations
* 📝 Notes
* 🗂️ References
* 🔗 Relationships between objects
* 📊 Tables
* 📁 Files and assets
* 💡 Random ideas that may eventually become something important

Usually, all of this ends up distributed across different applications.

One application for notes.

Another for spreadsheets.

Another for diagrams.

Another for project files.

Another for task management.

Another for documentation.

Another for writing.

**Glyph aims to bring these things together.**

---

# 🧠 Everything is an object

One of Glyph's core ideas is that information shouldn't exist only as isolated documents.

A character can be an object.

A mechanic can be an object.

A location can be an object.

A quest can be an object.

A note can be an object.

And these objects can be **connected to each other**.

For example:

```text
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

This allows Glyph to represent not only **what information exists**, but also **how that information relates to everything else**.

---

# ✍️ From idea → structured information

Imagine you're writing a scenario.

You introduce a character:

> *"Arthur enters the room and notices the strange symbol carved into the wall..."*

You realize that **Arthur** is going to become an important character.

Instead of manually switching applications and creating a character document, you can select his name and turn it into a project object.

```text
Scenario
   │
   └── Arthur
        │
        └── Create → Character
```

Glyph creates a character entry that can later contain:

* Name
* Description
* Personality
* Background
* Relationships
* Factions
* Locations
* Appearances
* Notes
* Images
* References
* Custom fields

And the original mention of Arthur can remain connected to that object.

---

# 🎮 Designed around game development

Glyph is especially suited for building games and other creative projects.

Possible project structures include:

```text
My Game
│
├── 📖 Documentation
│   ├── Game Design Document
│   ├── Combat System
│   ├── Progression
│   └── Economy
│
├── 🧙 Characters
│   ├── Arthur
│   ├── Elizabeth
│   └── The Merchant
│
├── 🌍 World
│   ├── Locations
│   ├── Factions
│   └── History
│
├── ⚔️ Gameplay
│   ├── Mechanics
│   ├── Weapons
│   └── Abilities
│
├── 📜 Narrative
│   ├── Main Story
│   ├── Quests
│   └── Dialogues
│
├── 📊 Data
│   ├── Items
│   ├── Enemies
│   └── Economy
│
└── 📁 Files
    ├── Concept Art
    ├── References
    └── Audio
```

The important part is that this structure isn't necessarily fixed.

**The user should be able to build their own workspace.**

---

# 🕸️ Relationships

Complex projects contain relationships everywhere.

A character belongs to a faction.

A faction controls a location.

A quest involves several characters.

A weapon belongs to a category.

A mechanic depends on another mechanic.

A story event changes the state of the world.

Glyph aims to make these relationships first-class project data.

For example:

```text
Arthur
 ├── member of → Knights
 ├── lives in → Eldoria
 ├── involved in → The Broken Crown
 ├── knows → Elizabeth
 └── uses → Royal Sword
```

These relationships can then be represented through different visualizations.

### Graph

```text
             Elizabeth
                 │
                 │ knows
                 ▼
Arthur ────────► Knights
  │                │
  │ lives in       │ controls
  ▼                ▼
Eldoria ◄────── Castle
```

### List

```text
Arthur
├── Faction: Knights
├── Location: Eldoria
├── Quest: The Broken Crown
├── Relationship: Elizabeth
└── Weapon: Royal Sword
```

### Cards

Each object can also have its own visual representation.

**One piece of data — multiple ways to see it.**

---

# 🗺️ Multiple representations

Glyph isn't meant to force everything into one format.

The same project information can potentially be represented as:

* 🌳 Trees
* 🕸️ Relationship graphs
* 📝 Documents
* 🧱 Blocks
* 📊 Tables
* 🃏 Cards
* 📋 Lists
* 🗂️ Collections
* 🗺️ Visual maps
* ⏱️ Timelines

The representation should depend on **what you're trying to understand**.

A character database works well as cards.

An economy works well as a table.

A relationship network works well as a graph.

A story works well as a document.

A project hierarchy works well as a tree.

---

# 📝 A powerful editor

At its core, Glyph can also function as a flexible writing environment.

Write documentation.

Write scenarios.

Create notes.

Build design documents.

Create nested lists.

Use headings and anchors.

Embed references to project objects.

Organize large documents into meaningful structures.

The goal is to combine the flexibility of a modern document editor with the structure of a database.

---

# 🔗 References and anchors

Instead of repeatedly writing the same information, Glyph can allow documents to reference existing objects.

For example:

```text
The player meets Arthur in Eldoria.

                ↓

The player meets [Arthur] in [Eldoria].
```

Those references can point directly to the corresponding project objects.

This creates a project where documentation isn't disconnected from the data it describes.

---

# 🏷️ Tags & filtering

Projects can contain thousands of objects.

Glyph therefore aims to provide powerful organization tools:

```text
Tags:
#main-character
#enemy
#boss
#quest
#unfinished
#important
#lore
```

Combined with filtering:

```text
Characters
WHERE faction = "Knights"
AND status = "alive"
AND tag = "#main-character"
```

The exact implementation may evolve, but the principle remains:

**The user should be able to organize information however they want.**

---

# 📊 Structured data

Not everything belongs in a text document.

Games contain enormous amounts of numerical and structured information.

For example:

| Item        | Damage | Price | Weight |
| ----------- | -----: | ----: | -----: |
| Iron Sword  |     25 |   120 |    3.2 |
| Steel Sword |     40 |   350 |    4.1 |
| Royal Sword |     75 |  1200 |    5.0 |

Glyph can provide structured tables for things such as:

* Item databases
* Enemy statistics
* Character attributes
* Economy
* Balancing
* Progression
* Crafting
* Resources
* Game parameters

---

# 📁 Project Files

Glyph can also evolve beyond documentation and structured information.

Projects may contain actual files:

```text
Project
│
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

The idea is to eventually provide a project-level file workspace where users can keep the assets and references necessary for their work.

---

# 🎬 Beyond documentation

One possible direction for Glyph is treating files and objects as resources that can participate in more advanced workflows.

Imagine importing several audio files into a project:

```text
Assets
│
├── Explosion.wav
├── Footstep.wav
├── Ambient.wav
└── Music.wav
```

And later using those resources in another visual workspace:

```text
0s       5s       10s      15s
│────────│────────│────────│

Music    ████████████████████

Ambient       ███████████████

Explosion             ██

Footstep         ██       ██
```

This opens the door to workflows that go far beyond simple documentation.

---

# 🧩 Modular Workspace

Glyph shouldn't necessarily dictate what the application must be.

Different people need different tools.

A game designer may need:

```text
Characters
Locations
Quests
Mechanics
World
Economy
```

A writer might need:

```text
Characters
Chapters
Scenes
Timeline
Notes
```

A programmer might need:

```text
Documentation
Specifications
Architecture
Tasks
References
```

A filmmaker might need:

```text
Characters
Scenes
Locations
Scripts
Assets
Timeline
```

Therefore, Glyph aims toward a **modular workspace** where users can enable the tools and views they actually need.

---

# 🧱 Core Philosophy

Glyph is built around several principles.

### Everything should be connected

Information shouldn't live in isolated silos.

### One object, multiple views

The same information should be usable as a document, card, table, graph, or another representation.

### Structure without rigidity

Users should be able to create their own organizational systems.

### Visual organization

Large amounts of information become easier to understand when they can be represented visually.

### One workspace

The fewer applications required to manage a project, the better.

### Extensibility

Glyph shouldn't be limited to game development.

---

# 🚧 Current Status

Glyph is currently in development.

The architecture and feature set are still evolving.

Some ideas described in this README represent the **long-term direction of the project rather than fully implemented features**.

The goal is to gradually transform Glyph from a project documentation tool into a complete **creative project hub**.

---

# 🛠️ Technology

Glyph is being built with a focus on cross-platform development.

### Core

* 🦀 **Rust**
* ⚡ **Tokio**
* 🗃️ File-based project storage
* 📦 JSON serialization
* 🧩 Generic storage abstractions

### Application

* 🖥️ **Tauri**
* 🌐 Web-based frontend
* 📱 Cross-platform architecture

The architecture is designed so that the core project logic can remain independent from the user interface.

---

# 🗺️ Roadmap

The roadmap is intentionally flexible because Glyph is still being shaped.

### Foundation

* [x] Basic project structure
* [x] Entity storage
* [x] Serialization
* [x] Generic `Storable` abstraction
* [ ] Project management
* [ ] Robust persistence layer

### Editor

* [ ] Rich text editor
* [ ] Markdown support
* [ ] Nested blocks
* [ ] Anchors
* [ ] Internal references
* [ ] Drag & drop
* [ ] Embeds

### Project Objects

* [ ] Custom object types
* [ ] Custom properties
* [ ] Tags
* [ ] Collections
* [ ] Object templates
* [ ] Object references
* [ ] Object relationships

### Visualization

* [ ] Tree view
* [ ] Graph view
* [ ] Card view
* [ ] Table view
* [ ] Timeline
* [ ] Visual canvas

### Search

* [ ] Global project search
* [ ] Filtering
* [ ] Tag-based search
* [ ] Search across documents and objects

### Files

* [ ] Project file explorer
* [ ] Asset management
* [ ] File previews
* [ ] Resource references

### Future

* [ ] Modular workspace
* [ ] Custom modules
* [ ] Plugins/extensions
* [ ] Collaboration
* [ ] Cloud synchronization
* [ ] Version history
* [ ] More specialized views

---

# 🌌 The Long-Term Vision

Glyph isn't trying to become simply another notes application.

The long-term goal is something closer to:

> **A visual operating system for creative projects.**

A place where you can start with a single idea:

```text
"I want to make a game about..."
```

and gradually turn that idea into:

```text
Idea
 │
 ├── World
 │    ├── Locations
 │    ├── Factions
 │    └── History
 │
 ├── Characters
 │    ├── Protagonist
 │    ├── Companions
 │    └── Enemies
 │
 ├── Gameplay
 │    ├── Combat
 │    ├── Progression
 │    └── Economy
 │
 ├── Story
 │    ├── Acts
 │    ├── Quests
 │    └── Dialogues
 │
 └── Assets
      ├── Art
      ├── Audio
      └── References
```

And every piece of that structure can reference and interact with every other piece.

**One project. One workspace. One connected system.**

---

# 🤝 Contributing

Glyph is an experimental project and its architecture is still evolving.

Contributions, ideas, feature proposals, bug reports, and architectural discussions are welcome.

Before implementing large features, opening an issue or discussion is recommended so the direction can be discussed first.

---

# 📜 License

License information will be added as the project matures.

---

<div align="center">

### **Glyph**

**Think. Connect. Create.**

*A workspace for turning ideas into worlds.*

</div>
