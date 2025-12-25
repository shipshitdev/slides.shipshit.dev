# /pitch - Generate Pitch Deck Content

Generate tailored pitch content for your startup based on your target audience.

## Usage

Run `/pitch` and I'll ask you about:
1. **Project Name** - What's your startup/product called?
2. **Description** - Brief description of what you do
3. **Target Audience** - Who is this pitch for?
   - Cold Leads (hook-focused intro)
   - Potential Customers (problem/solution)
   - Investors (market/traction/team)

## Output

I'll generate structured slide content in JSON format that can be imported directly into your deck:

```json
{
  "slides": [
    { "id": "1", "type": "title", "data": { "title": "...", "subtitle": "..." } },
    { "id": "2", "type": "content", "data": { "title": "...", "bullets": [...] } },
    ...
  ]
}
```

## Example Prompts

- `/pitch` - Interactive mode, I'll ask questions
- `/pitch Acme Corp - B2B SaaS for inventory management - investors` - Quick generation
- `/pitch my-startup customers` - Generate customer-focused pitch using project context

## Slide Types Generated

### For Cold Leads
1. Title slide with hook
2. Value proposition (1-2 bullets)
3. Call to action

### For Customers
1. Title slide
2. The Problem
3. Our Solution
4. Key Features
5. Results/Testimonials
6. Pricing/CTA

### For Investors
1. Title slide
2. Problem & Market Opportunity
3. Solution Overview
4. Market Size (TAM/SAM/SOM)
5. Business Model
6. Traction & Metrics
7. Competition
8. Team
9. The Ask

---

## Instructions for Claude

When the user invokes `/pitch`, follow this process:

1. **Gather Information**
   If not provided in the command, ask:
   - What is your startup/product name?
   - Brief description (1-2 sentences)
   - Target audience (cold_leads, customers, or investors)
   - Any specific metrics, achievements, or team members to highlight

2. **Generate Content**
   Based on the audience type, generate appropriate slides:

   **Cold Leads Template:**
   ```json
   {
     "slides": [
       {
         "id": "1",
         "type": "title",
         "data": {
           "title": "[Company Name]",
           "subtitle": "[Compelling one-liner hook]"
         }
       },
       {
         "id": "2",
         "type": "content",
         "data": {
           "title": "Why [Company]?",
           "bullets": [
             "[Unique value prop #1]",
             "[Unique value prop #2]"
           ]
         }
       },
       {
         "id": "3",
         "type": "cta",
         "data": {
           "title": "Let's Talk",
           "description": "[Brief call to action]",
           "buttonText": "Schedule a Call"
         }
       }
     ]
   }
   ```

   **Customers Template:**
   ```json
   {
     "slides": [
       {
         "id": "1",
         "type": "title",
         "data": { "title": "[Company Name]", "subtitle": "[Tagline]" }
       },
       {
         "id": "2",
         "type": "content",
         "data": {
           "title": "The Problem",
           "bullets": ["[Pain point 1]", "[Pain point 2]", "[Pain point 3]"]
         }
       },
       {
         "id": "3",
         "type": "content",
         "data": {
           "title": "Our Solution",
           "bullets": ["[Solution aspect 1]", "[Solution aspect 2]"]
         }
       },
       {
         "id": "4",
         "type": "content",
         "data": {
           "title": "Key Features",
           "bullets": ["[Feature 1]", "[Feature 2]", "[Feature 3]"]
         }
       },
       {
         "id": "5",
         "type": "stats",
         "data": {
           "title": "Results",
           "stats": [
             { "value": "[X]%", "label": "[Metric 1]" },
             { "value": "[Y]x", "label": "[Metric 2]" }
           ]
         }
       },
       {
         "id": "6",
         "type": "cta",
         "data": {
           "title": "Get Started Today",
           "buttonText": "Start Free Trial"
         }
       }
     ]
   }
   ```

   **Investors Template:**
   ```json
   {
     "slides": [
       {
         "id": "1",
         "type": "title",
         "data": { "title": "[Company Name]", "subtitle": "[One-liner]" }
       },
       {
         "id": "2",
         "type": "content",
         "data": {
           "title": "The Problem",
           "bullets": ["[Market problem]", "[Why now?]"]
         }
       },
       {
         "id": "3",
         "type": "content",
         "data": {
           "title": "Our Solution",
           "bullets": ["[Product description]", "[Key differentiator]"]
         }
       },
       {
         "id": "4",
         "type": "stats",
         "data": {
           "title": "Market Opportunity",
           "stats": [
             { "value": "$[X]B", "label": "TAM" },
             { "value": "$[Y]M", "label": "SAM" },
             { "value": "$[Z]M", "label": "SOM" }
           ]
         }
       },
       {
         "id": "5",
         "type": "content",
         "data": {
           "title": "Business Model",
           "bullets": ["[Revenue model]", "[Pricing strategy]"]
         }
       },
       {
         "id": "6",
         "type": "stats",
         "data": {
           "title": "Traction",
           "stats": [
             { "value": "[X]", "label": "Users" },
             { "value": "$[Y]", "label": "MRR" },
             { "value": "[Z]%", "label": "MoM Growth" }
           ]
         }
       },
       {
         "id": "7",
         "type": "content",
         "data": {
           "title": "Competition",
           "bullets": ["[Competitor 1] - [weakness]", "[Our advantage]"]
         }
       },
       {
         "id": "8",
         "type": "team",
         "data": {
           "title": "Team",
           "members": [
             { "name": "[Founder 1]", "role": "CEO" },
             { "name": "[Founder 2]", "role": "CTO" }
           ]
         }
       },
       {
         "id": "9",
         "type": "cta",
         "data": {
           "title": "The Ask",
           "description": "Raising $[X] to [goal]",
           "buttonText": "Let's Talk"
         }
       }
     ]
   }
   ```

3. **Output Format**
   - Always output the slides as a JSON code block
   - Explain what each slide covers
   - Suggest customizations based on the specific startup

4. **Follow-up**
   Ask if they want to:
   - Adjust any specific slides
   - Add more details to certain sections
   - Generate content for a different audience
