type LocalUserRecord = {
  id: string;
  email: string;
  password?: string;
  user_metadata: Record<string, string>;
  app_metadata: Record<string, string>;
};

type LocalAuthUser = {
  id: string;
  email: string;
  user_metadata: Record<string, string>;
  app_metadata: Record<string, string>;
};

type LocalTableName = "projekte" | "projekt_user" | "personen" | "documentation" | "user_emails" ;

type LocalStore = {
  users: LocalUserRecord[];
  tables: Record<Exclude<LocalTableName, "user_emails" | "storage">, any[]>;
  storage: Record<string, Record<string, { name: string; fileName: string; type: string; size: number; dataUrl: string }>>;
};

type QueryFilter =
  | { kind: "eq"; column: string; value: any }
  | { kind: "in"; column: string; values: any[] }
  | { kind: "gte"; column: string; value: any }
  | { kind: "lte"; column: string; value: any };

type QueryResult<T> = { data: T | null; error: LocalError | null };

type LocalError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

const STORE_KEY = "ethno-log-dev-store";
const AUTH_KEY = "ethno-log-dev-auth";
const AUTH_EVENT = "ethno-log-dev-auth-change";

const DEMO_OWNER_ID = "local-demo-owner";
const DEMO_OWNER_EMAIL = "demo@ethno-log.local";
const DEMO_OWNER_PASSWORD = "demo1234";
const DEMO_MEMBER_ID = "local-demo-member";
const DEMO_MEMBER_EMAIL = "member@ethno-log.local";
const DEMO_MEMBER_PASSWORD = "demo1234";

function cloneValue<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }

  return JSON.parse(JSON.stringify(value));
}

function createError(message: string, code?: string): LocalError {
  return { message, code };
}

function todayIsoDate() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildDemoSvgDataUrl(label: string) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="480" viewBox="0 0 720 480"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2563eb"/><stop offset="100%" stop-color="#f97316"/></linearGradient></defs><rect width="720" height="480" rx="32" fill="url(#g)"/><rect x="52" y="52" width="616" height="376" rx="24" fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.35)"/><text x="360" y="225" fill="#ffffff" font-size="42" font-family="Arial, sans-serif" font-weight="700" text-anchor="middle">${label}</text><text x="360" y="275" fill="#ffffff" font-size="22" font-family="Arial, sans-serif" text-anchor="middle">Lokale Testdatei</text></svg>`;
  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
}

