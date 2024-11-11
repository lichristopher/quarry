import { NextResponse } from 'next/server';
import data from '../../../../db.json';

export async function GET() {
  try {
    return NextResponse.json(
      {
        message: 'Records fetched successfully',
        data: data.quarryDispatchRecords,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Error fetching records',
        error: error,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'date',
      'drNumber',
      'trucker',
      'plateNumber',
      'time',
      'quantityUnit',
      'destination',
      'paymentMethod',
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          {
            message: `Missing required field: ${field}`,
          },
          { status: 400 }
        );
      }
    }

    // Generate a random ID (in production, use a more robust ID generation method)
    const newRecord = {
      id: Math.random().toString(36).substr(2, 4),
      ...body,
    };

    // In a real application, you would save this to a database
    // For now, we'll just return the new record
    return NextResponse.json(
      {
        message: 'Record created successfully',
        data: newRecord,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: 'Error creating record',
        error: error,
      },
      { status: 500 }
    );
  }
}
