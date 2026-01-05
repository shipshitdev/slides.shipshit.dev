# /follow-up - AI Meeting Follow-Up Writer

Generate personalized follow-up emails from meeting notes with action items and next steps.

## When to Use

Use this skill when you need to:
- Write a follow-up email after any meeting
- Extract action items from meeting notes
- Create CRM update summaries
- Plan next steps with timeline

## Usage

```
/follow-up
```

Then paste your meeting notes, transcript, or summary.

Or provide notes directly:
```
/follow-up [paste notes here]
```

## Input Formats Accepted

- Raw meeting notes
- Zoom/Teams transcript
- Voice memo transcription
- Bullet point summary
- Freeform text

## Output Components

### 1. Follow-Up Email

Personalized email that:
- References specific discussion points
- Summarizes key takeaways
- Lists agreed action items
- Proposes clear next steps
- Creates appropriate urgency

**Email Variants:**
- **Immediate** (same day) - Warm, momentum-focused
- **Next day** - Professional recap
- **Multi-stakeholder** - CC-appropriate summary

### 2. Action Items

Extracted and organized:

```markdown
## Your Action Items
- [ ] [Task] - Due: [Date]
- [ ] [Task] - Due: [Date]

## Their Action Items
- [ ] [Task] - Owner: [Name] - Due: [Date]
- [ ] [Task] - Owner: [Name] - Due: [Date]

## Joint Items
- [ ] [Task] - Schedule by: [Date]
```

### 3. CRM Update

Structured for copy/paste:

```markdown
## CRM Update

**Meeting Type:** [Discovery/Demo/Closing/Check-in]
**Attendees:** [Names]
**Date:** [Date]

**Summary:**
[2-3 sentence overview]

**Key Outcomes:**
- [Outcome 1]
- [Outcome 2]

**Next Steps:**
- [Step 1] - [Date]
- [Step 2] - [Date]

**Deal Updates:**
- Stage: [Current → New]
- Close Date: [Updated date]
- Amount: [Any changes]

**Notes:**
[Additional context]
```

### 4. Next Steps Timeline

```markdown
## Next Steps

| Date | Action | Owner | Status |
|------|--------|-------|--------|
| [Today] | Send follow-up email | You | Pending |
| [+2 days] | [Action from meeting] | [Owner] | Pending |
| [+1 week] | Follow-up if no response | You | Scheduled |
| [Target date] | [Key milestone] | Joint | Target |
```

### 5. Risk Assessment

```markdown
## Deal Health Check

**Momentum:** 🟢/🟡/🔴
**Champion Strength:** 🟢/🟡/🔴
**Competitive Risk:** 🟢/🟡/🔴
**Timeline Risk:** 🟢/🟡/🔴

**Watch Items:**
- [Concern 1]
- [Concern 2]

**Mitigation:**
- [Action to address concern]
```

## Email Templates

### Post-Discovery
```
Subject: Great connecting - [Key topic] next steps

Hi [Name],

Thanks for the conversation today about [specific topic they care about].

Key takeaways from our discussion:
• [Point 1 - their priority]
• [Point 2 - their challenge]
• [Point 3 - potential solution fit]

As discussed, the next step is [specific action]. I'll [your action] by [date].

[Soft CTA - question or proposed meeting]

Best,
[Your name]
```

### Post-Demo
```
Subject: [Company] demo follow-up + [resource]

Hi [Name],

Great demo today! It was clear that [specific priority] is top of mind for your team.

Based on our discussion, I'm attaching:
• [Resource 1 - addresses their priority]
• [Resource 2 - answers their question]

Quick recap of what resonated:
• [Feature] → [Their use case]
• [Capability] → [Their goal]

Next steps we discussed:
1. [Their action]
2. [Your action]
3. [Joint action - meeting with others]

Does [date/time] work for [next meeting type]?

Best,
[Your name]
```

### Post-Closing Attempt
```
Subject: [Company] partnership - next steps

Hi [Name],

Thank you for the productive conversation about moving forward together.

To summarize where we landed:
• [Agreement point 1]
• [Agreement point 2]
• [Open item if any]

Action items:
• You: [Their commitment]
• Me: [Your commitment]

I'll send over [document/contract/proposal] by [date]. Looking forward to making this official!

Best,
[Your name]
```

## Tone Calibration

The follow-up adjusts tone based on:
- Meeting warmth level
- Deal stage
- Stakeholder seniority
- Company culture signals
- Urgency level