function createSeedStore(): LocalStore {
  const demoImageDataUrl = buildDemoSvgDataUrl("Ethno-Log");
  const demoImageName = "demo-image.svg";

  return {
    users: [
      {
        id: DEMO_OWNER_ID,
        email: DEMO_OWNER_EMAIL,
        password: DEMO_OWNER_PASSWORD,
        user_metadata: { display_name: "Demo Owner", bio: "" },
        app_metadata: { auth_mode: "local" },
      },
      {
        id: DEMO_MEMBER_ID,
        email: DEMO_MEMBER_EMAIL,
        password: DEMO_MEMBER_PASSWORD,
        user_metadata: { display_name: "Demo Member", bio: "" },
        app_metadata: { auth_mode: "local" },
      },
    ],
    tables: {
      projekte: [
        {
          id: "proj-demo-1",
          name: "Beispielprojekt",
          beschreibung: "Lokale Beispieldaten für Entwicklung und Übersetzung.",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user_id: DEMO_OWNER_ID,
          optionen: ["archiv", "live", "meeting", "interview", "fieldnote"],
          arbeitsweise: "demo",
        },
      ],
      projekt_user: [
        {
          id: "proj-user-demo-1",
          projekt_id: "proj-demo-1",
          user_id: DEMO_MEMBER_ID,
          role: "read",
        },
      ],
      personen: [
        {
          id: "person-demo-1",
          projekt_id: "proj-demo-1",
          vorname: "Maria",
          nachname: "Beispiel",
          email: "maria@example.local",
          position: "Kontaktperson",
        },
      ],
      documentation: [
        {
          id: "doc-demo-1",
          projekt_id: "proj-demo-1",
          name: "Erstes Meeting",
          beschreibung: "Lokale Testdokumentation für die Detailansicht.",
          startzeit: "10:00",
          endzeit: "10:45",
          datum: todayIsoDate(),
          typ: "live",
          untertyp: "meeting",
          personen: [
            { id: 1, vorname: "Maria", nachname: "Beispiel", email: "maria@example.local", position: "Kontaktperson" },
          ],
          klient: "",
          dialoge: [{ text: "Willkommen zur lokalen Demo." }],
          kernfragen: [{ frage: "Was wird hier getestet?", antwort: "Die lokale Demo-Datenbank." }],
          dateien: [
            {
              name: "demo-image.svg",
              fileName: demoImageName,
              type: "image/svg+xml",
              size: demoImageDataUrl.length,
            },
          ],
          tags: ["demo", "lokal"],
          status: "fertig",
          meeting_typ: "",
          interview_typ: "",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ],
    },
    storage: {
      "documentation-files": {
        [demoImageName]: {
          name: "demo-image.svg",
          fileName: demoImageName,
          type: "image/svg+xml",
          size: demoImageDataUrl.length,
          dataUrl: demoImageDataUrl,
        },
      },
    },
  };
}

function loadStore(): LocalStore {
  if (typeof window === "undefined") {
    return createSeedStore();
  }

  const rawStore = window.localStorage.getItem(STORE_KEY);
  const rawAuth = window.localStorage.getItem(AUTH_KEY);

  if (!rawStore) {
    const seeded = createSeedStore();
    window.localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
    return seeded;
  }

  try {
    const store = JSON.parse(rawStore) as LocalStore;
    const legacyTables = store.tables as Record<string, unknown>;
    const legacyStorage = legacyTables.storage;

    if (!store.storage || typeof store.storage !== "object" || Array.isArray(store.storage)) {
      store.storage = legacyStorage && typeof legacyStorage === "object" && !Array.isArray(legacyStorage)
        ? legacyStorage as LocalStore["storage"]
        : {};
    }

    if ("storage" in legacyTables) {
      delete legacyTables.storage;
    }

    if (rawAuth) {
      try {
        const currentUser = JSON.parse(rawAuth) as LocalAuthUser;
        if (currentUser?.id && currentUser?.email) {
          const existingIndex = store.users.findIndex((user) => user.id === currentUser.id);
          const storedRecord: LocalUserRecord = {
            id: currentUser.id,
            email: currentUser.email,
            user_metadata: currentUser.user_metadata || {},
            app_metadata: currentUser.app_metadata || { auth_mode: "local" },
          };

          if (existingIndex >= 0) {
            store.users[existingIndex] = {
              ...store.users[existingIndex],
              ...storedRecord,
              password: store.users[existingIndex].password,
            };
          } else {
            store.users.push(storedRecord);
          }
        }
      } catch {
        // Legacy auth state can be ignored safely.
      }
    }

    return store;
  } catch {
    const seeded = createSeedStore();
    window.localStorage.setItem(STORE_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveStore(store: LocalStore) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function readCurrentAuthUser(): LocalAuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const rawAuth = window.localStorage.getItem(AUTH_KEY);
    if (!rawAuth) {
      return null;
    }

    return JSON.parse(rawAuth) as LocalAuthUser;
  } catch {
    return null;
  }
}

function persistCurrentAuthUser(user: LocalAuthUser | null) {
  if (typeof window === "undefined") {
    return;
  }

  if (user) {
    window.localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  } else {
    window.localStorage.removeItem(AUTH_KEY);
  }
}

function toPublicUser(record: LocalUserRecord): LocalAuthUser {
  return {
    id: record.id,
    email: record.email,
    user_metadata: cloneValue(record.user_metadata),
    app_metadata: cloneValue(record.app_metadata),
  };
}

function listAllUsers(store: LocalStore): LocalUserRecord[] {
  const usersById = new Map<string, LocalUserRecord>();

  store.users.forEach((user) => {
    usersById.set(user.id, user);
  });

  const currentAuthUser = readCurrentAuthUser();
  if (currentAuthUser && !usersById.has(currentAuthUser.id)) {
    usersById.set(currentAuthUser.id, {
      id: currentAuthUser.id,
      email: currentAuthUser.email,
      user_metadata: currentAuthUser.user_metadata || {},
      app_metadata: currentAuthUser.app_metadata || { auth_mode: "local" },
    });
  }

  return [...usersById.values()];
}

function findUserByEmail(store: LocalStore, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return listAllUsers(store).find((user) => user.email.toLowerCase() === normalizedEmail) || null;
}

function findUserById(store: LocalStore, userId: string) {
  return listAllUsers(store).find((user) => user.id === userId) || null;
}

function ensureStarterProject(store: LocalStore, user: LocalAuthUser) {
  if (store.tables.projekte.some((projekt) => projekt.user_id === user.id)) {
    return;
  }

  const projectId = `proj-${user.id}-starter`;
  const now = new Date().toISOString();
  const demoImageName = `starter-${user.id}.svg`;
  const demoImageDataUrl = buildDemoSvgDataUrl("Ethno-Log");

  store.tables.projekte.unshift({
    id: projectId,
    name: "Beispielprojekt",
    beschreibung: "Automatisch angelegtes Projekt für lokale Tests.",
    created_at: now,
    updated_at: now,
    user_id: user.id,
    optionen: ["archiv", "live", "meeting", "interview", "fieldnote"],
    arbeitsweise: "demo",
  });

  store.tables.projekt_user.unshift({
    id: `proj-user-${user.id}-starter-member`,
    projekt_id: projectId,
    user_id: DEMO_MEMBER_ID,
    role: "read",
  });

  store.tables.personen.unshift({
    id: `person-${user.id}-starter`,
    projekt_id: projectId,
    vorname: "Demo",
    nachname: "Person",
    email: "demo.person@example.local",
    position: "Kontaktperson",
  });

  store.tables.documentation.unshift({
    id: `doc-${user.id}-starter`,
    projekt_id: projectId,
    name: "Lokale Testdokumentation",
    beschreibung: "Automatisch angelegte Beispiel-Dokumentation.",
    startzeit: "09:00",
    endzeit: "09:30",
    datum: todayIsoDate(),
    typ: "live",
    untertyp: "meeting",
    personen: [
      { id: 1, vorname: "Demo", nachname: "Person", email: "demo.person@example.local", position: "Kontaktperson" },
    ],
    klient: "",
    dialoge: [{ text: "Lokale Entwicklung ist aktiv." }],
    kernfragen: [{ frage: "Wofür ist das?", antwort: "Für lokale Tests ohne Supabase." }],
    dateien: [
      {
        name: demoImageName,
        fileName: demoImageName,
        type: "image/svg+xml",
        size: demoImageDataUrl.length,
      },
    ],
    tags: ["demo", "lokal"],
    status: "fertig",
    meeting_typ: "",
    interview_typ: "",
    created_at: now,
    updated_at: now,
  });

  store.storage["documentation-files"] ??= {};
  store.storage["documentation-files"][demoImageName] = {
    name: demoImageName,
    fileName: demoImageName,
    type: "image/svg+xml",
    size: demoImageDataUrl.length,
    dataUrl: demoImageDataUrl,
  };
}

function readBlobAsDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error || new Error("Failed to read blob"));
    reader.readAsDataURL(blob);
  });
}

