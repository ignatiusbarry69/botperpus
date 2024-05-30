--
-- PostgreSQL database dump
--

-- Dumped from database version 16.2 (Debian 16.2-1.pgdg120+2)
-- Dumped by pg_dump version 16.2

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: statuspeminjaman; Type: TYPE; Schema: public; Owner: admin
--

CREATE TYPE public.statuspeminjaman AS ENUM (
    'selesai',
    'berlangsung'
);


ALTER TYPE public.statuspeminjaman OWNER TO admin;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: mahasiswa; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.mahasiswa (
    nim integer NOT NULL,
    nama_mahasiswa character varying(255) NOT NULL,
    email_mahasiswa character varying(255) NOT NULL
);


ALTER TABLE public.mahasiswa OWNER TO admin;

--
-- Name: peminjaman; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.peminjaman (
    id_peminjaman integer NOT NULL,
    id_ruang character varying(100),
    nim integer,
    waktu_start bigint,
    waktu_selesai bigint
);


ALTER TABLE public.peminjaman OWNER TO admin;

--
-- Name: peminjaman_id_peminjaman_seq; Type: SEQUENCE; Schema: public; Owner: admin
--

ALTER TABLE public.peminjaman ALTER COLUMN id_peminjaman ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.peminjaman_id_peminjaman_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: ruang; Type: TABLE; Schema: public; Owner: admin
--

CREATE TABLE public.ruang (
    id_ruang character varying(100) NOT NULL,
    nama_ruang character varying(255) NOT NULL
);


ALTER TABLE public.ruang OWNER TO admin;

--
-- Data for Name: mahasiswa; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.mahasiswa (nim, nama_mahasiswa, email_mahasiswa) FROM stdin;
71200577	Ignatius Barry Santoso	ignatius.barry@ti.ukdw.ac.id
71200626	Satriadinata	satriadinata@ti.ukdw.ac.id
71210703	Alexandro	alexandro@ti.ukdw.ac.id
71200555	Narendra Wisnoe	narendra.poetra@ti.ukdw.ac.id
71210690	Andreas Anditya	andreanditya@ti.ukdw.ac.id
\.


--
-- Data for Name: peminjaman; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.peminjaman (id_peminjaman, id_ruang, nim, waktu_start, waktu_selesai) FROM stdin;
1	rbbm3	71200577	1716042600000	1716046200000
2	rbbm4	71200577	1716003000000	1716015600000
3	rbbm7	71200577	1716003000000	1716015600000
4	rbbm7	71200577	1715997600000	1716001200000
5	rbbm7	71200577	1716084000000	1716087600000
6	rbbm7	71200577	1716091200000	1716094800000
7	rbbm8	71200577	1716084000000	1716091200000
8	rbbm1	71200577	1716084000000	1716089400000
9	rbbm1	71200577	1716089700000	1716100200000
10	rdlt2	71200577	1716174000000	1716181200000
11	rdlt2	71200577	1716184800000	1716188400000
12	rdlt2	71200577	1716166800000	1716170400000
13	rbbm8	71200577	1716346800000	1716350400000
14	rbbm7	71200577	1716350400000	1716354000000
15	rbbm9	71200577	1716336000000	1716345900000
17	rbbm5	71200577	1716346800000	1716350400000
18	rav	71210703	1716487200000	1716490800000
19	rdlt2	71200577	1716616800000	1716620400000
20	rbbm3	71200577	1716606000000	1716615000000
21	rbbm3	71200577	1716606000000	1716615000000
22	rdlt2	71200577	1716703200000	1716706800000
23	rav	71200577	1716703200000	1716710400000
24	rav	71200577	1716699600000	1716702300000
25	rbbm7	71200555	1716778800000	1716782400000
26	rbbm7	71200577	1716865200000	1716872400000
27	rbbm6	71200577	1716865200000	1716872400000
28	rbbm7	71200555	1716872400000	1716876000000
29	rav	71200577	1716865200000	1716876000000
30	rav	71200626	1716876000000	1716901200000
31	rdlt2	71210690	1716861600000	1716872400000
64	rbbm6	71200577	1717048800000	1717052400000
\.


--
-- Data for Name: ruang; Type: TABLE DATA; Schema: public; Owner: admin
--

COPY public.ruang (id_ruang, nama_ruang) FROM stdin;
rbbm1	Ruang Bilik Belajar Mandiri 1
rbbm2	Ruang Bilik Belajar Mandiri 2
rbbm3	Ruang Bilik Belajar Mandiri 3
rbbm4	Ruang Bilik Belajar Mandiri 4
rbbm5	Ruang Bilik Belajar Mandiri 5
rbbm6	Ruang Bilik Belajar Mandiri 6
rbbm7	Ruang Bilik Belajar Mandiri 7
rbbm8	Ruang Bilik Belajar Mandiri 8
rbbm9	Ruang Bilik Belajar Mandiri 9
rav	Ruang Audio Visual
rdlt2	Ruang Diskusi Lantai 2
\.


--
-- Name: peminjaman_id_peminjaman_seq; Type: SEQUENCE SET; Schema: public; Owner: admin
--

SELECT pg_catalog.setval('public.peminjaman_id_peminjaman_seq', 64, true);


--
-- Name: mahasiswa mahasiswa_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.mahasiswa
    ADD CONSTRAINT mahasiswa_pkey PRIMARY KEY (nim);


--
-- Name: peminjaman peminjaman_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.peminjaman
    ADD CONSTRAINT peminjaman_pkey PRIMARY KEY (id_peminjaman);


--
-- Name: ruang ruang_pkey; Type: CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.ruang
    ADD CONSTRAINT ruang_pkey PRIMARY KEY (id_ruang);


--
-- Name: peminjaman fk_mahasiswa; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.peminjaman
    ADD CONSTRAINT fk_mahasiswa FOREIGN KEY (nim) REFERENCES public.mahasiswa(nim) ON DELETE CASCADE;


--
-- Name: peminjaman fk_ruang; Type: FK CONSTRAINT; Schema: public; Owner: admin
--

ALTER TABLE ONLY public.peminjaman
    ADD CONSTRAINT fk_ruang FOREIGN KEY (id_ruang) REFERENCES public.ruang(id_ruang) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

