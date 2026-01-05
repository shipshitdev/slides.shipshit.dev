# /proposal - AI Sales Proposal Generator

Generate custom proposal decks from discovery notes with scope, timeline, and investment options.

## When to Use

Use this skill when you need to:
- Create a proposal after discovery calls
- Generate a custom deck for a specific prospect
- Build a scope of work document
- Prepare investment options and pricing

## Usage

```
/proposal [company] [scope-summary]
```

**Examples:**
```
/proposal Acme Corp "Enterprise implementation with API integration"
/proposal TechStart "Starter package with onboarding"
```

Or just `/proposal` for interactive mode.

## Input Required

- Company name
- Discovery notes or summary
- Their priorities (from discovery)
- Budget signals (if known)
- Timeline requirements
- Key stakeholders

## Proposal Structure

### Slide 1: Title
```
[Their Company] + [Your Company]
A Proposal for [Solving Their Problem]
[Date]
```

### Slide 2: Understanding Your Needs
```markdown
Based on our conversations, we understand:

**Current Challenges:**
• [Challenge 1 from discovery]
• [Challenge 2 from discovery]
• [Challenge 3 from discovery]

**Desired Outcomes:**
• [Goal 1 they expressed]
• [Goal 2 they expressed]
• [Goal 3 they expressed]

**Success Metrics:**
• [KPI they care about]
• [KPI they care about]
```

### Slide 3: Proposed Solution
```markdown
**How We'll Help:**

[Solution overview tied to their specific needs]

**Key Capabilities:**
• [Feature 1] → Addresses [their challenge]
• [Feature 2] → Enables [their goal]
• [Feature 3] → Delivers [their outcome]

**Why This Approach:**
[1-2 sentences on why this is right for them specifically]
```

### Slide 4: Scope of Work
```markdown
**Phase 1: [Name]** (Weeks 1-X)
• [Deliverable 1]
• [Deliverable 2]
• [Milestone]

**Phase 2: [Name]** (Weeks X-Y)
• [Deliverable 3]
• [Deliverable 4]
• [Milestone]

**Phase 3: [Name]** (Weeks Y-Z)
• [Deliverable 5]
• [Deliverable 6]
• [Milestone]

**Ongoing:**
• [Support/maintenance items]
```

### Slide 5: Timeline
```markdown
| Phase | Duration | Key Milestones |
|-------|----------|----------------|
| Kickoff | Week 1 | Team alignment, access setup |
| Phase 1 | Weeks 2-4 | [Milestone] |
| Phase 2 | Weeks 5-8 | [Milestone] |
| Phase 3 | Weeks 9-12 | [Milestone] |
| Go-Live | Week 12 | Full deployment |
```

### Slide 6: Investment Options
```markdown
## Option A: [Name] - $X,XXX
• [Included item 1]
• [Included item 2]
• [Included item 3]
Best for: [Use case]

## Option B: [Name] - $XX,XXX (Recommended)
• Everything in Option A, plus:
• [Additional item 1]
• [Additional item 2]
Best for: [Use case]

## Option C: [Name] - $XXX,XXX
• Everything in Option B, plus:
• [Premium item 1]
• [Premium item 2]
Best for: [Use case]
```

### Slide 7: Why Us
```markdown
**Relevant Experience:**
• [Similar customer/case study]
• [Relevant expertise]
• [Track record metric]

**What Sets Us Apart:**
• [Differentiator 1]
• [Differentiator 2]
• [Differentiator 3]

**Your Success Team:**
• [Name] - [Role] - [Relevant experience]
• [Name] - [Role] - [Relevant experience]
```

### Slide 8: Next Steps
```markdown
**To Move Forward:**

1. ☐ Review proposal and confirm scope
2. ☐ Align on investment option
3. ☐ Execute agreement
4. ☐ Schedule kickoff (target: [date])

**Your Dedicated Contact:**
[Name]
[Email]
[Phone/Calendar link]
```

## Output Formats

### 1. Deckflow JSON (for import)
```json
{
  "title": "Proposal: [Company]",
  "slides": [
    {
      "type": "title",
      "content": {...}
    },
    {
      "type": "content",
      "content": {...}
    }
  ],
  "theme": "professional",
  "branding": {...}
}
```

### 2. Markdown Document
Full proposal as markdown for review/editing.

### 3. Google Slides/PowerPoint
Export-ready format with suggested design notes.

## Customization Options

- **Tone**: Formal / Consultative / Partner-focused
- **Detail Level**: Executive summary / Detailed / Technical
- **Pricing Display**: Options / Single price / Custom quote
- **Timeline**: Fixed / Flexible / Phased

## Best Practices Applied

- Mirror their language from discovery
- Lead with their priorities, not your features
- Show 3 options (anchor high, recommend middle)
- Include social proof relevant to their industry
- Clear, specific next steps with dates
- Named contact for accountability
