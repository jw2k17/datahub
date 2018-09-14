/**
 * Describes the interface for an avatar object
 * @interface IAvatar
 */
interface IAvatar {
  // URL for an avatar entity
  imageUrl: string;
  // Fallback url for avatar image on error
  imageUrlFallback: string;
  email?: null | string;
  // Handle for the avatar
  userName?: string;
  name?: string;
}

export { IAvatar };
