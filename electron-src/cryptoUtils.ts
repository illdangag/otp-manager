import crypto from 'crypto';

const algorithm = 'aes-256-cbc';
const IV = Buffer.from("5183666c72eec9e45183666c72eec9e4", "hex"); // set random initialisation vector

function encrypt (text: string, _secret: string): string {
  const hash = crypto.createHash('sha256').update(_secret).digest('hex');
  const key = Buffer.from(hash, 'hex');
  const cipher = crypto.createCipheriv(algorithm, key, IV);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function decrypt (text: string, _secret: string): string {
  const hash = crypto.createHash('sha256').update(_secret).digest('hex');
  const key = Buffer.from(hash, 'hex');
  let decipher = crypto.createDecipheriv(algorithm, key, IV);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}

export { encrypt, decrypt, };
