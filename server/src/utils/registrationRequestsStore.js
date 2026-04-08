const fs = require('fs/promises');
const path = require('path');
const { randomUUID } = require('crypto');

const DATA_DIR = path.join(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'registration-requests.json');

const readRequests = async () => {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    if (error.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
};

const writeRequests = async (requests) => {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(requests, null, 2), 'utf8');
};

const createRequest = async (payload) => {
  const current = await readRequests();
  const next = [
    {
      request_id: randomUUID(),
      status: 'pending',
      created_at: new Date().toISOString(),
      reviewed_at: null,
      reviewed_by: null,
      review_note: null,
      ...payload,
    },
    ...current,
  ];
  await writeRequests(next);
  return next[0];
};

const updateRequest = async (requestId, updater) => {
  const current = await readRequests();
  const idx = current.findIndex((item) => item.request_id === requestId);
  if (idx === -1) {
    return null;
  }

  const previous = current[idx];
  const updated = {
    ...previous,
    ...updater(previous),
  };

  current[idx] = updated;
  await writeRequests(current);
  return updated;
};

const getById = async (requestId) => {
  const current = await readRequests();
  return current.find((item) => item.request_id === requestId) || null;
};

const listAll = async () => {
  return readRequests();
};

const findLatestByEmail = async (email) => {
  const current = await readRequests();
  const targetEmail = String(email || '').toLowerCase().trim();
  return current.find((item) => String(item.email || '').toLowerCase().trim() === targetEmail) || null;
};

module.exports = {
  createRequest,
  updateRequest,
  getById,
  listAll,
  findLatestByEmail,
};
