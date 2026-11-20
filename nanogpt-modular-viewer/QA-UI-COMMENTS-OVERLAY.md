# nanoGPT Modular Viewer — Comments Overlay QA

## User-approved behavior (Prompt 065)

The **Comments** button is now an *independent on/off toggle*, not an exclusive hierarchy category.

- Select **Class** (red), **Method** (blue), **Code Block** (orange), **Nested Block** (yellow), **Lines** (green), **File**, **Directory**, or **Module**, then toggle **Comments** ON.
- Standalone Python `#` comments and valid docstrings **within the current category's colored membership** become pink `#DB2777`. Other member lines, including real blanks, keep their currently selected hierarchy color.
- Lines outside Class / Method / Block / Nested remain neutral `#232323` even when the Comments overlay is ON.
- For Lines, File, Directory, and Module, every displayed original line is a base-category member; only their documented/comment lines turn pink when Comments is ON.
- Turning Comments OFF restores the original category coloring in place. Selecting another primary category does **not** silently disable Comments.
- Source lines with an inline trailing `#` after executable code are **not** comment-only lines; ordinary triple-quoted variable strings are not automatically docstrings.
- Both the selected category button and the Comments toggle show an active outline simultaneously, with filled colors and unchanged control dimensions.

Source-row display remains **filename chip → short STM ID chip → original code**. The source/manifest, complete historical STM IDs, original comment/docstring kinds, and immutable source text were not altered. Category dividers remain based on the selected base structural group, not the Comments overlay.

## Implementation commits

- [`c31bed7`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/c31bed795239800888ec3f47104caeda080fc7ac) — add a composed Comments-overlay chip palette, preserving neutral out-of-scope chips.
- [`c1b0f00`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/c1b0f00c1b94d5b194a09478b5a8c88dfba9fbd8) — keep independent category and `commentsOverlay` state; update both button pressed states.
- [`6a20111`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/6a20111cb2cfbb12962436be3b8e8628fae2c429) — repaint mounted virtualized rows when Comments changes, retaining row heights and page scroll.
- [`b79afdc`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/b79afdc52bb5ec243420f9c666127fa4a7fa3ff0) — accessible Comments-toggle button label and compact hint.
- [`3110ecc`](https://github.com/sabareeshrao/Project-Rebuild-Version-2/commit/3110ecc68ad6c7ed1c30fa9353bacaaa57de29e3) — retain every selected scope's full identity on the accessible description of comment rows, not just a group's first source row.

## Verification

**41 passing controlled tests**, using the saved GitHub implementation files and existing real source records:

- **33 renderer/data/virtualizer tests:** parsed three JavaScript modules; tested OFF/ON colors for Class, Method, Code Block, Nested Block, Lines, File, Directory, and Module; tested standalone comments, multi-line documentation, original blank lines, inline trailing comments, and out-of-scope neutral chips.
- Confirmed unchanged original source kind records and full `STM-048-FIL-001-model.py` identity, plus preserved accessible parent `NBL-001` metadata.
- Confirmed no second visible metadata line appears inside an STM chip; turning overlay ON/OFF recolors the same chip object.
- Mocked DOM/source virtualizer retained mounted row identities, measured-height index, request version, and simulated page scroll across overlay changes and primary category changes.
- **8 toolbar interaction tests:** verified default Lines-only state, Class + Comments simultaneous selection, Method + Comments persistence, switching Comments off without losing Method, Lines + Comments, All commits reset preserving overlay, and correct viewer configuration snapshots.

**Verification boundary:** This is a targeted source-based and mocked-browser-DOM regression pass. It is **not** a real Android Chrome or desktop browser screenshot test. GitHub Pages deployment and high-line-count performance benchmarks have not been independently verified.

## Future regression rule

Comments is a toggle layered on top of the selected category; **never make it an exclusive mode again** unless the user explicitly changes this decision. Overlay changes must not rebuild virtualized rows or change physical source records, IDs, indentation, documentation classification or scroll position.
