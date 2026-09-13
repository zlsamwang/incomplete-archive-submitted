// Simple axis-aligned box collision in the X/Z plane (our rooms have no
// verticality), used both for solid colliders (walls, furniture) and for
// door trigger volumes.

export interface Box2D {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export function boxFromCenter(x: number, z: number, w: number, d: number): Box2D {
  return { minX: x - w / 2, maxX: x + w / 2, minZ: z - d / 2, maxZ: z + d / 2 };
}

export function pointInBox(x: number, z: number, box: Box2D): boolean {
  return x >= box.minX && x <= box.maxX && z >= box.minZ && z <= box.maxZ;
}

/**
 * Resolves a moving circle (the player) against a set of static boxes by
 * pushing it out along the axis of least penetration. Mutates nothing;
 * returns the corrected {x, z}.
 */
export function resolveCollisions(x: number, z: number, radius: number, boxes: Box2D[]): { x: number; z: number } {
  let px = x;
  let pz = z;
  for (const box of boxes) {
    const closestX = Math.max(box.minX, Math.min(px, box.maxX));
    const closestZ = Math.max(box.minZ, Math.min(pz, box.maxZ));
    const dx = px - closestX;
    const dz = pz - closestZ;
    const distSq = dx * dx + dz * dz;
    if (distSq < radius * radius) {
      const dist = Math.sqrt(distSq) || 0.0001;
      const overlap = radius - dist;
      px += (dx / dist) * overlap;
      pz += (dz / dist) * overlap;
    }
  }
  return { x: px, z: pz };
}
