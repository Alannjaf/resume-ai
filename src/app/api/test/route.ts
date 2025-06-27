import { NextResponse } from 'next/server'

export async function GET() {
  // Test API endpoint hit
  return NextResponse.json({ 
    message: 'API is working!', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  })
}

export async function POST() {
  // Test POST endpoint hit
  return NextResponse.json({ 
    message: 'POST API is working!', 
    timestamp: new Date().toISOString()
  })
}