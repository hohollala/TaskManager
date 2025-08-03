# New Project Requirements Generation

Creates structured requirement documents by collecting project requirements through a series of core questions.

## Features
- Collects project requirements through 8 key questions
- Automatically generates 3 document files:
  - `docs/requirements.md`: Project requirements summary
  - `docs/designed.md`: UI/UX design guide
  - `docs/technical_spec.md`: Technical specification

## Question List
1. **Main Purpose**: Online shopping, To-do management, Social networking, etc.
2. **Essential Features**: User login, Data storage, Payment processing, Notifications, etc.
3. **Design Requirements**: Existing design files available, Start with simple basic design, Full custom design needed
4. **Server/API**: Existing API server available, New development needed, Use Firebase/Supabase, etc.
5. **External Services**: Social login, Payment gateway, Map API, Push notifications, etc.
6. **Platforms**: iOS only, Android only, Both, Web app included
7. **Tech Stack**: React Native, Flutter, Native development, Specific library usage/prohibition
8. **Other Requirements**: Additional requirements or constraints

## Usage
Provide detailed and specific answers to each question for more accurate requirement documents.

## Next Steps
Generated documents can be modified using the `plan` command. 