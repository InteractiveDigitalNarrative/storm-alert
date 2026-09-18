// Player-data rules in one place. Screens never read this directly — they call
// the data layer (./index.js), which enforces everything here. See
// PLAYBOOK-user-data.md for the reasoning behind each value.

export const DATA_CONFIG = {
  // Master switch. false = nothing is sent to any backend; the local adapter
  // (device only) is used regardless of `adapter`. Stays false until ethics
  // approval.
  collectionEnabled: false,

  // Which backend adapter to use once collection is enabled: 'local' | 'supabase'.
  adapter: 'local',

  // Bump when the consent text changes → players are asked again; answers given
  // under older versions stay valid for the data collected under them.
  consentVersion: 'consent-v0.1-draft',

  login: {
    allowGuests: true,          // play + share data without an account
    accountMinAge: 18,          // under this: guest only, no email
    methods: ['magic_link'],    // emailed one-click login link
  },

  retention: {
    maxDays: 730,               // hard cap (2 years); study end date may be sooner
  },

  // Allow-lists: only these fields ever leave a screen. Anything else (e.g. the
  // relative's free-text name) is dropped by the data layer.
  fields: {
    profile: ['age', 'gender', 'prep_before'],
    household: [
      'family_size', 'has_elderly', 'has_children', 'children_count',
      'home_building', 'home_heating',
    ],
    result: [
      'prep_water', 'prep_food', 'prep_heat', 'prep_light', 'prep_info',
      'prep_medication', 'total_prep', 'call_score', 'dialed_number',
      'call_outcome', 'ending_type', 'prep_after',
    ],
  },

  // Event types the logger accepts (step 5 fills in the real list).
  events: ['screen_view', 'choice'],

  // Longest string value accepted in any saved field — categories only, never
  // free text.
  maxValueLength: 32,
};
