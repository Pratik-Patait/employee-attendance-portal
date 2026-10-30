--
-- PostgreSQL database dump
--

\restrict WNc8hjrh4uL1jNIUKHJYrSL7OKAADsb5g6VfxfFeMmb5o1ppD6PMmsq3TEWSoWu

-- Dumped from database version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)
-- Dumped by pg_dump version 18.6 (Ubuntu 18.6-0ubuntu0.26.04.1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_manager_id_fkey;
ALTER TABLE IF EXISTS ONLY public.leave_requests DROP CONSTRAINT IF EXISTS leave_requests_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.leave_requests DROP CONSTRAINT IF EXISTS leave_requests_leave_type_id_fkey;
ALTER TABLE IF EXISTS ONLY public.leave_requests DROP CONSTRAINT IF EXISTS leave_requests_actioned_by_fkey;
ALTER TABLE IF EXISTS ONLY public.attendance_records DROP CONSTRAINT IF EXISTS attendance_records_user_id_fkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_username_key;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.attendance_records DROP CONSTRAINT IF EXISTS unique_user_daily_attendance;
ALTER TABLE IF EXISTS ONLY public.leave_types DROP CONSTRAINT IF EXISTS leave_types_pkey;
ALTER TABLE IF EXISTS ONLY public.leave_types DROP CONSTRAINT IF EXISTS leave_types_name_key;
ALTER TABLE IF EXISTS ONLY public.leave_requests DROP CONSTRAINT IF EXISTS leave_requests_pkey;
ALTER TABLE IF EXISTS ONLY public.attendance_records DROP CONSTRAINT IF EXISTS attendance_records_pkey;
ALTER TABLE IF EXISTS ONLY public."SequelizeMeta" DROP CONSTRAINT IF EXISTS "SequelizeMeta_pkey";
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.leave_types ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.leave_requests ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.attendance_records ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.leave_types_id_seq;
DROP TABLE IF EXISTS public.leave_types;
DROP SEQUENCE IF EXISTS public.leave_requests_id_seq;
DROP TABLE IF EXISTS public.leave_requests;
DROP SEQUENCE IF EXISTS public.attendance_records_id_seq;
DROP TABLE IF EXISTS public.attendance_records;
DROP TABLE IF EXISTS public."SequelizeMeta";
DROP TYPE IF EXISTS public.enum_users_role;
DROP TYPE IF EXISTS public.enum_leave_requests_status;
--
-- Name: enum_leave_requests_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_leave_requests_status AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.enum_users_role AS ENUM (
    'EMPLOYEE',
    'MANAGER',
    'HR'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: SequelizeMeta; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."SequelizeMeta" (
    name character varying(255) NOT NULL
);


--
-- Name: attendance_records; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance_records (
    id integer NOT NULL,
    user_id integer NOT NULL,
    date date NOT NULL,
    check_in_time timestamp with time zone NOT NULL,
    check_out_time timestamp with time zone,
    total_hours numeric(4,2),
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: attendance_records_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attendance_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attendance_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_records_id_seq OWNED BY public.attendance_records.id;


--
-- Name: leave_requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    leave_type_id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    reason text NOT NULL,
    status public.enum_leave_requests_status DEFAULT 'PENDING'::public.enum_leave_requests_status NOT NULL,
    manager_remark text,
    actioned_by integer,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: leave_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leave_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leave_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leave_requests_id_seq OWNED BY public.leave_requests.id;


--
-- Name: leave_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leave_types (
    id integer NOT NULL,
    name character varying(50) NOT NULL,
    annual_quota integer NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: leave_types_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.leave_types_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: leave_types_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.leave_types_id_seq OWNED BY public.leave_types.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password_hash character varying(255) NOT NULL,
    full_name character varying(100) NOT NULL,
    role public.enum_users_role DEFAULT 'EMPLOYEE'::public.enum_users_role NOT NULL,
    manager_id integer,
    is_active boolean DEFAULT true NOT NULL,
    last_active_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: attendance_records id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records ALTER COLUMN id SET DEFAULT nextval('public.attendance_records_id_seq'::regclass);


--
-- Name: leave_requests id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests ALTER COLUMN id SET DEFAULT nextval('public.leave_requests_id_seq'::regclass);


--
-- Name: leave_types id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_types ALTER COLUMN id SET DEFAULT nextval('public.leave_types_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: SequelizeMeta; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."SequelizeMeta" (name) FROM stdin;
20261029113407-create-users.js
20261029113417-create-leave-types.js
20261029113426-create-attendance-records.js
20261029113434-create-leave-requests.js
\.


--
-- Data for Name: attendance_records; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance_records (id, user_id, date, check_in_time, check_out_time, total_hours, created_at, updated_at) FROM stdin;
1	4	2026-10-30	2026-10-30 12:25:29.872+05:30	2026-10-30 12:29:24.675+05:30	0.07	2026-10-30 12:25:29.873+05:30	2026-10-30 12:29:24.675+05:30
\.


--
-- Data for Name: leave_requests; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_requests (id, user_id, leave_type_id, start_date, end_date, reason, status, manager_remark, actioned_by, created_at, updated_at) FROM stdin;
1	4	1	2026-11-05	2026-11-06	Personal family event	APPROVED	Approved. Please hand over pending tasks before leaving.	3	2026-10-30 12:45:26.128+05:30	2026-10-30 14:55:27.345+05:30
\.


--
-- Data for Name: leave_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.leave_types (id, name, annual_quota, is_active, created_at, updated_at) FROM stdin;
1	Casual Leave	12	t	2026-10-30 12:00:51.736+05:30	2026-10-30 12:00:51.736+05:30
2	Sick Leave	10	t	2026-10-30 12:00:51.736+05:30	2026-10-30 12:00:51.736+05:30
3	Earned Leave	15	t	2026-10-30 12:00:51.736+05:30	2026-10-30 12:00:51.736+05:30
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, username, password_hash, full_name, role, manager_id, is_active, last_active_at, created_at, updated_at) FROM stdin;
2	manager_one	$2b$10$RzyZsZyhNebuNzJhf963qe0uk6oo9AIBIAqWWz67v8sx51k9.a6ZS	Rajesh Verma (Senior Manager)	MANAGER	\N	t	\N	2026-10-30 12:00:51.736+05:30	2026-10-30 12:00:51.736+05:30
5	emp_two	$2b$10$RzyZsZyhNebuNzJhf963qe0uk6oo9AIBIAqWWz67v8sx51k9.a6ZS	Sneha Kulkarni (Employee)	EMPLOYEE	3	t	\N	2026-10-30 12:00:51.736+05:30	2026-10-30 12:00:51.736+05:30
1	hr_admin	$2b$10$RzyZsZyhNebuNzJhf963qe0uk6oo9AIBIAqWWz67v8sx51k9.a6ZS	Priya Sharma (HR)	HR	\N	t	\N	2026-10-30 12:00:51.736+05:30	2026-10-30 15:38:26.625+05:30
3	manager_two	$2b$10$RzyZsZyhNebuNzJhf963qe0uk6oo9AIBIAqWWz67v8sx51k9.a6ZS	Vikram Desai (Team Manager)	MANAGER	2	t	\N	2026-10-30 12:00:51.736+05:30	2026-10-30 15:39:00.834+05:30
4	emp_one	$2b$10$RzyZsZyhNebuNzJhf963qe0uk6oo9AIBIAqWWz67v8sx51k9.a6ZS	Aarav Patel (Employee)	EMPLOYEE	3	t	\N	2026-10-30 12:00:51.736+05:30	2026-10-30 15:39:28.572+05:30
\.


--
-- Name: attendance_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attendance_records_id_seq', 1, true);


--
-- Name: leave_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leave_requests_id_seq', 1, true);


--
-- Name: leave_types_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.leave_types_id_seq', 3, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 5, true);


--
-- Name: SequelizeMeta SequelizeMeta_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."SequelizeMeta"
    ADD CONSTRAINT "SequelizeMeta_pkey" PRIMARY KEY (name);


--
-- Name: attendance_records attendance_records_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_pkey PRIMARY KEY (id);


--
-- Name: leave_requests leave_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_pkey PRIMARY KEY (id);


--
-- Name: leave_types leave_types_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_name_key UNIQUE (name);


--
-- Name: leave_types leave_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_types
    ADD CONSTRAINT leave_types_pkey PRIMARY KEY (id);


--
-- Name: attendance_records unique_user_daily_attendance; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT unique_user_daily_attendance UNIQUE (user_id, date);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: attendance_records attendance_records_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance_records
    ADD CONSTRAINT attendance_records_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: leave_requests leave_requests_actioned_by_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_actioned_by_fkey FOREIGN KEY (actioned_by) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: leave_requests leave_requests_leave_type_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_leave_type_id_fkey FOREIGN KEY (leave_type_id) REFERENCES public.leave_types(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: leave_requests leave_requests_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leave_requests
    ADD CONSTRAINT leave_requests_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: users users_manager_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_manager_id_fkey FOREIGN KEY (manager_id) REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- PostgreSQL database dump complete
--

\unrestrict WNc8hjrh4uL1jNIUKHJYrSL7OKAADsb5g6VfxfFeMmb5o1ppD6PMmsq3TEWSoWu