function applyFilters(rows: any[], filters: QueryFilter[]) {
  return rows.filter((row) => {
    return filters.every((filter) => {
      const currentValue = row?.[filter.column];

      if (filter.kind === "eq") {
        return currentValue === filter.value;
      }

      if (filter.kind === "in") {
        return filter.values.includes(currentValue);
      }

      if (filter.kind === "gte") {
        return String(currentValue) >= String(filter.value);
      }

      if (filter.kind === "lte") {
        return String(currentValue) <= String(filter.value);
      }

      return true;
    });
  });
}

function sortRows(rows: any[], orderBy?: { column: string; ascending: boolean }) {
  if (!orderBy) {
    return rows;
  }

  return [...rows].sort((left, right) => {
    const leftValue = left?.[orderBy.column];
    const rightValue = right?.[orderBy.column];

    if (leftValue === rightValue) {
      return 0;
    }

    const comparison = String(leftValue).localeCompare(String(rightValue));
    return orderBy.ascending ? comparison : -comparison;
  });
}

function projectRows(store: LocalStore, tableName: LocalTableName, rows: any[], selection: string) {
  if (tableName === "projekt_user" && selection.includes("projekte:projekt_id")) {
    return rows.map((row) => ({
      ...cloneValue(row),
      projekte: cloneValue(store.tables.projekte.find((projekt) => projekt.id === row.projekt_id) || null),
    }));
  }

  if (tableName === "user_emails") {
    return rows.map((row) => ({ user_id: row.user_id, email: row.email }));
  }

  return rows.map((row) => cloneValue(row));
}

class LocalQueryBuilder implements PromiseLike<QueryResult<any>> {
  private filters: QueryFilter[] = [];
  private selection = "*";
  private orderBy?: { column: string; ascending: boolean };
  private singleResult = false;
  private action: "select" | "insert" | "update" | "delete" = "select";
  private payload: any = null;

  constructor(private readonly store: LocalStore, private readonly tableName: LocalTableName) {}

