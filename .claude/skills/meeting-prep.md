# /meeting-prep - AI Sales Meeting Preparation

Generate comprehensive meeting prep materials with company research, talking points, and objection handlers.

## When to Use

Use this skill when you need to:
- Prepare for a discovery call
- Get ready for a product demo
- Prep for a closing meeting
- Research a prospect before any meeting

## Usage

```
/meeting-prep [company] [meeting-type]
```

**Meeting Types:**
- `discovery` - Problem/need focused questions
- `demo` - Feature mapping to pain points
- `closing` - Objection handling, urgency creation
- `qbr` - Quarterly business review

**Examples:**
```
/meeting-prep Acme Corp discovery
/meeting-prep TechStart demo
/meeting-prep Enterprise Co closing
```

Or just `/meeting-prep` for interactive mode.

## Research Components

### 1. Company Intelligence

- **Overview**: What they do, founding date, HQ location
- **Size**: Employee count, revenue estimates
- **Funding**: Recent rounds, investors, runway
- **Tech Stack**: Technologies they use (from job posts, builtwith)
- **Key People**: Decision makers, their backgrounds

### 2. Recent News & Signals

- Press releases (last 90 days)
- Product launches
- Hiring trends (growing/shrinking teams)
- Executive changes
- Partnership announcements
- Social media activity

### 3. Competitor Analysis

- Who they compete with
- How they position vs competitors
- Recent competitive wins/losses
- Market positioning

### 4. Pain Point Hypotheses

Based on:
- Company size/stage
- Industry challenges
- Tech stack gaps
- Hiring patterns
- Public complaints/reviews

## Meeting-Type Specific Output

### Discovery Meeting

```markdown
## Discovery Prep: [Company]

### Background
[Company summary]

### Hypothesis
We believe [Company] is experiencing [pain point] because [evidence].

### Discovery Questions
1. [Open-ended question about their current state]
2. [Question about specific pain point]
3. [Question about impact/cost of problem]
4. [Question about decision process]
5. [Question about timeline]

### BANT Qualification
- Budget: [What to uncover]
- Authority: [Who to identify]
- Need: [What to validate]
- Timeline: [What to establish]

### Red Flags to Watch
- [Warning sign 1]
- [Warning sign 2]
```

### Demo Meeting

```markdown
## Demo Prep: [Company]

### Their Priorities (from discovery)
1. [Priority 1] → Show: [Feature/capability]
2. [Priority 2] → Show: [Feature/capability]
3. [Priority 3] → Show: [Feature/capability]

### Demo Flow
1. [Opening - reference their pain]
2. [Feature 1 - tied to priority]
3. [Feature 2 - tied to priority]
4. [Integration/workflow]
5. [ROI/value summary]

### Questions to Ask During Demo
- "Does this address [specific need they mentioned]?"
- "How does this compare to your current process?"
- "Who else would need to see this?"

### Anticipated Objections
| Objection | Response |
|-----------|----------|
| [Objection 1] | [Response] |
| [Objection 2] | [Response] |
```

### Closing Meeting

```markdown
## Closing Prep: [Company]

### Deal Summary
- Stage: [Current stage]
- Value: [Deal size]
- Timeline: [Expected close]
- Decision Makers: [Names/roles]

### Open Items
- [ ] [Item 1]
- [ ] [Item 2]

### Likely Objections
| Objection | Response | Evidence |
|-----------|----------|----------|
| [Price] | [Value justification] | [ROI calc] |
| [Timing] | [Urgency driver] | [Cost of delay] |
| [Competition] | [Differentiation] | [Proof point] |

### Closing Techniques
1. [Assumptive close approach]
2. [Timeline urgency]
3. [Executive sponsor leverage]

### Negotiation Boundaries
- Walk-away: [Minimum acceptable]
- Target: [Ideal outcome]
- Concessions available: [What we can give]
```

## Output Includes

- Company research brief
- Meeting agenda template
- Talking points
- Questions to ask
- Objection handlers
- Follow-up email template
- CRM notes template
