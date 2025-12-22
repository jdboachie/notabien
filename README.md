`Amalitech Project`

# Notabien - Note Taking Web App

## Q

Why did we use a setTimeout to updateSaveState?

To defer execution until after the form reset finishes. reset fires before the browser clears input values. Without setTimeout, updateSaveState() reads stale values and computes the wrong disabled state. The zero-delay timeout queues the check to the next task, after the DOM inputs have been reset.