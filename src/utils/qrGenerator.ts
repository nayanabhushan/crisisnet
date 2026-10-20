// Offline QR Code Matrix Generator (Deterministic 21x21 QR Code Version 1 spec-inspired)
export function generateQRMatrix(input: string): boolean[][] {
  const size = 21;
  const matrix: boolean[][] = Array.from({ length: size }, () => Array(size).fill(false));

  // Helper to draw standard 7x7 Finder Pattern at (r, c)
  const drawFinder = (r: number, c: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          i === 0 || i === 6 || j === 0 || j === 6 ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          matrix[r + i][c + j] = true;
        } else {
          matrix[r + i][c + j] = false;
        }
      }
    }
  };

  // 1. Finder patterns at Top-Left, Top-Right, Bottom-Left
  drawFinder(0, 0);
  drawFinder(0, size - 7);
  drawFinder(size - 7, 0);

  // 2. Timing patterns
  for (let i = 8; i < size - 8; i++) {
    matrix[6][i] = i % 2 === 0;
    matrix[i][6] = i % 2 === 0;
  }

  // 3. Dark module
  matrix[size - 8][8] = true;

  // 4. Fill data areas with hash of input string
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  // PRNG from hash
  const pseudoRandom = (step: number) => {
    const x = Math.sin(hash + step) * 10000;
    return x - Math.floor(x);
  };

  let step = 0;
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Skip finder zones and separators
      if (
        (r < 8 && c < 8) ||
        (r < 8 && c >= size - 8) ||
        (r >= size - 8 && c < 8) ||
        (r === 6 || c === 6)
      ) {
        continue;
      }
      step++;
      matrix[r][c] = pseudoRandom(step) > 0.45;
    }
  }

  return matrix;
}

export function generateVerificationHash(id: string, node: string, time: string): string {
  const raw = `${id}:${node}:${time}:CRISISNET_SECURE_TOKEN`;
  let hash = 5381;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash * 33) ^ raw.charCodeAt(i);
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0');
  return `CN-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
}
