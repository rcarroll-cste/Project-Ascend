import React from 'react';
import { AvatarDefinition } from '../../features/playerSlice';
import { NPCAvatarDefinition } from '../../data/npcAvatars';

// Union type to support both player and NPC avatars
type AvatarData = AvatarDefinition | NPCAvatarDefinition;

interface CartoonAvatarProps {
  avatar: AvatarData;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const CartoonAvatar: React.FC<CartoonAvatarProps> = ({
  avatar,
  size = 'md',
  className = ''
}) => {
  const sizeMap = {
    sm: 48,
    md: 80,
    lg: 120,
    xl: 160,
  };

  const pixelSize = sizeMap[size];

  // Hair path based on style
  const getHairPath = () => {
    switch (avatar.hairStyle) {
      case 'short':
        return (
          <path
            d="M30 28 C30 18, 40 12, 50 12 C60 12, 70 18, 70 28 L70 35 C70 32, 65 28, 50 28 C35 28, 30 32, 30 35 Z"
            fill={avatar.hairColor}
          />
        );
      case 'medium':
        return (
          <path
            d="M28 32 C28 16, 38 10, 50 10 C62 10, 72 16, 72 32 L72 42 C72 38, 65 32, 50 32 C35 32, 28 38, 28 42 Z M72 35 C74 40, 75 48, 73 55 L70 50 Z M28 35 C26 40, 25 48, 27 55 L30 50 Z"
            fill={avatar.hairColor}
          />
        );
      case 'long':
        return (
          <path
            d="M25 35 C25 15, 37 8, 50 8 C63 8, 75 15, 75 35 L75 70 C75 75, 72 78, 68 76 L68 50 C68 45, 60 40, 50 40 C40 40, 32 45, 32 50 L32 76 C28 78, 25 75, 25 70 Z"
            fill={avatar.hairColor}
          />
        );
      case 'curly':
        return (
          <>
            <ellipse cx="35" cy="25" rx="8" ry="7" fill={avatar.hairColor} />
            <ellipse cx="50" cy="20" rx="9" ry="8" fill={avatar.hairColor} />
            <ellipse cx="65" cy="25" rx="8" ry="7" fill={avatar.hairColor} />
            <ellipse cx="30" cy="35" rx="6" ry="6" fill={avatar.hairColor} />
            <ellipse cx="70" cy="35" rx="6" ry="6" fill={avatar.hairColor} />
            <ellipse cx="42" cy="28" rx="7" ry="6" fill={avatar.hairColor} />
            <ellipse cx="58" cy="28" rx="7" ry="6" fill={avatar.hairColor} />
          </>
        );
      case 'ponytail':
        return (
          <>
            <path
              d="M30 30 C30 18, 40 12, 50 12 C60 12, 70 18, 70 30 L70 38 C70 34, 62 30, 50 30 C38 30, 30 34, 30 38 Z"
              fill={avatar.hairColor}
            />
            <ellipse cx="70" cy="45" rx="8" ry="15" fill={avatar.hairColor} />
          </>
        );
      case 'bald':
      default:
        return null;
    }
  };

  // Accessory rendering
  const getAccessory = () => {
    switch (avatar.accessory) {
      case 'glasses':
        return (
          <g>
            <rect x="33" y="42" width="14" height="10" rx="3" fill="none" stroke="#374151" strokeWidth="2" />
            <rect x="53" y="42" width="14" height="10" rx="3" fill="none" stroke="#374151" strokeWidth="2" />
            <path d="M47 47 L53 47" stroke="#374151" strokeWidth="2" />
            <path d="M33 47 L28 45" stroke="#374151" strokeWidth="2" />
            <path d="M67 47 L72 45" stroke="#374151" strokeWidth="2" />
          </g>
        );
      case 'headset':
        return (
          <g>
            <path
              d="M25 45 C22 45, 20 50, 20 55 C20 60, 22 65, 25 65"
              fill="none"
              stroke="#1F2937"
              strokeWidth="3"
            />
            <rect x="18" y="50" width="8" height="12" rx="2" fill="#374151" />
            <path
              d="M22 62 L22 72 C22 75, 25 78, 30 78 L35 78"
              fill="none"
              stroke="#374151"
              strokeWidth="2"
            />
            <ellipse cx="36" cy="78" rx="4" ry="3" fill="#1F2937" />
            <path
              d="M20 40 C20 25, 35 15, 50 15 C65 15, 80 25, 80 40"
              fill="none"
              stroke="#1F2937"
              strokeWidth="4"
            />
          </g>
        );
      case 'earrings':
        return (
          <g>
            <circle cx="28" cy="55" r="3" fill="#F59E0B" />
            <circle cx="72" cy="55" r="3" fill="#F59E0B" />
          </g>
        );
      default:
        return null;
    }
  };

  // Outfit rendering
  const getOutfit = () => {
    const baseOutfit = (
      <path
        d="M25 85 C25 75, 35 70, 50 70 C65 70, 75 75, 75 85 L75 100 L25 100 Z"
        fill={avatar.outfitColor}
      />
    );

    switch (avatar.outfit) {
      case 'blazer':
        return (
          <g>
            {baseOutfit}
            <path
              d="M40 70 L50 78 L60 70"
              fill="white"
              stroke="white"
              strokeWidth="2"
            />
            <path
              d="M35 75 L35 100"
              fill="none"
              stroke={avatar.outfitColor}
              strokeWidth="1"
              opacity="0.3"
            />
            <path
              d="M65 75 L65 100"
              fill="none"
              stroke={avatar.outfitColor}
              strokeWidth="1"
              opacity="0.3"
            />
          </g>
        );
      case 'suit':
        return (
          <g>
            {baseOutfit}
            <path
              d="M42 70 L50 82 L58 70"
              fill="white"
            />
            <path
              d="M50 82 L50 100"
              stroke="#1F2937"
              strokeWidth="3"
            />
            <circle cx="50" cy="88" r="2" fill="#DC2626" />
          </g>
        );
      case 'hoodie':
        return (
          <g>
            {baseOutfit}
            <path
              d="M40 70 C45 75, 55 75, 60 70 L60 72 C55 77, 45 77, 40 72 Z"
              fill={avatar.outfitColor}
              opacity="0.7"
            />
            <ellipse cx="50" cy="85" rx="6" ry="4" fill={avatar.outfitColor} opacity="0.5" />
          </g>
        );
      case 'cardigan':
        return (
          <g>
            <path
              d="M25 85 C25 75, 35 70, 50 70 C65 70, 75 75, 75 85 L75 100 L25 100 Z"
              fill="#E5E7EB"
            />
            <path
              d="M30 75 L30 100 L45 100 L45 75"
              fill={avatar.outfitColor}
            />
            <path
              d="M55 75 L55 100 L70 100 L70 75"
              fill={avatar.outfitColor}
            />
          </g>
        );
      case 'polo':
      default:
        return (
          <g>
            {baseOutfit}
            <path
              d="M45 70 L45 78 L55 78 L55 70"
              fill={avatar.outfitColor}
              opacity="0.8"
            />
            <circle cx="50" cy="82" r="1.5" fill="white" opacity="0.8" />
            <circle cx="50" cy="88" r="1.5" fill="white" opacity="0.8" />
          </g>
        );
    }
  };

  // Expression (mouth and eyebrows)
  const getExpression = () => {
    switch (avatar.expression) {
      case 'confident':
        return (
          <g>
            {/* Slight smile */}
            <path
              d="M42 60 Q50 66, 58 60"
              fill="none"
              stroke="#9B5B5B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Raised eyebrows */}
            <path d="M35 38 Q40 35, 45 38" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
            <path d="M55 38 Q60 35, 65 38" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
          </g>
        );
      case 'thoughtful':
        return (
          <g>
            {/* Slight asymmetric smile */}
            <path
              d="M43 60 Q50 62, 56 59"
              fill="none"
              stroke="#9B5B5B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* One eyebrow slightly raised */}
            <path d="M35 40 L45 39" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
            <path d="M55 37 Q60 35, 65 38" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
          </g>
        );
      case 'warm':
        return (
          <g>
            {/* Gentle wide smile */}
            <path
              d="M40 58 Q50 68, 60 58"
              fill="none"
              stroke="#9B5B5B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Soft arched eyebrows */}
            <path d="M34 39 Q40 36, 46 39" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
            <path d="M54 39 Q60 36, 66 39" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
          </g>
        );
      case 'stern':
        return (
          <g>
            {/* Neutral/slight frown */}
            <path
              d="M44 62 L56 62"
              fill="none"
              stroke="#9B5B5B"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Furrowed eyebrows */}
            <path d="M35 38 Q40 40, 45 37" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
            <path d="M55 37 Q60 40, 65 38" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
          </g>
        );
      case 'friendly':
      default:
        return (
          <g>
            {/* Open smile */}
            <path
              d="M42 58 Q50 66, 58 58"
              fill="white"
              stroke="#9B5B5B"
              strokeWidth="2"
            />
            {/* Neutral friendly eyebrows */}
            <path d="M35 40 Q40 38, 45 40" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
            <path d="M55 40 Q60 38, 65 40" fill="none" stroke={avatar.hairColor} strokeWidth="2" />
          </g>
        );
    }
  };

