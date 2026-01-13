-- Create messages table for visitor contact form
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_read ON messages(read);

-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (for contact form)
CREATE POLICY "Anyone can insert messages" ON messages
  FOR INSERT WITH CHECK (true);

-- Policy: Only authenticated users can read messages
CREATE POLICY "Authenticated users can read messages" ON messages
  FOR SELECT USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update (mark as read)
CREATE POLICY "Authenticated users can update messages" ON messages
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete messages" ON messages
  FOR DELETE USING (auth.role() = 'authenticated');
