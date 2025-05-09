import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import * as fs from 'fs/promises';

const execAsync = promisify(exec);

interface VerificationRequest {
  sender: Uint8Array;
  recipient: Uint8Array;
  message: Uint8Array;
  timestamp: number;
  expected_sender_hash: Uint8Array;
  expected_recipient_hash: Uint8Array;
  expected_message_hash: Uint8Array;
  expected_timestamp: number;
}

export async function POST(request: Request) {
  try {
    const data: VerificationRequest = await request.json();

    // Validate required fields
    if (!data.sender || !data.recipient || !data.message || !data.timestamp ||
        !data.expected_sender_hash || !data.expected_recipient_hash || 
        !data.expected_message_hash || !data.expected_timestamp) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert Uint8Array to hex strings for TOML
    const tomlData = {
      sender: Array.from(data.sender).map(b => b.toString(16).padStart(2, '0')).join(''),
      recipient: Array.from(data.recipient).map(b => b.toString(16).padStart(2, '0')).join(''),
      message: Array.from(data.message).map(b => b.toString(16).padStart(2, '0')).join(''),
      timestamp: data.timestamp,
      expected_sender_hash: Array.from(data.expected_sender_hash).map(b => b.toString(16).padStart(2, '0')).join(''),
      expected_recipient_hash: Array.from(data.expected_recipient_hash).map(b => b.toString(16).padStart(2, '0')).join(''),
      expected_message_hash: Array.from(data.expected_message_hash).map(b => b.toString(16).padStart(2, '0')).join(''),
      expected_timestamp: data.expected_timestamp,
    };

    // Create TOML content
    const tomlContent = Object.entries(tomlData)
      .map(([key, value]) => `${key} = "${value}"`)
      .join('\n');

    // Write to Prover.toml
    const proverPath = path.join(process.cwd(), 'mzk', 'Prover.toml');
    await fs.writeFile(proverPath, tomlContent);

    // Execute Noir prover
    const { stdout, stderr } = await execAsync('cd mzk && nargo prove');

    if (stderr) {
      console.error('Noir prover error:', stderr);
      return NextResponse.json(
        { error: 'Verification failed: ' + stderr },
        { status: 500 }
      );
    }

    // Check if verification was successful
    const success = stdout.includes('Proved successfully');

    return NextResponse.json({ success });
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 