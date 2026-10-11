import React, { useState } from 'react';
import { OWNER_NAME } from '../config';

// Put your photo at  public/photo.webp  (jpg/png also fine: change the file name below).
const PHOTO_SRC = `${process.env.PUBLIC_URL || ''}/photo.webp`;

export default function ProfilePhoto() {
  const [failed, setFailed] = useState(false);
  return (
    <div className="profilePhoto">
      {failed ? (
        <span className="photoFallback" role="img" aria-label="Photo placeholder. Add your photo at public/photo.webp">GK</span>
      ) : (
        <img src={PHOTO_SRC} alt={`Portrait of ${OWNER_NAME}, the developer of this game`} width="220" height="220" onError={() => setFailed(true)} />
      )}
    </div>
  );
}
