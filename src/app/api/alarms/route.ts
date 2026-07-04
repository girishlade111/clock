import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all alarms
export async function GET() {
  try {
    const alarms = await db.alarm.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(alarms);
  } catch (error) {
    console.error('Failed to fetch alarms:', error);
    return NextResponse.json({ error: 'Failed to fetch alarms' }, { status: 500 });
  }
}

// POST - Create a new alarm
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const alarm = await db.alarm.create({
      data: {
        label: body.label || 'Alarm',
        hour: body.hour ?? 0,
        minute: body.minute ?? 0,
        second: body.second ?? 0,
        enabled: body.enabled ?? true,
        repeat: body.repeat || 'once',
        customDays: body.customDays || '[]',
        snoozeMinutes: body.snoozeMinutes ?? 5,
        sound: body.sound || 'default',
      },
    });
    return NextResponse.json(alarm, { status: 201 });
  } catch (error) {
    console.error('Failed to create alarm:', error);
    return NextResponse.json({ error: 'Failed to create alarm' }, { status: 500 });
  }
}

// PUT - Update an alarm
export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing alarm id' }, { status: 400 });
    }

    const body = await request.json();
    const alarm = await db.alarm.update({
      where: { id },
      data: body,
    });
    return NextResponse.json(alarm);
  } catch (error) {
    console.error('Failed to update alarm:', error);
    return NextResponse.json({ error: 'Failed to update alarm' }, { status: 500 });
  }
}

// DELETE - Delete an alarm
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing alarm id' }, { status: 400 });
    }

    await db.alarm.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete alarm:', error);
    return NextResponse.json({ error: 'Failed to delete alarm' }, { status: 500 });
  }
}
