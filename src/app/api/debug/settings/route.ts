import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    console.log('Debug: Checking SystemSettings table...')
    
    // Check if table exists
    const tableExists = await prisma.$queryRaw`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'SystemSettings'
      );
    ` as any[]
    
    console.log('Table exists result:', tableExists)
    
    // Try to get table structure
    const tableStructure = await prisma.$queryRaw`
      SELECT column_name, data_type, column_default
      FROM information_schema.columns
      WHERE table_name = 'SystemSettings'
      ORDER BY ordinal_position;
    ` as any[]
    
    console.log('Table structure:', tableStructure)
    
    // Try to get data
    let data = null
    let dataError = null
    try {
      data = await prisma.$queryRaw`
        SELECT * FROM "SystemSettings" LIMIT 1
      ` as any[]
      console.log('Table data:', data)
    } catch (error) {
      dataError = error
      console.log('Error getting data:', error)
    }
    
    // Count records
    let recordCount = 0
    try {
      const countResult = await prisma.$queryRaw`
        SELECT COUNT(*) as count FROM "SystemSettings"
      ` as any[]
      recordCount = parseInt(countResult[0]?.count || '0')
      console.log('Record count:', recordCount)
    } catch (error) {
      console.log('Error counting records:', error)
    }
    
    return NextResponse.json({
      tableExists: tableExists[0]?.exists || false,
      tableStructure,
      data: data?.[0] || null,
      recordCount,
      dataError: dataError ? String(dataError) : null
    })
  } catch (error) {
    console.error('Debug error:', error)
    return NextResponse.json({ 
      error: 'Debug failed',
      details: String(error)
    }, { status: 500 })
  }
}