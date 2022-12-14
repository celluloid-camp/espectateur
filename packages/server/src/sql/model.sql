--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Debian 12.2-2.pgdg100+1)
-- Dumped by pg_dump version 12.2

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
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public."UserRole" AS ENUM (
    'Admin',
    'Teacher',
    'Student'
);

CREATE TYPE public."Player" AS ENUM (
    'Youtube',
    'Local'
);


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Annotation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Annotation" (
    id uuid NOT NULL,
    text text NOT NULL,
    "startTime" real NOT NULL,
    "stopTime" real NOT NULL,
    pause boolean NOT NULL,
    performance_mode boolean NOT NULL,
    "userId" uuid NOT NULL,
    "projectId" uuid NOT NULL,
    ontology text[],
    sequencing boolean NOT NULL
);


--
-- Name: Comment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Comment" (
    id uuid NOT NULL,
    "annotationId" uuid NOT NULL,
    "userId" uuid NOT NULL,
    text text NOT NULL,
    "createdAt" timestamp without time zone NOT NULL
);


--
-- Name: Language; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Language" (
    id character(3) NOT NULL,
    name text
);


--
-- Name: Project; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Project" (
    id uuid NOT NULL,
    "videoId" uuid NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    assignments text[],
    "publishedAt" timestamp without time zone NOT NULL,
    objective text NOT NULL,
    "levelStart" integer NOT NULL,
    "levelEnd" integer NOT NULL,
    public boolean NOT NULL,
    collaborative boolean NOT NULL,
    "userId" uuid NOT NULL,
    shared boolean DEFAULT false NOT NULL,
    "shareName" text,
    "shareExpiresAt" timestamp without time zone,
    "sharePassword" text
);


--
-- Name: Session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Session" (
    sid text NOT NULL,
    session text NOT NULL,
    "expiresAt" timestamp without time zone NOT NULL
);


--
-- Name: Tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Tag" (
    id uuid NOT NULL,
    name text NOT NULL,
    featured boolean NOT NULL
);


--
-- Name: TagToProject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."TagToProject" (
    "tagId" uuid NOT NULL,
    "projectId" uuid NOT NULL
);


--
-- Name: User; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."User" (
    id uuid NOT NULL,
    email text,
    password text NOT NULL,
    confirmed boolean DEFAULT false NOT NULL,
    code character(6),
    "codeGeneratedAt" timestamp without time zone,
    username text NOT NULL,
    role public."UserRole" DEFAULT 'Teacher'::public."UserRole" NOT NULL,
    "passwordHint" text,
    CONSTRAINT "Project_check_userValid" CHECK ((((role = ANY (ARRAY['Teacher'::public."UserRole", 'Admin'::public."UserRole"])) AND (email IS NOT NULL)) OR ((role = 'Student'::public."UserRole") AND ("passwordHint" IS NOT NULL))))
);


--
-- Name: UserToProject; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."UserToProject" (
    "userId" uuid NOT NULL,
    "projectId" uuid NOT NULL,
    CONSTRAINT "UserToProject_unique_keys" UNIQUE ("userId", "projectId")
);


--
-- Name: Video; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."Video" (
    id uuid NOT NULL,
    title text NOT NULL,
    player public."Player" DEFAULT 'Youtube'::public."Player" NOT NULL,
    path text NOT NULL,
    dublin_title text[],
    dublin_creator text[],
    dublin_subject text[],
    dublin_description text[],  
    dublin_publisher text[],
    dublin_contributor text[],
    dublin_date text[],
    dublin_type text[],
    dublin_format text[],
    dublin_identifier text[],
    dublin_source text[],
    dublin_language text[],
    dublin_relation text[],
    dublin_coverage text[],
    dublin_rights text[]
);


--
-- Name: Annotation Annotation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Annotation"
    ADD CONSTRAINT "Annotation_pkey" PRIMARY KEY (id);


--
-- Name: Language Language_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Language"
    ADD CONSTRAINT "Language_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_pkey" PRIMARY KEY (id);


--
-- Name: Project Project_shareName_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_shareName_unique" UNIQUE ("shareName");


--
-- Name: Session Session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Session"
    ADD CONSTRAINT "Session_pkey" PRIMARY KEY (sid);


--
-- Name: Tag Subjects_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Subjects_name_key" UNIQUE (name);


--
-- Name: Tag Subjects_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Tag"
    ADD CONSTRAINT "Subjects_pkey" PRIMARY KEY (id);


--
-- Name: User User_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_email_key" UNIQUE (email);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: User User_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_username_key" UNIQUE (username);


--
-- Name: Video Video_path_player_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_path_player_unique" UNIQUE (path, player);


--
-- Name: Video Video_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Video"
    ADD CONSTRAINT "Video_pkey" PRIMARY KEY (id);


--
-- Name: TagToProjectTagIdProjectIdUnique; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "TagToProjectTagIdProjectIdUnique" ON public."TagToProject" USING btree ("tagId", "projectId");


--
-- Name: Annotation Annotation_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Annotation"
    ADD CONSTRAINT "Annotation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON DELETE CASCADE;


--
-- Name: Annotation Annotation_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Annotation"
    ADD CONSTRAINT "Annotation_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- Name: Comment Comment_annotationId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_annotationId_fkey" FOREIGN KEY ("annotationId") REFERENCES public."Annotation"(id) ON DELETE CASCADE;


--
-- Name: Comment Comment_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- Name: Project Project_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- Name: Project Project_videoId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."Project"
    ADD CONSTRAINT "Project_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES public."Video"(id) ON DELETE CASCADE;


--
-- Name: TagToProject TagToProject_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TagToProject"
    ADD CONSTRAINT "TagToProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON DELETE CASCADE;


--
-- Name: TagToProject TagToProject_tagId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."TagToProject"
    ADD CONSTRAINT "TagToProject_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES public."Tag"(id) ON DELETE CASCADE;


--
-- Name: UserToProject UserToProject_projectId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserToProject"
    ADD CONSTRAINT "UserToProject_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES public."Project"(id) ON DELETE CASCADE;


--
-- Name: UserToProject UserToProject_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."UserToProject"
    ADD CONSTRAINT "UserToProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

