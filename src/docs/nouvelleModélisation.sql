CREATE DATABASE new_database;
CREATE TABLE public.projects (
	id serial NOT NULL,
	name varchar NOT NULL,
	description text,
	CONSTRAINT id PRIMARY KEY (id)
);

ALTER TABLE public.projects OWNER TO postgres;

CREATE TABLE public.users (
	id serial NOT NULL,
	email varchar NOT NULL,
	first_name varchar NOT NULL,
	last_name varchar NOT NULL,
	password varchar NOT NULL,
	role varchar NOT NULL,
	CONSTRAINT id_2 PRIMARY KEY (id)
);

ALTER TABLE public.users OWNER TO postgres;

CREATE TABLE public.tasks (
	id serial NOT NULL,
	name varchar NOT NULL,
	due_date date NOT NULL,
	priority varchar NOT NULL,
	status varchar NOT NULL,
	assigned_to varchar NOT NULL,
	id_projects integer,
	description text,
	CONSTRAINT id_1 PRIMARY KEY (id)
);

ALTER TABLE public.tasks OWNER TO postgres;

CREATE TABLE public.many_users_has_many_projects (
	id_users integer NOT NULL,
	id_projects integer NOT NULL,
	role_type varchar NOT NULL,
	CONSTRAINT many_users_has_many_projects_pk PRIMARY KEY (id_users,id_projects)
);

ALTER TABLE public.many_users_has_many_projects ADD CONSTRAINT users_fk FOREIGN KEY (id_users)
REFERENCES public.users (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE public.many_users_has_many_projects ADD CONSTRAINT projects_fk FOREIGN KEY (id_projects)
REFERENCES public.projects (id) MATCH FULL
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE public.tasks ADD CONSTRAINT projects_fk FOREIGN KEY (id_projects)
REFERENCES public.projects (id) MATCH FULL
ON DELETE SET NULL ON UPDATE CASCADE;