  select(columns = "*") {
    this.selection = columns;
    return this;
  }

  insert(values: any) {
    this.action = "insert";
    this.payload = values;
    return this;
  }

  update(values: any) {
    this.action = "update";
    this.payload = values;
    return this;
  }

  delete() {
    this.action = "delete";
    return this;
  }

  eq(column: string, value: any) {
    this.filters.push({ kind: "eq", column, value });
    return this;
  }

  in(column: string, values: any[]) {
    this.filters.push({ kind: "in", column, values });
    return this;
  }

  gte(column: string, value: any) {
    this.filters.push({ kind: "gte", column, value });
    return this;
  }

  lte(column: string, value: any) {
    this.filters.push({ kind: "lte", column, value });
    return this;
  }

  order(column: string, options?: { ascending?: boolean }) {
    this.orderBy = { column, ascending: options?.ascending ?? true };
    return this;
  }

  single() {
    this.singleResult = true;
    return this;
  }

  then<TResult1 = QueryResult<any>, TResult2 = never>(
    onfulfilled?: ((value: QueryResult<any>) => TResult1 | PromiseLike<TResult1>) | null,
    onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null,
  ) {
    return this.execute().then(onfulfilled, onrejected);
  }

  private getTableRows() {
    if (this.tableName === "user_emails") {
      return listAllUsers(this.store).map((user) => ({ user_id: user.id, email: user.email }));
    }

    return this.store.tables[this.tableName] ?? [];
  }

  private setTableRows(rows: any[]) {
    if (this.tableName === "user_emails") {
      return;
    }

    this.store.tables[this.tableName] = rows;
  }

