# /analyze-deck - AI Pitch Deck Analyzer

Comprehensive pitch deck analysis with fundability scoring and actionable recommendations.

## When to Use

Use this skill when you need to:
- Evaluate a pitch deck before sending to investors
- Identify weaknesses and red flags
- Get slide-by-slide improvement suggestions
- Benchmark against successful deck patterns

## Usage

```
/analyze-deck
```

Then provide the deck (upload PDF, paste slides, or share link).

## Analysis Framework

### 1. Overall Fundability Score (0-100)

Based on weighted criteria:
- **Team (25%)**: Founder-market fit, relevant experience, completeness
- **Market (20%)**: TAM/SAM/SOM clarity, market timing, competitive landscape
- **Traction (20%)**: Revenue, growth rate, user metrics, partnerships
- **Product (20%)**: Problem clarity, solution fit, differentiation, demo quality
- **Financials (15%)**: Ask clarity, use of funds, projections, runway

### 2. Slide-by-Slide Analysis

For each slide:
- What works well
- What needs improvement
- Specific suggestions
- Design/visual feedback

### 3. Red Flags

Common issues that concern investors:
- Unrealistic TAM claims
- Missing competition slide
- No clear business model
- Vague traction metrics
- Team gaps not addressed
- Ask amount disconnected from use of funds

### 4. Strengths

What will resonate with investors:
- Strong narrative
- Clear differentiation
- Impressive traction
- Credible team
- Smart GTM strategy

### 5. Recommendations

Prioritized action items:
1. Critical fixes (blocking issues)
2. High-impact improvements
3. Nice-to-haves

## Output Format

```markdown
## Pitch Deck Analysis: [Company Name]

### Overall Score: XX/100

| Category | Score | Status |
|----------|-------|--------|
| Team | XX/25 | 🟢/🟡/🔴 |
| Market | XX/20 | 🟢/🟡/🔴 |
| Traction | XX/20 | 🟢/🟡/🔴 |
| Product | XX/20 | 🟢/🟡/🔴 |
| Financials | XX/15 | 🟢/🟡/🔴 |

### Executive Summary
[2-3 sentence overview]

### Slide-by-Slide Review
[Detailed analysis]

### Red Flags
[List of concerns]

### Strengths
[What works well]

### Action Items
[Prioritized recommendations]
```

## Example Questions to Address

- Is the problem clearly articulated in the first 30 seconds?
- Does the solution slide show, not tell?
- Are metrics specific and verifiable?
- Is the competitive positioning honest?
- Does the team slide address founder-market fit?
- Is the ask reasonable for the stage?

## Comparison Benchmarks

Reference patterns from successful decks:
- Airbnb (marketplace narrative)
- Dropbox (demo-driven)
- Buffer (transparent metrics)
- Front (enterprise SaaS)
- Notion (product-led growth)