  return (
    <svg
      viewBox="0 0 100 100"
      width={pixelSize}
      height={pixelSize}
      className={`rounded-full ${className}`}
      style={{ backgroundColor: '#E5E7EB' }}
    >
      {/* Background circle */}
      <circle cx="50" cy="50" r="48" fill="#F3F4F6" />

      {/* Outfit (behind head) */}
      {getOutfit()}

      {/* Neck */}
      <path
        d="M42 65 L42 75 L58 75 L58 65"
        fill={avatar.skinTone}
      />

      {/* Head */}
      <ellipse
        cx="50"
        cy="45"
        rx="22"
        ry="26"
        fill={avatar.skinTone}
      />

      {/* Ears */}
      <ellipse cx="28" cy="48" rx="4" ry="6" fill={avatar.skinTone} />
      <ellipse cx="72" cy="48" rx="4" ry="6" fill={avatar.skinTone} />

      {/* Hair */}
      {getHairPath()}

      {/* Eyes */}
      <ellipse cx="40" cy="46" rx="4" ry="5" fill="white" />
      <ellipse cx="60" cy="46" rx="4" ry="5" fill="white" />
      <circle cx="40" cy="47" r="2.5" fill="#374151" />
      <circle cx="60" cy="47" r="2.5" fill="#374151" />
      <circle cx="41" cy="46" r="1" fill="white" />
      <circle cx="61" cy="46" r="1" fill="white" />

      {/* Expression (mouth + eyebrows) */}
      {getExpression()}

      {/* Nose */}
      <path
        d="M50 48 L48 54 Q50 56, 52 54 L50 48"
        fill={avatar.skinTone}
        stroke={avatar.skinTone}
        strokeWidth="1"
        opacity="0.6"
      />

      {/* Accessory */}
      {getAccessory()}
    </svg>
  );
};
