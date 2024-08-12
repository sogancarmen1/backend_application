CREATE TABLE public.users (
	id serial NOT NULL,
	email varchar(30) NOT NULL,
	first_name varchar(30),
	last_name varchar(40),
	password varchar(100),
	role varchar(40),
	CONSTRAINT users_pk PRIMARY KEY (id)
);

ALTER TABLE public.users OWNER TO postgres;

CREATE TABLE public.projects (
	id serial NOT NULL,
	name varchar(30),
	description varchar(100),
	CONSTRAINT projects_pk PRIMARY KEY (id)
);

ALTER TABLE public.projects OWNER TO postgres;

CREATE TABLE public.tasks (
	id serial NOT NULL,
	name varchar(30),
	priority varchar(40),
	due_date date,
	status varchar(30),
	description varchar(100),
	assigned_to varchar(30),
	id_projects integer,
	CONSTRAINT tasks_pk PRIMARY KEY (id)
);

ALTER TABLE public.tasks OWNER TO postgres;

CREATE TABLE public.members (
	id_users integer NOT NULL,
	id_projects integer NOT NULL,
	role_type varchar(30),
	CONSTRAINT members_pk PRIMARY KEY (id_users,id_projects)
);

ALTER TABLE public.members ADD CONSTRAINT users_fk FOREIGN KEY (id_users)
REFERENCES public.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE public.members ADD CONSTRAINT projects_fk FOREIGN KEY (id_projects)
REFERENCES public.projects (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE public.tasks ADD CONSTRAINT projects_fk FOREIGN KEY (id_projects)
REFERENCES public.projects (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;

