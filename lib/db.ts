import { promises as fs } from "fs"
import path from "path"

type UserRecord = {
  id: string
  email: string
  name?: string
  enrolledCourse?: boolean
  progress?: number
}

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")

async function ensureDataFiles() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    try {
      await fs.access(USERS_FILE)
    } catch {
      await fs.writeFile(USERS_FILE, JSON.stringify({ users: [] }, null, 2), "utf8")
    }
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("Failed to ensure data files", err)
  }
}

export async function getUsers(): Promise<UserRecord[]> {
  await ensureDataFiles()
  const raw = await fs.readFile(USERS_FILE, "utf8")
  const json = JSON.parse(raw || "{}")
  return Array.isArray(json.users) ? json.users : []
}

export async function saveUsers(users: UserRecord[]): Promise<void> {
  await ensureDataFiles()
  const payload = { users }
  await fs.writeFile(USERS_FILE, JSON.stringify(payload, null, 2), "utf8")
}

export async function upsertUser(user: UserRecord): Promise<UserRecord> {
  const users = await getUsers()
  const idx = users.findIndex((u) => u.id === user.id || u.email === user.email)
  if (idx >= 0) {
    users[idx] = { ...users[idx], ...user }
  } else {
    users.push(user)
  }
  await saveUsers(users)
  return user
}

export async function findUserByEmail(email: string): Promise<UserRecord | undefined> {
  const users = await getUsers()
  return users.find((u) => u.email === email)
}

export async function markEnrolled(userIdOrEmail: string): Promise<UserRecord | undefined> {
  const users = await getUsers()
  const idx = users.findIndex((u) => u.id === userIdOrEmail || u.email === userIdOrEmail)
  if (idx >= 0) {
    users[idx].enrolledCourse = true
    users[idx].progress = users[idx].progress ?? 0
    await saveUsers(users)
    return users[idx]
  }
  return undefined
}

export type { UserRecord }