  private createRowId(prefix: string) {
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  private normalizeInsertPayload() {
    const values = Array.isArray(this.payload) ? this.payload : [this.payload];
    return values.map((value) => cloneValue(value));
  }

  private executeSelect() {
    const rows = sortRows(applyFilters(this.getTableRows(), this.filters), this.orderBy);
    const projected = projectRows(this.store, this.tableName, rows, this.selection);

    if (this.singleResult) {
      return { data: projected[0] || null, error: null };
    }

    return { data: projected, error: null };
  }

  private executeInsert() {
    if (this.tableName === "user_emails") {
      return { data: null, error: createError("user_emails is read-only") };
    }

    const insertedRows = this.normalizeInsertPayload().map((row) => {
      const now = new Date().toISOString();
      const baseRow = { ...row };

      if (!baseRow.id) {
        baseRow.id = this.createRowId(this.tableName.slice(0, 5));
      }

      if (this.tableName === "projekte") {
        baseRow.created_at ??= now;
        baseRow.updated_at ??= now;
        baseRow.optionen ??= [];
        baseRow.arbeitsweise ??= "";
      }

      if (this.tableName === "documentation") {
        baseRow.created_at ??= now;
        baseRow.updated_at ??= now;
        baseRow.personen ??= [];
        baseRow.dialoge ??= [];
        baseRow.kernfragen ??= [];
        baseRow.dateien ??= [];
        baseRow.tags ??= [];
      }

      return baseRow;
    });

    this.setTableRows([...this.getTableRows(), ...insertedRows]);
    saveStore(this.store);

    if (this.selection || this.singleResult) {
      const projected = projectRows(this.store, this.tableName, insertedRows, this.selection);
      return { data: this.singleResult ? projected[0] || null : projected, error: null };
    }

    return { data: insertedRows, error: null };
  }

  private executeUpdate() {
    if (this.tableName === "user_emails") {
      return { data: null, error: createError("user_emails is read-only") };
    }

    const rows = [...this.getTableRows()];
    const updatedRows: any[] = [];

    rows.forEach((row, index) => {
      const matches = applyFilters([row], this.filters).length > 0;
      if (!matches) {
        return;
      }

      const nextRow = { ...row, ...cloneValue(this.payload) };

      if (this.tableName === "projekte") {
        nextRow.updated_at = new Date().toISOString();
      }

      if (this.tableName === "documentation") {
        nextRow.updated_at = new Date().toISOString();
      }

      rows[index] = nextRow;
      updatedRows.push(nextRow);
    });

    this.setTableRows(rows);
    saveStore(this.store);

    const projected = projectRows(this.store, this.tableName, updatedRows, this.selection);
    return { data: this.singleResult ? projected[0] || null : projected, error: null };
  }

  private executeDelete() {
    if (this.tableName === "user_emails") {
      return { data: null, error: createError("user_emails is read-only") };
    }

    const rows = [...this.getTableRows()];
    const deletedRows: any[] = [];
    const remainingRows = rows.filter((row) => {
      const matches = applyFilters([row], this.filters).length > 0;
      if (matches) {
        deletedRows.push(row);
      }
      return !matches;
    });

    if (this.tableName === "projekte") {
      const deletedProjectIds = deletedRows.map((row) => row.id);
      this.store.tables.projekt_user = this.store.tables.projekt_user.filter((row) => !deletedProjectIds.includes(row.projekt_id));
      this.store.tables.personen = this.store.tables.personen.filter((row) => !deletedProjectIds.includes(row.projekt_id));
      this.store.tables.documentation = this.store.tables.documentation.filter((row) => !deletedProjectIds.includes(row.projekt_id));
    }

    this.setTableRows(remainingRows);
    saveStore(this.store);
    return { data: deletedRows, error: null };
  }

  private execute() {
    if (this.action === "insert") {
      return Promise.resolve(this.executeInsert());
    }

    if (this.action === "update") {
      return Promise.resolve(this.executeUpdate());
    }

    if (this.action === "delete") {
      return Promise.resolve(this.executeDelete());
    }

    return Promise.resolve(this.executeSelect());
  }
}

function createLocalStorageApi(store: LocalStore) {
  return {
    from(bucketName: string) {
      return {
        async upload(fileName: string, file: Blob, options?: { upsert?: boolean }) {
          store.storage[bucketName] ??= {};

          if (store.storage[bucketName][fileName] && !options?.upsert) {
            return {
              data: null,
              error: createError("File already exists"),
            };
          }

          const dataUrl = await readBlobAsDataUrl(file);
          store.storage[bucketName][fileName] = {
            name: fileName,
            fileName,
            type: file.type || "application/octet-stream",
            size: file.size,
            dataUrl,
          };
          saveStore(store);

          return { data: { path: fileName }, error: null };
        },
        async createSignedUrl(fileName: string) {
          const fileRecord = store.storage[bucketName]?.[fileName];
          if (!fileRecord) {
            return {
              data: null,
              error: createError("File not found"),
            };
          }

          return {
            data: { signedUrl: fileRecord.dataUrl },
            error: null,
          };
        },
      };
    },
  };
}

function upsertLocalUser(store: LocalStore, user: LocalAuthUser, password?: string) {
  const nextRecord: LocalUserRecord = {
    id: user.id,
    email: user.email,
    password,
    user_metadata: cloneValue(user.user_metadata || {}),
    app_metadata: cloneValue(user.app_metadata || { auth_mode: "local" }),
  };

  const existingIndex = store.users.findIndex((candidate) => candidate.id === user.id || candidate.email.toLowerCase() === user.email.toLowerCase());
  if (existingIndex >= 0) {
    store.users[existingIndex] = {
      ...store.users[existingIndex],
      ...nextRecord,
      password: password ?? store.users[existingIndex].password,
    };
  } else {
    store.users.push(nextRecord);
  }
}

function makeLocalUser(userRecord: LocalUserRecord): LocalAuthUser {
  return toPublicUser(userRecord);
}

function ensureUserStarterData(store: LocalStore, user: LocalAuthUser) {
  ensureStarterProject(store, user);
  saveStore(store);
}

function signInOrCreate(store: LocalStore, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = findUserByEmail(store, normalizedEmail);

  if (existingUser && existingUser.password && existingUser.password !== password) {
    return {
      data: { user: null, session: null },
      error: createError("Ungültige Anmeldedaten."),
    };
  }

  const userRecord: LocalUserRecord = existingUser ?? {
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    email: normalizedEmail,
    password,
    user_metadata: {
      display_name: normalizedEmail.split("@")[0] || "Local User",
      bio: "",
    },
    app_metadata: { auth_mode: "local" },
  };

  if (!existingUser) {
    store.users.push(userRecord);
  } else if (!existingUser.password) {
    userRecord.password = password;
    upsertLocalUser(store, userRecord, password);
  }

  const user = makeLocalUser(userRecord);
  persistCurrentAuthUser(user);
  ensureUserStarterData(store, user);

  return {
    data: { user, session: { user } },
    error: null,
  };
}

function registerOrLogin(store: LocalStore, email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = findUserByEmail(store, normalizedEmail);

  if (existingUser && existingUser.password && existingUser.password !== password) {
    return {
      data: { user: null, session: null },
      error: createError("Diese E-Mail-Adresse ist bereits registriert."),
    };
  }

  const userRecord: LocalUserRecord = existingUser ?? {
    id: `local-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    email: normalizedEmail,
    password,
    user_metadata: {
      display_name: normalizedEmail.split("@")[0] || "Local User",
      bio: "",
    },
    app_metadata: { auth_mode: "local" },
  };

  upsertLocalUser(store, userRecord, password);
  const publicUser = makeLocalUser(userRecord);
  persistCurrentAuthUser(publicUser);
  ensureUserStarterData(store, publicUser);

  return {
    data: { user: publicUser, session: { user: publicUser } },
    error: null,
  };
}

export function createLocalSupabaseClient() {
  const store = loadStore();

  return {
    auth: {
      async getUser() {
        const currentUser = readCurrentAuthUser();
        if (!currentUser) {
          return { data: { user: null }, error: null };
        }

        ensureUserStarterData(store, currentUser);
        return { data: { user: currentUser }, error: null };
      },
      onAuthStateChange(listener: (event: string, session: { user: LocalAuthUser | null } | null) => void) {
        const handler = () => {
          const currentUser = readCurrentAuthUser();
          listener("INITIAL_SESSION", currentUser ? { user: currentUser } : null);
        };

        if (typeof window !== "undefined") {
          window.setTimeout(handler, 0);
          window.addEventListener(AUTH_EVENT, handler);
        }

        return {
          data: {
            subscription: {
              unsubscribe: () => {
                if (typeof window !== "undefined") {
                  window.removeEventListener(AUTH_EVENT, handler);
                }
              },
            },
          },
        };
      },
      async signInWithPassword({ email, password }: { email: string; password: string }) {
        return signInOrCreate(store, email, password);
      },
      async signUp({ email, password }: { email: string; password: string }) {
        return registerOrLogin(store, email, password);
      },
      async signOut() {
        persistCurrentAuthUser(null);
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event(AUTH_EVENT));
        }
        return { error: null };
      },
      async updateUser({ data }: { data: Record<string, string> }) {
        const currentAuthUser = readCurrentAuthUser();
        if (!currentAuthUser) {
          return { data: { user: null }, error: createError("Kein lokaler Benutzer angemeldet.") };
        }

        const userRecord = findUserById(store, currentAuthUser.id);
        if (!userRecord) {
          return { data: { user: null }, error: createError("Benutzer nicht gefunden.") };
        }

        userRecord.user_metadata = {
          ...userRecord.user_metadata,
          ...data,
        };

        const updatedUser = makeLocalUser(userRecord);
        persistCurrentAuthUser(updatedUser);
        saveStore(store);

        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event(AUTH_EVENT));
        }

        return { data: { user: updatedUser }, error: null };
      },
      admin: {
        async listUsers() {
          const users = listAllUsers(store).map((user) => makeLocalUser(user));
          return { data: { users }, error: null };
        },
      },
    },
    from(tableName: LocalTableName) {
      return new LocalQueryBuilder(store, tableName);
    },
    rpc(name: string, params?: Record<string, any>) {
      if (name === "get_user_emails") {
        const requestedIds = Array.isArray(params?.p_user_ids) ? params.p_user_ids : [];
        const users = listAllUsers(store).filter((user) => requestedIds.includes(user.id));
        return Promise.resolve({
          data: users.map((user) => ({ user_id: user.id, email: user.email })),
          error: null,
        });
      }

      if (name === "add_user_to_project_by_email") {
        const projektId = params?.p_projekt_id;
        const email = String(params?.p_user_email || "").trim().toLowerCase();
        const role = params?.p_role || "read";
        const user = findUserByEmail(store, email);

        if (!user) {
          return Promise.resolve({
            data: null,
            error: createError("Benutzer nicht gefunden."),
          });
        }

        const alreadyExists = store.tables.projekt_user.some(
          (entry) => entry.projekt_id === projektId && entry.user_id === user.id,
        );

        if (alreadyExists) {
          return Promise.resolve({
            data: null,
            error: createError("Benutzer ist bereits Mitglied des Projekts."),
          });
        }

        const row = {
          id: `proj-user-${Date.now()}-${Math.random().toString(16).slice(2)}`,
          projekt_id: projektId,
          user_id: user.id,
          role,
        };

        store.tables.projekt_user.push(row);
        saveStore(store);

        return Promise.resolve({ data: row, error: null });
      }

      return Promise.resolve({
        data: null,
        error: createError(`RPC ${name} ist im lokalen Modus nicht implementiert.`),
      });
    },
    storage: createLocalStorageApi(store),
  };
}