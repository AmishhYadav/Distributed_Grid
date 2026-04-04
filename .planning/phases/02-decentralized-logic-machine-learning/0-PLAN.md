---
wave: 0
depends_on: []
files_modified: ["requirements.txt"]
autonomous: true
---

# 0. Infrastructure

## Objective
Ensure ML dependencies are installed.

## Tasks

### 0.1 Setup dependencies
<read_first>None</read_first>
<action>
Create `requirements.txt` containing `scikit-learn` and `numpy`.
Run `pip install -r requirements.txt`.
</action>
<acceptance_criteria>
- `requirements.txt` contains scikit-learn.
</acceptance_criteria>
