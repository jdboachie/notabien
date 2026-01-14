author: Jude Boachie
last edited: 14/01/2026

# Categories Implementation Plan

## 1. Data Layer (`src/storage.js`)
- [ ] Define `CATEGORIES_KEY` ("notabien:categories:v1").
- [ ] Implement `loadCategories()` and `saveCategories(list)`.
- [ ] Update Note schema: Add `category` field (string | null).

## 2. State & Signals (`src/home.js`)
- [ ] Add `categories` signal to track available categories.
- [ ] Add `selectedCategory` signal for filtering state.
- [ ] Load categories on app init.

## 3. UI Components (`src/templates.js`)
- [ ] **Sidebar**:
    - Create `sidebarCategoryListTemplate`.
    - Add "Categories" section with "New Category" button.
    - Render categories with note counts.
- [ ] **Editor**:
    - Update `createEditorTemplate`: Add `<select>` dropdown for category assignment in the note header.
- [ ] **Note List**:
    - Update `createNoteListItemTemplate`: Render category badge near tags.
- [ ] **Modals**:
    - Add `createCategoryModalTemplate`.

## 4. Logic (`src/home.js`)
- [ ] **Category Management**:
    - Implement `handleCreateCategory`.
    - Implement `handleDeleteCategory`.
- [ ] **Filtering**:
    - Update filtering logic to intersect: `Search Query` + `Tab (All/Archived)` + `Selected Tag` + `Selected Category`.
- [ ] **Persistence**:
    - Update `flushCurrentEditorDraft` to include `category` value in note payload.

## 5. Styling
- [ ] Add styles for Category badges (distinct from Tags).
- [ ] Style sidebar category items and active states.