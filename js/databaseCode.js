//

const dropKaf = `drop table if exists Кафедра`;
const dropKaf2 =  `drop table if exists Группы`
const dropKaf3 =  `drop table if exists Дисциплины`
const dropKaf4 = `drop table if exists Учебный_план`
const dropKaf5 = `drop table if exists Персональный_план`



const createKaf = `Create table if not exists Кафедра (
    Personal_ID     INTEGER, 
    ФИО             TEXT NOT NULL,
    Часы            REAL NOT NULL,
    Должность       TEXT,
    Звание          TEXT,
    Учёная_степень  TEXT,
    Телефон         TEXT,
    Почта           TEXT, 
    ГПД             REAL,
    Ставка          REAL,
        PRIMARY KEY (Personal_ID),
        FOREIGN KEY (Personal_ID) REFERENCES Персональный_план (Personal_ID),
        UNIQUE (ФИО, Телефон, Почта) 
)`;

const createGroups = `Create table if not exists Группы (
    Group_ID            INTEGER,
    Факультет           TEXT NOT NULL,
    Наименование        TEXT NOT NULL,
    Количество_подгрупп INTEGER,
    Студенты_Б          INTEGER,
    Студенты_ВБ         INTEGER,
        PRIMARY KEY (Group_ID),
        FOREIGN KEY (Group_ID) REFERENCES Персональный_план (Group_ID),
        UNIQUE (Наименование) 
)`;

const createDisciplines = `Create table if not exists Дисциплины (
    Discipline_ID   INTEGER,
    Наименование    TEXT NOT NULL,
        PRIMARY KEY (Discipline_ID),
        FOREIGN KEY (Discipline_ID) REFERENCES Персональный_план (Discipline_ID),
        UNIQUE (Наименование) 
)`;

const createUP = `Create table if not exists Учебный_план (
    UP_ID           INTEGER,
    Group_ID        INTEGER,
    Discipline_ID   INTEGER,
    Наименование    TEXT NOT NULL,
    Год             TEXT NOT NULL,
    Семестр         INTEGER NOT NULL,
    Форма_обучения  TEXT NOT NULL,
    Тип             TEXT NOT NULL,
    Часы_УП         INTEGER NOT NULL,
    Часы            INTEGER NOT NULL,
        PRIMARY KEY (UP_ID, Group_ID, Discipline_ID),
        FOREIGN KEY (UP_ID) REFERENCES Персональный_план (UP_ID),
        FOREIGN KEY (Group_ID) REFERENCES Группы (Group_ID),
        FOREIGN KEY (Discipline_ID) REFERENCES Дисциплины (Discipline_ID)
)`;

const createPesonalPlan = `Create table if not exists Персональный_план (
    Personal_ID     INTEGER,
    UP_ID           INTEGER,
    Часы            INTEGER NOT NULL,
        PRIMARY KEY (Personal_ID, UP_ID),
        FOREIGN KEY (UP_ID) REFERENCES Учебный_план (UP_ID),
        FOREIGN KEY (Personal_ID) REFERENCES Кафедра (Personal_ID)
)`;



(`Select * From Кафедра`)
(`Select * From Группы`)
(`Select * From Дисциплины`)
(`Select * From Учебный_план`)
(`Select * From Персональный_план`)



(`Insert into Кафедра ()
               Values ()
`)
(`Insert into Группы ()
              Values ()
`)
(`Insert into Дисциплины ()
                  Values ()
`)
(`Insert into Учебный_план ()
                    Values ()
`)
(`Insert into Персональный_план ()
                         Values ()
`)



(`Update Кафедра ()
             Set ()
             Where Personal_ID = 
`)
(`Update Группы ()
            Set ()
            Where Group_ID = 
`)
(`Update Дисциплины ()
             Set ()
             Where Personal_ID = 
`)
(`Update Учебный_план ()
             Set ()
             Where UP_ID = 
`)
(`Update Персональный_план ()
             Set ()
             Where Personal_ID = 
`)