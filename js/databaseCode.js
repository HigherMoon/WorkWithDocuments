function dropTable(name) {
    return `DROP TABLE IF EXISTS ${name}`
}

const createYears = `
    CREATE TABLE IF NOT EXISTS years (
        id      INTEGER,
        year    TEXT,
    PRIMARY KEY (id),
    UNIQUE (year))
`;
const createPersonalHours = `
    CREATE TABLE IF NOT EXISTS groups (
        pId        INTEGER,
        yId        INTEGER NOT NULL,
        hours      INTEGER,
    FOREIGN KEY (pId) REFERENCES kafedra (id) ON DELETE CASCADE,
    FOREIGN KEY (yId) REFERENCES years (id) ON DELETE CASCADE,
    UNIQUE (pId, yId))
    `;

const createTypes = `
    CREATE TABLE IF NOT EXISTS types (
        id      INTEGER,
        names   TEXT,
    PRIMARY KEY (id),
    UNIQUE (name))
`;


const createKaf = `
    CREATE TABLE IF NOT EXISTS kafedra (
        id              INTEGER, 
        firstname       TEXT NOT NULL,
        secondname      REAL NOT NULL,
        surname         TEXT,
        position        TEXT,
        rank            TEXT,
        academic        TEXT,
        mail            TEXT, 
        phone           REAL,
        gpd             REAL,
        salary          REAL,
        hours           REAL,
    PRIMARY KEY (id),
    UNIQUE (firstname, secondname, surname)))
            `;

const createFlows = `
    CREATE TABLE IF NOT EXISTS flows (
        id               INTEGER NOT NULL,
        name             TEXT NOT NULL,
        faculty          TEXT NOT NULL,
        year             TEXT NOT NULL,
        education_form   TEXT NOT NULL,
    PRIMARY KEY (id))
    `;
const createGroups = `
    CREATE TABLE IF NOT EXISTS groups (
        id             INTEGER,
        flow_id        INTEGER NOT NULL,
        name           TEXT NOT NULL,
        students_b     INTEGER,
        students_nb    INTEGER,
    PRIMARY KEY (id),
    FOREIGN KEY (flow_id) REFERENCES flows (id) ON DELETE CASCADE,
    UNIQUE (name))
    `;
const createDisciplines = `
    CREATE TABLE IF NOT EXISTS disciplines (
        id       INTEGER,
        name     TEXT NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (name))
    `;
const createSyllabus = `
    CREATE TABLE IF NOT EXISTS syllabus (
        id                INTEGER,
        flow_id           INTEGER NOT NULL,
        discipline_id     INTEGER NOT NULL,
        semester          INTEGER,
        type              INTEGER,
        subgroups         INTEGER,
        sub_hours         INTEGER,
        hours             INTEGER,
    PRIMARY KEY (id),
    UNIQUE (flow_id, discipline_id, semester, type),
    FOREIGN KEY (flow_id) REFERENCES flows (id) ON DELETE CASCADE,
    FOREIGN KEY (type) REFERENCES types (id) ON DELETE CASCADE)
    `;
const createPersonalPlan = `
    CREATE TABLE IF NOT EXISTS personal_plan (
        p_id        INTEGER,
        s_id        INTEGER,
        subgroups   INTEGER NOT NULL,
        hours       INTEGER NOT NULL,
    PRIMARY KEY (p_id, s_id),
    FOREIGN KEY (s_id) REFERENCES syllabus (s_id) ON DELETE CASCADE,
    FOREIGN KEY (p_id) REFERENCES kafedra (p_id) ON DELETE CASCADE
    `;
