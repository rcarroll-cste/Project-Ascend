// NPC Avatar definitions for Chatter characters
// Uses the same styling system as player avatars

export interface NPCAvatarDefinition {
  id: string;
  name: string;
  skinTone: string;
  hairColor: string;
  hairStyle: 'short' | 'medium' | 'long' | 'bald' | 'curly' | 'ponytail';
  accessory: 'glasses' | 'headset' | 'none' | 'earrings';
  outfit: string;
  outfitColor: string;
  expression: 'friendly' | 'confident' | 'thoughtful' | 'warm' | 'stern';
}

export const NPC_AVATARS: Record<string, NPCAvatarDefinition> = {
  // Director Vane - CEO, authoritative but approachable
  'contact_vane': {
    id: 'contact_vane',
    name: 'Director Vane',
    skinTone: '#FFDBB4',
    hairColor: '#4A4A4A', // Salt and pepper gray
    hairStyle: 'short',
    accessory: 'none',
    outfit: 'suit',
    outfitColor: '#1E293B', // Dark navy suit
    expression: 'confident',
  },
  'Director Vane': {
    id: 'Director Vane',
    name: 'Director Vane',
    skinTone: '#FFDBB4',
    hairColor: '#4A4A4A',
    hairStyle: 'short',
    accessory: 'none',
    outfit: 'suit',
    outfitColor: '#1E293B',
    expression: 'confident',
  },

  // Marcus - Head of Legacy Systems, older, skeptical
  'contact_marcus': {
    id: 'contact_marcus',
    name: 'Marcus',
    skinTone: '#E8BEAC',
    hairColor: '#6B7280', // Gray
    hairStyle: 'bald',
    accessory: 'glasses',
    outfit: 'cardigan',
    outfitColor: '#78350F', // Brown cardigan
    expression: 'stern',
  },
  'Marcus': {
    id: 'Marcus',
    name: 'Marcus',
    skinTone: '#E8BEAC',
    hairColor: '#6B7280',
    hairStyle: 'bald',
    accessory: 'glasses',
    outfit: 'cardigan',
    outfitColor: '#78350F',
    expression: 'stern',
  },

  // Sarah - Data Privacy Officer, professional, detail-oriented
  'contact_sarah': {
    id: 'contact_sarah',
    name: 'Sarah',
    skinTone: '#8D5524',
    hairColor: '#1a1a1a',
    hairStyle: 'long',
    accessory: 'earrings',
    outfit: 'blazer',
    outfitColor: '#7C3AED', // Purple blazer
    expression: 'thoughtful',
  },
  'Sarah': {
    id: 'Sarah',
    name: 'Sarah',
    skinTone: '#8D5524',
    hairColor: '#1a1a1a',
    hairStyle: 'long',
    accessory: 'earrings',
    outfit: 'blazer',
    outfitColor: '#7C3AED',
    expression: 'thoughtful',
  },

  // Team Channel - generic team avatar
  'contact_team': {
    id: 'contact_team',
    name: 'Team Channel',
    skinTone: '#C68642',
    hairColor: '#4A3728',
    hairStyle: 'medium',
    accessory: 'headset',
    outfit: 'polo',
    outfitColor: '#0EA5E9', // Blue polo
    expression: 'friendly',
  },
};

// Helper to get NPC avatar by contact ID or speaker name
export function getNPCAvatar(identifier: string): NPCAvatarDefinition | null {
  return NPC_AVATARS[identifier] || null;
}
